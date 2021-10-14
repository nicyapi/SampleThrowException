using System;
using System.ComponentModel.Composition;
using System.IO;
using System.Linq;
using GitHub.Models;
using System.Reactive.Linq;
using Rothko;
using System.Text;
using System.Threading.Tasks;
using System.Reactive.Threading.Tasks;
using GitHub.Primitives;
using System.Text.RegularExpressions;
using System.Globalization;
using System.Reactive;
using System.Collections.Generic;
using LibGit2Sharp;
using PullRequest = Octokit.PullRequest;
using System.Diagnostics;

namespace GitHub.Services
{
    [NullGuard.NullGuard(NullGuard.ValidationFlags.None)]
    [Export(typeof(IPullRequestService))]
    [PartCreationPolicy(CreationPolicy.Shared)]
    public class PullRequestService : IPullRequestService
    {
        const string SettingCreatedByGHfVS = "created-by-ghfvs";
        const string SettingGHfVSPullRequest = "ghfvs-pr";

        static readonly Regex InvalidBranchCharsRegex = new Regex(@"[^0-9A-Za-z\-]", RegexOptions.ECMAScript);
        static readonly Regex BranchCapture = new Regex(@"branch\.(?<branch>.+)\.ghfvs-pr", RegexOptions.ECMAScript);

        static readonly string[] TemplatePaths = new[]
        {
            "PULL_REQUEST_TEMPLATE.md",
            "PULL_REQUEST_TEMPLATE",
            ".github\\PULL_REQUEST_TEMPLATE.md",
            ".github\\PULL_REQUEST_TEMPLATE",
        };

        readonly IGitClient gitClient;
        readonly IGitService gitService;
        readonly IOperatingSystem os;
        readonly IUsageTracker usageTracker;

        [ImportingConstructor]
        public PullRequestService(IGitClient gitClient, IGitService gitService, IOperatingSystem os, IUsageTracker usageTracker)
        {
            this.gitClient = gitClient;
            this.gitService = gitService;
            this.os = os;
            this.usageTracker = usageTracker;
        }

        public IObservable<IPullRequestModel> CreatePullRequest(IRepositoryHost host,
            ILocalRepositoryModel sourceRepository, IRepositoryModel targetRepository,
            IBranch sourceBranch, IBranch targetBranch,
            string title, string body
        )
        {
            Extensions.Guard.ArgumentNotNull(host, nameof(host));
            Extensions.Guard.ArgumentNotNull(sourceRepository, nameof(sourceRepository));
            Extensions.Guard.ArgumentNotNull(targetRepository, nameof(targetRepository));
            Extensions.Guard.ArgumentNotNull(sourceBranch, nameof(sourceBranch));
            Extensions.Guard.ArgumentNotNull(targetBranch, nameof(targetBranch));
            Extensions.Guard.ArgumentNotNull(title, nameof(title));
            Extensions.Guard.ArgumentNotNull(body, nameof(body));

            return PushAndCreatePR(host, sourceRepository, targetRepository, sourceBranch, targetBranch, title, body).ToObservable();
        }

        public IObservable<string> GetPullRequestTemplate(ILocalRepositoryModel repository)
        {
            Extensions.Guard.ArgumentNotNull(repository, nameof(repository));

            return Observable.Defer(() =>
            {
                var paths = TemplatePaths.Select(x => Path.Combine(repository.LocalPath, x));

                foreach (var path in paths)
                {
                    if (os.File.Exists(path))
                    {
                        try { return Observable.Return(os.File.ReadAllText(path, Encoding.UTF8)); } catch { }
                    }
                }
                return Observable.Empty<string>();
            });
        }

        public IObservable<bool> IsWorkingDirectoryClean(ILocalRepositoryModel repository)
        {
            var repo = gitService.GetRepository(repository.LocalPath);
            return Observable.Return(!repo.RetrieveStatus().IsDirty);
        }

        public IObservable<Unit> Pull(ILocalRepositoryModel repository)
        {
            return Observable.Defer(() =>
            {
                var repo = gitService.GetRepository(repository.LocalPath);
                return gitClient.Pull(repo).ToObservable();
            });
        }

