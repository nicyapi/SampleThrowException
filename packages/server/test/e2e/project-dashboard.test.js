/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* eslint-env jest, browser */

<<<<<<< Updated upstream
<<<<<<< Updated upstream
describe('Project dashboard', () => {
=======
=======
>>>>>>> Stashed changes
const {shouldRunE2E, emptyTest} = require('./steps/environment-test');

describe('Project dashboard', () => {
  if (!shouldRunE2E()) return emptyTest();

<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  const state = {};

  require('./steps/setup')(state);

  require('./steps/navigate-to-project')(state, 'Lighthouse Viewer');

  describe('render the dashboard', () => {
    it('should show the commits', async () => {
      const commits = await state.page.evaluate(() => {
        return [...document.querySelectorAll('.dashboard__build-list tr')].map(
          row => row.textContent
        );
      });

      expect(commits).toMatchInlineSnapshot(`
        Array [
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          "test: empty basecall_splitmaster824cbea4Oct 09 8:15 PM",
          "test(unmatched-ancestor): a really really really really long messagecall_splitmissing_ancestorba5b0ad9Aug 09 8:13 PM",
          "test(matched-ancestor): a really really really really really long messagecall_splitmaster5b0ad9f6Aug 09 6:55 PM",
          "feat: improves TTIcall_splittest_1c1ea447bAug 09 6:15 PM",
          "feat: regresses TTIcall_splittest_0aaa5b0a3Aug 09 3:15 PM",
=======
=======
>>>>>>> Stashed changes
          "824cbea4test: empty basecall_splitmasterOct 09 8:15 PM",
          "ba5b0ad9test(unmatched-ancestor): a really really really really long messagecall_splitmissing_ancestorAug 09 8:13 PM",
          "5b0ad9f6test(matched-ancestor): a really really really really really long messagecall_splitmasterAug 09 6:55 PM",
          "c1ea447bfeat: improves TTIcall_splittest_1Aug 09 6:15 PM",
          "aaa5b0a3feat: regresses TTIcall_splittest_0Aug 09 3:15 PM",
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
        ]
      `);
    });

    it('should look correct', async () => {
      expect(await state.page.screenshot()).toMatchImageSnapshot();
    });
  });

  require('./steps/teardown')(state);
});
