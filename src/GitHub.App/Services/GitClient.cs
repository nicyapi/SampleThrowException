﻿using System;
using System.ComponentModel.Composition;
using System.IO;
using System.Linq;
using System.Reactive.Linq;
using System.Threading.Tasks;
using GitHub.Extensions;
using GitHub.Primitives;
using LibGit2Sharp;
using NullGuard;
using System.Diagnostics;
using NLog;

namespace GitHub.Services
{
    [Export(typeof(IGitClient))]
    [PartCreationPolicy(CreationPolicy.Shared)]
    public class GitClient : IGitClient
    {
        static readonly Logger log = LogManager.GetCurrentClassLogger();
        readonly PullOptions pullOptions;
        readonly PushOptions pushOptions;
        readonly FetchOptions fetchOptions;

        [ImportingConstructor]
        public GitClient(IGitHubCredentialProvider credentialProvider)
        {
            pushOptions = new PushOptions { CredentialsProvider = credentialProvider.HandleCredentials };
            fetchOptions = new FetchOptions { CredentialsProvider = credentialProvider.HandleCredentials };
            pullOptions = new PullOptions
            {
                FetchOptions = fetchOptions,
                MergeOptions = new MergeOptions(),
            };
        }

        public Task Pull(IRepository repository)
        {
            Guard.ArgumentNotNull(repository, nameof(repository));

            return Task.Factory.StartNew(() =>
            {
                var signature = repository.Config.BuildSignature(DateTimeOffset.UtcNow);
                repository.Network.Pull(signature, pullOptions);
            });
        }

        public Task Push(IRepository repository, string branchName, string remoteName)
        {
            Guard.ArgumentNotNull(repository, nameof(repository));
            Guard.ArgumentNotEmptyString(branchName, nameof(branchName));
            Guard.ArgumentNotEmptyString(remoteName, nameof(remoteName));

            return Task.Factory.StartNew(() =>
            {
                if (repository.Head?.Commits != null && repository.Head.Commits.Any())
                {
                    var remote = repository.Network.Remotes[remoteName];
                    var remoteRef = IsCanonical(branchName) ? branchName : @"refs/heads/" + branchName;
                    repository.Network.Push(remote, "HEAD", remoteRef, pushOptions);
                }
            });
        }

        public Task Fetch(IRepository repository, string remoteName)
        {
            Guard.ArgumentNotNull(repository, nameof(repository));
            Guard.ArgumentNotEmptyString(remoteName, nameof(remoteName));

            return Task.Factory.StartNew(() =>
            {
                try
                {
                    var remote = repository.Network.Remotes[remoteName];
                    repository.Network.Fetch(remote, fetchOptions);
                }
                catch (Exception ex)
                {
                    log.Error("Failed to fetch", ex);
#if DEBUG
                    throw;
#endif
                }
            });
        }

        public Task Fetch(IRepository repository, string remoteName, params string[] refspecs)
        {
            Guard.ArgumentNotNull(repository, nameof(repository));
            Guard.ArgumentNotEmptyString(remoteName, nameof(remoteName));

            return Task.Factory.StartNew(() =>
            {
                try
                {
                    var remote = repository.Network.Remotes[remoteName];
                    repository.Network.Fetch(remote, refspecs, fetchOptions);
                }
                catch(Exception ex)
                {
                    log.Error("Failed to fetch", ex);
#if DEBUG
                    throw;
#endif
                }
            });
        }

        public Task Checkout(IRepository repository, string branchName)
        {
            Guard.ArgumentNotNull(repository, nameof(repository));
            Guard.ArgumentNotEmptyString(branchName, nameof(branchName));

            return Task.Factory.StartNew(() =>
            {
                repository.Checkout(branchName);
            });
        }

        public Task CreateBranch(IRepository repository, string branchName)
        {
            Guard.ArgumentNotNull(repository, nameof(repository));
            Guard.ArgumentNotEmptyString(branchName, nameof(branchName));

            return Task.Factory.StartNew(() =>
            {
                repository.CreateBranch(branchName);
            });
        }

