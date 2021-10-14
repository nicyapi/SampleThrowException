/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {h} from 'preact';
import {Link} from 'preact-router';
import _ from '@lhci/utils/src/lodash.js';
import {useProjectBuilds, useProject} from '../../hooks/use-api-data';
import {AsyncLoader, combineLoadingStates, combineAsyncData} from '../../components/async-loader';
import {Paper} from '../../components/paper.jsx';
import {ProjectGettingStarted} from './getting-started.jsx';
import {Page} from '../../layout/page.jsx';
import {ProjectGraphs} from './project-graphs.jsx';

import './project-dashboard.css';

/** @param {{project: LHCI.ServerCommand.Project, builds: Array<LHCI.ServerCommand.Build>, runUrl?: string, branch?: string}} props */
const ProjectDashboard_ = props => {
  const {project, builds} = props;

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h2 className="dashboard__project-name">{project.name}</h2>
        <Paper className="dashboard__build-list">
          <table>
            {builds.slice(0, 3).map(build => {
              return (
                <tr key={build.id}>
                  <td>
                    <Link href={`/app/projects/${project.id}/builds/${build.id}`}>
                      {build.branch} ({build.hash.slice(0, 8)}){' '}
                    </Link>
                  </td>
                  <td>{new Date(build.runAt).toLocaleTimeString()}</td>
                </tr>
              );
            })}
          </table>
        </Paper>
      </div>
      <ProjectGraphs {...props} />
    </div>
  );
};

/** @param {{projectId: string, runUrl?: string, branch?: string}} props */
export const ProjectDashboard = props => {
  const projectApiData = useProject(props.projectId);
  const projectBuildData = useProjectBuilds(props.projectId);

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
