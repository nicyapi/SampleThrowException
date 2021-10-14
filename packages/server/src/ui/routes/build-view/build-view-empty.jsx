/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {h} from 'preact';
import './build-view-empty.css';
import {LhrViewerLink} from '../../components/lhr-viewer-link';
<<<<<<< Updated upstream

// @ts-ignore - tsc doesn't know how to handle static assets
const logoSvgPath = require('../../logo.svg');
=======
import {Paper} from '../../components/paper';
>>>>>>> Stashed changes

/** @param {{lhr: LH.Result, baseLhr?: LH.Result}} props */
export const BuildViewEmpty = props => {
  return (
<<<<<<< Updated upstream
    <div className="build-view__empty">
      <p>No differences found!</p>
      <LhrViewerLink lhr={props.lhr}>
        <div className="build-view-empty__lhr-link">
          <img src={logoSvgPath} />
          <div>Open Report</div>
        </div>
      </LhrViewerLink>
    </div>
=======
    <Paper className="build-view__empty">
      <i className="material-icons">insert_emoticon</i>
      <div>
        Woah, no differences found! Switch base builds to explore other differences, or{' '}
        <LhrViewerLink className="build-view-empty__lhr-link" lhr={props.lhr}>
          open the Lighthouse report
        </LhrViewerLink>
        .
      </div>
    </Paper>
>>>>>>> Stashed changes
  );
};