        public Task<TreeChanges> Compare(
            IRepository repository,
            string sha1,
            string sha2,
            bool detectRenames)
        {
            Guard.ArgumentNotNull(repository, nameof(repository));
            Guard.ArgumentNotEmptyString(sha1, nameof(sha1));
            Guard.ArgumentNotEmptyString(sha2, nameof(sha2));

            return Task.Factory.StartNew(() =>
            {
                var options = new CompareOptions
                {
                    Similarity = detectRenames ? SimilarityOptions.Renames : SimilarityOptions.None
                };

                var commit1 = repository.Lookup<Commit>(sha1);
                var commit2 = repository.Lookup<Commit>(sha2);

                if (commit1 != null && commit2 != null)
                {
                    return repository.Diff.Compare<TreeChanges>(commit1.Tree, commit2.Tree, options);
                }
                else
                {
                    return null;
                }
            });
        }

        public Task<T> GetConfig<T>(IRepository repository, string key)
        {
            Guard.ArgumentNotNull(repository, nameof(repository));
            Guard.ArgumentNotEmptyString(key, nameof(key));

            return Task.Factory.StartNew(() =>
            {
                var result = repository.Config.Get<T>(key);
                return result != null ? result.Value : default(T);
            });
        }

        public Task SetConfig(IRepository repository, string key, string value)
        {
            Guard.ArgumentNotNull(repository, nameof(repository));
            Guard.ArgumentNotEmptyString(key, nameof(key));
            Guard.ArgumentNotEmptyString(value, nameof(value));

            return Task.Factory.StartNew(() =>
            {
                repository.Config.Set(key, value);
            });
        }

        public Task SetRemote(IRepository repository, string remoteName, Uri url)
        {
            Guard.ArgumentNotNull(repository, nameof(repository));
            Guard.ArgumentNotEmptyString(remoteName, nameof(remoteName));

            return Task.Factory.StartNew(() =>
            {
                repository.Config.Set("remote." + remoteName + ".url", url.ToString());
                repository.Config.Set("remote." + remoteName + ".fetch", "+refs/heads/*:refs/remotes/" + remoteName + "/*");
            });
        }

        public Task SetTrackingBranch(IRepository repository, string branchName, string remoteName)
        {
            Guard.ArgumentNotNull(repository, nameof(repository));
            Guard.ArgumentNotEmptyString(branchName, nameof(branchName));
            Guard.ArgumentNotEmptyString(remoteName, nameof(remoteName));

            return Task.Factory.StartNew(() =>
            {
                var remoteBranchName = IsCanonical(remoteName) ? remoteName : "refs/remotes/" + remoteName + "/" + branchName;
                var remoteBranch = repository.Branches[remoteBranchName];
                // if it's null, it's because nothing was pushed
                if (remoteBranch != null)
                {
                    var localBranchName = IsCanonical(branchName) ? branchName : "refs/heads/" + branchName;
                    var localBranch = repository.Branches[localBranchName];
                    repository.Branches.Update(localBranch, b => b.TrackedBranch = remoteBranch.CanonicalName);
                }
            });
        }

        public Task UnsetConfig(IRepository repository, string key)
        {
            Guard.ArgumentNotEmptyString(key, nameof(key));

            return Task.Factory.StartNew(() =>
            {
                repository.Config.Unset(key);
            });
        }

        public Task<Remote> GetHttpRemote(IRepository repo, string remote)
        {
            return Task.Factory.StartNew(() =>
            {
                var uri = GitService.GitServiceHelper.GetRemoteUri(repo, remote);
                var remoteName = uri.IsHypertextTransferProtocol ? remote : remote + "-http";
                var ret = repo.Network.Remotes[remoteName];
                if (ret == null)
                    ret = repo.Network.Remotes.Add(remoteName, UriString.ToUriString(uri.ToRepositoryUrl()));
                return ret;
            });
        }

        [return: AllowNull]
        public async Task<string> ExtractFile(IRepository repository, string commitSha, string fileName)
        {
            var commit = repository.Lookup<Commit>(commitSha);

            if (commit == null)
            {
                return null;
            }

            var blob = commit[fileName]?.Target as Blob;
            var tempDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
            var tempFileName = $"{Path.GetFileNameWithoutExtension(fileName)}@{commitSha}{Path.GetExtension(fileName)}";
            var tempFile = Path.Combine(tempDir, tempFileName);

            Directory.CreateDirectory(tempDir);

            if (blob != null)
            {
                using (var source = blob.GetContentStream(new FilteringOptions(fileName)))
                using (var destination = File.OpenWrite(tempFile))
                {
                    await source.CopyToAsync(destination);
                }
            }
            else
            {
                File.Create(tempFile).Dispose();
            }

            return tempFile;
        }

        static bool IsCanonical(string s)
        {
            return s.StartsWith("refs/", StringComparison.Ordinal);
        }
    }
}
