/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {h} from 'preact';
import Router from 'preact-router';
import LazyRoute from 'preact-async-route';
import {Redirect} from './components/redirect.jsx';
import './app.css';
import {Page} from './layout/page.jsx';
<<<<<<< Updated upstream
<<<<<<< Updated upstream

const Loader = () => <h1>Loading route...</h1>;
=======
import {LoadingSpinner} from './components/loading-spinner.jsx';
>>>>>>> Stashed changes
=======
import {LoadingSpinner} from './components/loading-spinner.jsx';
>>>>>>> Stashed changes

export const App = () => {
  return (
    <div className="lhci">
      <Router>
        <LazyRoute
          path="/app/projects"
          loading={() => (
            <Page>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
              <Loader />
=======
              <LoadingSpinner />
>>>>>>> Stashed changes
=======
              <LoadingSpinner />
>>>>>>> Stashed changes
            </Page>
          )}
          getComponent={() =>
            import('./routes/project-list/project-list.jsx').then(m => m.ProjectList)
          }
        />
        <LazyRoute
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          path="/app/projects/:projectId"
          loading={() => (
            <Page>
              <Loader />
=======
=======
>>>>>>> Stashed changes
          path="/app/projects/:projectSlug"
          loading={() => (
            <Page>
              <LoadingSpinner />
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
            </Page>
          )}
          getComponent={() =>
            import('./routes/project-dashboard/project-dashboard.jsx').then(m => m.ProjectDashboard)
          }
        />
        <LazyRoute
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          path="/app/projects/:projectId/builds/:buildId"
          loading={() => (
            <Page>
              <Loader />
=======
=======
>>>>>>> Stashed changes
          path="/app/projects/:projectSlug/compare/:partialBuildId"
          loading={() => (
            <Page>
              <LoadingSpinner />
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
            </Page>
          )}
          getComponent={() => import('./routes/build-view/build-view.jsx').then(m => m.BuildView)}
        />
        <Redirect default to="/app/projects" />
      </Router>
    </div>
  );
};
