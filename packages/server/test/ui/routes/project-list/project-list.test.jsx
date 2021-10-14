/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {h} from 'preact';
import {api} from '../../../../src/ui/hooks/use-api-data.jsx';
import {ProjectList} from '../../../../src/ui/routes/project-list/project-list.jsx';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import {render, cleanup, wait, snapshotDOM} from '../../../test-utils.js';
=======
import {render, cleanup, wait} from '../../../test-utils.js';
>>>>>>> Stashed changes
=======
import {render, cleanup, wait} from '../../../test-utils.js';
>>>>>>> Stashed changes

jest.mock('../../../../src/ui/layout/page');

afterEach(cleanup);

describe('ProjectList', () => {
  /** @type {import('jest-fetch-mock/types').GlobalWithFetchMock['fetch']} */
  let fetchMock;

  beforeEach(() => {
    fetchMock = global.fetch = require('jest-fetch-mock');
    api._fetch = fetchMock;
  });

  afterEach(() => {
    global.fetch.resetMocks();
  });

  it('should render a message when no projects available', async () => {
    fetchMock.mockResponse(JSON.stringify([]));

<<<<<<< Updated upstream
<<<<<<< Updated upstream
    const {container, getAllByText} = render(<ProjectList />);
    await wait(() => getAllByText(/No projects/));
    expect(snapshotDOM(container)).toMatchInlineSnapshot(`
      "<div>
        <span>
          No projects yet, create one by running \`lhci wizard\`
        </span>
      </div>"
    `);
=======
    const {getAllByText} = render(<ProjectList />);
    await wait(() => getAllByText(/Welcome to Lighthouse CI/));
>>>>>>> Stashed changes
=======
    const {getAllByText} = render(<ProjectList />);
    await wait(() => getAllByText(/Welcome to Lighthouse CI/));
>>>>>>> Stashed changes
  });

  it('should render the projects', async () => {
    fetchMock.mockResponse(
      JSON.stringify([
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        {id: '1', name: 'Project A', externalUrl: 'http://localhost:1337/builds/a/'},
        {id: '2', name: 'Project B', externalUrl: 'http://localhost:1337/builds/b/'},
      ])
    );

    const {container, getAllByText} = render(<ProjectList />);
    await wait(() => getAllByText(/Project A/));
    expect(snapshotDOM(container)).toMatchInlineSnapshot(`
      "<div>
        <ul>
          <li>
            <a
              href=\\"/app/projects/1\\"
            >
              Project A
               (
              http://localhost:1337/builds/a/
              )
            </a>
          </li>
          <li>
            <a
              href=\\"/app/projects/2\\"
            >
              Project B
               (
              http://localhost:1337/builds/b/
              )
            </a>
          </li>
        </ul>
      </div>"
    `);
=======
=======
>>>>>>> Stashed changes
        {slug: '1', name: 'Project A', externalUrl: 'http://localhost:1337/builds/a/'},
        {slug: '2', name: 'Project B', externalUrl: 'http://localhost:1337/builds/b/'},
      ])
    );

    const {getAllByText} = render(<ProjectList />);
    await wait(() => getAllByText(/Project A/));
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  });
});