        public IObservable<Unit> Push(ILocalRepositoryModel repository)
        {
            return Observable.Defer(() =>
            {
                var repo = gitService.GetRepository(repository.LocalPath);
                return gitClient.Push(repo, repo.Head.TrackedBranch.UpstreamBranchCanonicalName, repo.Head.Remote.Name).ToObservable();
            });
        }

        public IObservable<Unit> Checkout(ILocalRepositoryModel repository, IPullRequestModel pullRequest, string localBranchName)
        {
            return Observable.Defer(async () =>
            {
                var repo = gitService.GetRepository(repository.LocalPath);
                var existing = repo.Branches[localBranchName];

                if (existing != null)
                {
                    await gitClient.Checkout(repo, localBranchName);
                }
                else if (repository.CloneUrl.ToRepositoryUrl() == pullRequest.Head.RepositoryCloneUrl.ToRepositoryUrl())
                {
                    var remote = await gitClient.GetHttpRemote(repo, "origin");
                    await gitClient.Fetch(repo, remote.Name);
                    await gitClient.Checkout(repo, localBranchName);
                }
                else
                {
                    var refSpec = $"{pullRequest.Head.Ref}:{localBranchName}";
                    var prConfigKey = $"branch.{localBranchName}.{SettingGHfVSPullRequest}";
                    var remoteName = await CreateRemote(repo, pullRequest.Head.RepositoryCloneUrl);

                    await gitClient.Fetch(repo, remoteName);
                    await gitClient.Fetch(repo, remoteName, new[] { refSpec });
                    await gitClient.Checkout(repo, localBranchName);
                    await gitClient.SetTrackingBranch(repo, localBranchName, $"refs/remotes/{remoteName}/{pullRequest.Head.Ref}");
                    await gitClient.SetConfig(repo, prConfigKey, pullRequest.Number.ToString());
                }

                return Observable.Return(Unit.Default);
            });
        }

        public IObservable<string> GetDefaultLocalBranchName(ILocalRepositoryModel repository, int pullRequestNumber, string pullRequestTitle)
        {
            return Observable.Defer(() =>
            {
                var initial = "pr/" + pullRequestNumber + "-" + GetSafeBranchName(pullRequestTitle);
                var current = initial;
                var repo = gitService.GetRepository(repository.LocalPath);
                var index = 2;

                while (repo.Branches[current] != null)
                {
                    current = initial + '-' + index++;
                }

                return Observable.Return(current.TrimEnd('-'));
            });
        }

        public IObservable<BranchTrackingDetails> CalculateHistoryDivergence(ILocalRepositoryModel repository, int pullRequestNumber)
        {
            return Observable.Defer(async () =>
            {
                var repo = gitService.GetRepository(repository.LocalPath);
                if (repo.Head.Remote != null)
                    await gitClient.Fetch(repo, repo.Head.Remote.Name);
                return Observable.Return(repo.Head.TrackingDetails);
            });
        }

        public IObservable<TreeChanges> GetTreeChanges(ILocalRepositoryModel repository, IPullRequestModel pullRequest)
        {
            return Observable.Defer(async () =>
            {
                var repo = gitService.GetRepository(repository.LocalPath);
                var remote = await gitClient.GetHttpRemote(repo, "origin");
                await gitClient.Fetch(repo, remote.Name);
                var changes = await gitClient.Compare(repo, pullRequest.Base.Sha, pullRequest.Head.Sha, detectRenames: true);
                return Observable.Return(changes);
            });
        }

        public IObservable<IBranch> GetLocalBranches(ILocalRepositoryModel repository, IPullRequestModel pullRequest)
        {
            return Observable.Defer(() =>
            {
                var repo = gitService.GetRepository(repository.LocalPath);
                var result = GetLocalBranchesInternal(repository, repo, pullRequest).Select(x => new BranchModel(x, repository));
                return result.ToObservable();
            });
        }

