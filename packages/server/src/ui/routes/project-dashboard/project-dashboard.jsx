/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {h} from 'preact';
import {route} from 'preact-router';
import _ from '@lhci/utils/src/lodash.js';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import {useProjectBuilds, useProject} from '../../hooks/use-api-data';
import {AsyncLoader, combineLoadingStates, combineAsyncData} from '../../components/async-loader';
import {Paper} from '../../components/paper.jsx';
=======
import {useProjectBuilds, useProjectBySlug} from '../../hooks/use-api-data';
import {AsyncLoader, combineLoadingStates, combineAsyncData} from '../../components/async-loader';
>>>>>>> Stashed changes
=======
import {useProjectBuilds, useProjectBySlug} from '../../hooks/use-api-data';
import {AsyncLoader, combineLoadingStates, combineAsyncData} from '../../components/async-loader';
>>>>>>> Stashed changes
import {ProjectGettingStarted} from './getting-started.jsx';
import {Page} from '../../layout/page.jsx';
import {ProjectGraphs} from './project-graphs.jsx';

import './project-dashboard.css';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
import {Pill} from '../../components/pill';
import {DocumentTitle} from '../../components/document-title';
>>>>>>> Stashed changes
=======
import {Pill} from '../../components/pill';
import {DocumentTitle} from '../../components/document-title';
>>>>>>> Stashed changes

/** @param {{project: LHCI.ServerCommand.Project, builds: Array<LHCI.ServerCommand.Build>, runUrl?: string, branch?: string}} props */
const ProjectDashboard_ = props => {
  const {project, builds} = props;

  return (
    <div className="dashboard">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      <Paper className="dashboard__recent-activity">
        <h2>Recent Activity</h2>
        <table className="dashboard__build-list">
          {builds.slice(0, 5).map(build => {
            return (
              <tr
                key={build.id}
                onClick={() => route(`/app/projects/${project.id}/builds/${build.id}`)}
              >
                <td className="build-list__avatar">
                  <img src={build.avatarUrl} title={build.author} />
                </td>
                <td className="build-list__commit">{build.commitMessage}</td>
                <td className="build-list__branch">
                  <div className="flex-row">
                    <i className="material-icons">call_split</i>
                    {build.branch}
                  </div>
                </td>
                <td className="build-list__hash">{build.hash.slice(0, 8)}</td>
                <td className="build-list__date">
                  {new Date(build.runAt).toDateString().replace(/\w+ (.*) \d{4}/, '$1')}{' '}
                  {new Date(build.runAt).toLocaleTimeString().replace(/:\d{2} /, ' ')}
                </td>
              </tr>
            );
          })}
        </table>
      </Paper>
=======
=======
>>>>>>> Stashed changes
      <DocumentTitle title={`${project.name} Dashboard`} />
      <div className="dashboard__recent-activity">
        <h2>{project.name}</h2>
        <div className="dashboard__build-list-scroll-container">
          <table className="dashboard__build-list">
            {builds.slice(0, 5).map(build => {
              return (
                <tr
                  key={build.id}
                  onClick={() =>
                    route(`/app/projects/${project.slug}/compare/${_.shortId(build.id)}`)
                  }
                >
                  <td className="build-list__hash" data-tooltip={build.author}>
                    <Pill avatar={build}>{build.hash.slice(0, 8)}</Pill>
                  </td>
                  <td className="build-list__commit">{build.commitMessage}</td>
                  <td className="build-list__branch">
                    <div className="flex-row">
                      <i className="material-icons">call_split</i>
                      {build.branch}
                    </div>
                  </td>
                  <td className="build-list__date">
                    {new Date(build.runAt).toDateString().replace(/\w+ (.*) \d{4}/, '$1')}{' '}
                    {new Date(build.runAt).toLocaleTimeString().replace(/:\d{2} /, ' ')}
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      <ProjectGraphs {...props} />
    </div>
  );
};

<<<<<<< Updated upstream
<<<<<<< Updated upstream
/** @param {{projectId: string, runUrl?: string, branch?: string}} props */
export const ProjectDashboard = props => {
  const projectApiData = useProject(props.projectId);
  const projectBuildData = useProjectBuilds(props.projectId);
=======
=======
>>>>>>> Stashed changes
/** @param {{projectSlug: string, runUrl?: string, branch?: string}} props */
export const ProjectDashboard = props => {
  const projectApiData = useProjectBySlug(props.projectSlug);
  const projectId = projectApiData[1] && projectApiData[1].id;
  const projectBuildData = useProjectBuilds(projectId);
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

  return (
    <Page>
      <AsyncLoader
        loadingState={combineLoadingStates(projectApiData, projectBuildData)}
        asyncData={combineAsyncData(projectApiData, projectBuildData)}
        render={([project, builds]) =>
          builds.length ? (
            <ProjectDashboard_ project={project} builds={builds} {...props} />
          ) : (
            <ProjectGettingStarted project={project} />
          )
        }
      />
    </Page>
  );
};
