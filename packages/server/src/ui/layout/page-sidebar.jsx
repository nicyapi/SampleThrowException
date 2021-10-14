/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {h} from 'preact';
<<<<<<< Updated upstream
import Router, {Link} from 'preact-router';
=======
import {Link} from 'preact-router';
>>>>>>> Stashed changes
import './page-sidebar.css';
import {AsyncLoader} from '../components/async-loader';
import {useProjectList} from '../hooks/use-api-data';
import clsx from 'clsx';
<<<<<<< Updated upstream

/** @param {{isOpen: boolean, setIsOpen: (value: boolean) => void, matches: {projectId?: string}}} props */
const PageSidebar_ = props => {
=======
import {useRouteParams} from '../hooks/use-route-params';

/** @param {{isOpen: boolean, setIsOpen: (value: boolean) => void}} props */
export const PageSidebar = props => {
  const {projectSlug} = useRouteParams();
>>>>>>> Stashed changes
  const [loadingState, projects] = useProjectList();

  return (
    <div
      className={clsx('page-sidebar', {
        'page-sidebar--open': props.isOpen,
      })}
    >
      <div className="page-sidebar__header" onClick={() => props.setIsOpen(false)}>
        <div className="page-sidebar__logo" />
<<<<<<< Updated upstream
        Lighthouse CI
=======
>>>>>>> Stashed changes
      </div>
      <div className="page-sidebar__content">
        <AsyncLoader
          loadingState={loadingState}
          asyncData={projects}
          render={projects => {
            return (
              <ul role="navigation">
                {projects.map(project => (
                  <li key={project.id}>
                    <Link
                      className={clsx({
<<<<<<< Updated upstream
                        active: project.id === props.matches.projectId,
                      })}
                      href={`/app/projects/${project.id}`}
=======
                        active: project.slug === projectSlug,
                      })}
                      href={`/app/projects/${project.slug}`}
                      onClick={() => props.setIsOpen(false)}
>>>>>>> Stashed changes
                    >
                      {project.name}
                    </Link>
                  </li>
                ))}
              </ul>
            );
          }}
        />
      </div>
    </div>
  );
};
<<<<<<< Updated upstream

/** @type {any} Router types do not work properly, so fallback to any. */
const PageSidebarNoTypes = PageSidebar_;

/** @param {Omit<Parameters<typeof PageSidebar_>[0], 'matches'>} props */
export const PageSidebar = props => {
  return (
    <Router>
      <PageSidebarNoTypes
        path="/app/:slug?/:projectId?/:slugLevel2?/:idLevel2?"
        isOpen={props.isOpen}
        setIsOpen={props.setIsOpen}
      />
    </Router>
  );
};
=======
>>>>>>> Stashed changes