        public bool IsPullRequestFromFork(ILocalRepositoryModel repository, IPullRequestModel pullRequest)
        {
            if (pullRequest.Head?.Label != null && pullRequest.Base?.Label != null)
            {
                var headOwner = pullRequest.Head.Label.Split(':')[0];
                var baseOwner = pullRequest.Base.Label.Split(':')[0];
                return headOwner != baseOwner;
            }

            return false;
        }

        public IObservable<Unit> SwitchToBranch(ILocalRepositoryModel repository, IPullRequestModel pullRequest)
        {
            return Observable.Defer(async () =>
            {
                var repo = gitService.GetRepository(repository.LocalPath);
                var branchName = GetLocalBranchesInternal(repository, repo, pullRequest).FirstOrDefault();

                Debug.Assert(branchName != null, "PullRequestService.SwitchToBranch called but no local branch found.");

                if (branchName != null)
                {
                    var remote = await gitClient.GetHttpRemote(repo, "origin");
                    await gitClient.Fetch(repo, remote.Name);

                    var branch = repo.Branches[branchName];

                    if (branch == null)
                    {
                        var trackedBranchName = $"refs/remotes/{remote.Name}/" + branchName;
                        var trackedBranch = repo.Branches[trackedBranchName];

                        if (trackedBranch != null)
                        {
                            branch = repo.CreateBranch(branchName, trackedBranch.Tip);
                            await gitClient.SetTrackingBranch(repo, branchName, trackedBranchName);
                        }
                        else
                        {
                            throw new InvalidOperationException($"Could not find branch '{trackedBranchName}'.");
                        }
                    }

                    await gitClient.Checkout(repo, branchName);
                }

                return Observable.Return(Unit.Default);
            });
        }

        public IObservable<Unit> UnmarkLocalBranch(ILocalRepositoryModel repository)
        {
            return Observable.Defer(async () =>
            {
                var repo = gitService.GetRepository(repository.LocalPath);
                var configKey = $"branch.{repo.Head.FriendlyName}.ghfvs-pr";
                await gitClient.UnsetConfig(repo, configKey);
                return Observable.Return(Unit.Default);
            });
        }

        public IObservable<string> ExtractFile(
            ILocalRepositoryModel repository,
            IModelService modelService,
            string commitSha,
            string fileName,
            string fileSha)
        {
            return Observable.Defer(async () =>
            {
                var repo = gitService.GetRepository(repository.LocalPath);
                var remote = await gitClient.GetHttpRemote(repo, "origin");
                await gitClient.Fetch(repo, remote.Name);
                var result = await GetFileFromRepositoryOrApi(repository, repo, modelService, commitSha, fileName, fileSha);

                if (result == null)
                {
                    throw new FileNotFoundException($"Could not retrieve {fileName}@{commitSha}");
                }

                return Observable.Return(result);
            });
        }

        public IObservable<Tuple<string, string>> ExtractDiffFiles(
            ILocalRepositoryModel repository,
            IModelService modelService,
            IPullRequestModel pullRequest,
            string fileName,
            string fileSha)
        {
            return Observable.Defer(async () =>
            {
                var repo = gitService.GetRepository(repository.LocalPath);
                var remote = await gitClient.GetHttpRemote(repo, "origin");
                await gitClient.Fetch(repo, remote.Name);

                // The left file is the target of the PR so this should already be fetched.
                var left = await gitClient.ExtractFile(repo, pullRequest.Base.Sha, fileName);

                // The right file - if it comes from a fork - may not be fetched so fall back to
                // getting the file contents from the model service.
                var right = await GetFileFromRepositoryOrApi(repository, repo, modelService, pullRequest.Head.Sha, fileName, fileSha);

                if (left == null)
                {
                    throw new FileNotFoundException($"Could not retrieve {fileName}@{pullRequest.Base.Sha}");
                }

                if (right == null)
                {
                    throw new FileNotFoundException($"Could not retrieve {fileName}@{pullRequest.Head.Sha}");
                }

                return Observable.Return(Tuple.Create(left, right));
            });
        }

