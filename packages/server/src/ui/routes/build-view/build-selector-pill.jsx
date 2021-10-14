/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {h, Fragment} from 'preact';
import './build-selector-pill.css';
import clsx from 'clsx';
<<<<<<< Updated upstream
<<<<<<< Updated upstream

/**
 *
 * @param {{build: LHCI.ServerCommand.Build}} props
=======
=======
>>>>>>> Stashed changes
import {Pill} from '../../components/pill';

/**
 *
 * @param {{build: LHCI.ServerCommand.Build, variant: 'base'|'compare'}} props
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
 */
const Selection = props => {
  const {hash, commitMessage = 'unknown commit'} = props.build;
  return (
    <Fragment>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      <span className="build-selector-pill__hash">{hash.slice(0, 8)}</span>
=======
      <Pill className="build-selector-pill__hash" variant={props.variant} solid>
        {hash.slice(0, 8)}
      </Pill>
>>>>>>> Stashed changes
=======
      <Pill className="build-selector-pill__hash" variant={props.variant} solid>
        {hash.slice(0, 8)}
      </Pill>
>>>>>>> Stashed changes
      <span className="build-selector-pill__message">{commitMessage}</span>
    </Fragment>
  );
};

/**
<<<<<<< Updated upstream
<<<<<<< Updated upstream
 * @param {{build: LHCI.ServerCommand.Build | null, variant: 'base'|'compare', isOpen?: boolean, onClick?: () => void}} props
=======
 * @param {{build: LHCI.ServerCommand.Build | null, variant: 'base'|'compare', isOpen?: boolean, isDimmed?: boolean, onClick?: () => void}} props
>>>>>>> Stashed changes
=======
 * @param {{build: LHCI.ServerCommand.Build | null, variant: 'base'|'compare', isOpen?: boolean, isDimmed?: boolean, onClick?: () => void}} props
>>>>>>> Stashed changes
 */
export const BuildSelectorPill = props => {
  return (
    <div
      className={clsx(`build-selector-pill build-selector-pill--${props.variant}`, {
        'build-selector-pill--open': props.isOpen,
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      })}
      onClick={props.onClick}
    >
      <div className="build-selector-pill__variant-label">{props.variant}</div>
      {props.build ? (
        <Selection build={props.build} />
      ) : (
        <span className="build-selector-pill__message">None</span>
      )}
=======
=======
>>>>>>> Stashed changes
        'build-selector-pill--dim': props.isDimmed,
      })}
      onClick={props.onClick}
    >
      {props.build ? (
        <Selection build={props.build} variant={props.variant} />
      ) : (
        <span className="build-selector-pill__message">None</span>
      )}
      <div className="build-selector-pill__variant-label">{props.variant}</div>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    </div>
  );
};