        async Task<string> GetFileFromRepositoryOrApi(
            ILocalRepositoryModel repository,
            IRepository repo,
            IModelService modelService,
            string commitSha,
            string fileName,
            string fileSha)
        {
            return await gitClient.ExtractFile(repo, commitSha, fileName) ??
                   await modelService.GetFileContents(repository, commitSha, fileName, fileSha);
        }

        public IObservable<Unit> RemoveUnusedRemotes(ILocalRepositoryModel repository)
        {
            return Observable.Defer(async () =>
            {
                var repo = gitService.GetRepository(repository.LocalPath);
                var usedRemotes = new HashSet<string>(
                    repo.Branches
                        .Where(x => !x.IsRemote && x.Remote != null)
                        .Select(x => x.Remote?.Name));

                foreach (var remote in repo.Network.Remotes)
                {
                    var key = $"remote.{remote.Name}.{SettingCreatedByGHfVS}";
                    var createdByUs = await gitClient.GetConfig<bool>(repo, key);

                    if (createdByUs && !usedRemotes.Contains(remote.Name))
                    {
                        repo.Network.Remotes.Remove(remote.Name);
                    }
                }

                return Observable.Return(Unit.Default);
            });
        }

        async Task<string> CreateRemote(IRepository repo, UriString cloneUri)
        {
            foreach (var remote in repo.Network.Remotes)
            {
                if (remote.Url == cloneUri)
                {
                    return remote.Name;
                }
            }

            var remoteName = CreateUniqueRemoteName(repo, cloneUri.Owner);
            await gitClient.SetRemote(repo, remoteName, new Uri(cloneUri));
            await gitClient.SetConfig(repo, $"remote.{remoteName}.{SettingCreatedByGHfVS}", "true");
            return remoteName;
        }

        string CreateUniqueRemoteName(IRepository repo, string name)
        {
            var uniqueName = name;
            var number = 1;

            while (repo.Network.Remotes[uniqueName] != null)
            {
                uniqueName = name + number++;
            }

            return uniqueName;
        }

        IEnumerable<string> GetLocalBranchesInternal(
            ILocalRepositoryModel localRepository,
            IRepository repository,
            IPullRequestModel pullRequest)
        {
            if (!IsPullRequestFromFork(localRepository, pullRequest))
            {
                return new[] { pullRequest.Head.Ref };
            }
            else
            {
                var pr = pullRequest.Number.ToString(CultureInfo.InvariantCulture);
                return repository.Config
                    .Select(x => new { Branch = BranchCapture.Match(x.Key).Groups["branch"].Value, Value = x.Value })
                    .Where(x => !string.IsNullOrWhiteSpace(x.Branch) && x.Value == pr)
                    .Select(x => x.Branch);
            }
        }

        async Task<IPullRequestModel> PushAndCreatePR(IRepositoryHost host,
            ILocalRepositoryModel sourceRepository, IRepositoryModel targetRepository,
            IBranch sourceBranch, IBranch targetBranch,
            string title, string body)
        {
            var repo = await Task.Run(() => gitService.GetRepository(sourceRepository.LocalPath));
            var remote = await gitClient.GetHttpRemote(repo, "origin");
            await gitClient.Push(repo, sourceBranch.Name, remote.Name);

            if (!repo.Branches[sourceBranch.Name].IsTracking)
                await gitClient.SetTrackingBranch(repo, sourceBranch.Name, remote.Name);

            // delay things a bit to avoid a race between pushing a new branch and creating a PR on it
            if (!Splat.ModeDetector.Current.InUnitTestRunner().GetValueOrDefault())
                await Task.Delay(TimeSpan.FromSeconds(5));

            var ret = await host.ModelService.CreatePullRequest(sourceRepository, targetRepository, sourceBranch, targetBranch, title, body);
            await usageTracker.IncrementUpstreamPullRequestCount();
            return ret;
        }

        static string GetSafeBranchName(string name)
        {
            var before = InvalidBranchCharsRegex.Replace(name, "-").TrimEnd('-');

            for (;;)
            {
                string after = before.Replace("--", "-");

                if (after == before)
                {
                    return before.ToLower(CultureInfo.CurrentCulture);
                }

                before = after;
            }
        }
    }
}