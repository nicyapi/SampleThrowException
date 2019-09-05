/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

declare global {
  namespace LHCI {
    export type AuditDiffType =
      | 'error'
      | 'score'
      | 'numericValue'
      | 'itemCount'
      | 'itemAddition'
      | 'itemRemoval'
      | 'itemDelta';

    interface BaseAuditDiff {
      auditId: string;
    }

    interface BaseNumericAuditDiff {
      baseValue: number;
      compareValue: number;
    }

    export interface NumericAuditDiff extends BaseAuditDiff, BaseNumericAuditDiff {
      type: 'score' | 'numericValue' | 'itemCount';
    }

    export interface ItemAdditionAuditDiff extends BaseAuditDiff {
      type: 'itemAddition';
      compareItemIndex: number;
    }

    export interface ItemRemovalAuditDiff extends BaseAuditDiff {
      type: 'itemRemoval';
      baseItemIndex: number;
    }

    export interface NumericItemAuditDiff extends BaseAuditDiff, BaseNumericAuditDiff {
      type: 'itemDelta';
      baseItemIndex: number;
      compareItemIndex: number;
      itemKey: string;
    }

    export interface ErrorAuditDiff extends BaseAuditDiff {
      type: 'error';
      baseValue?: number;
      compareValue?: number;
    }

    export type AuditDiff =
      | NumericAuditDiff
      | ItemAdditionAuditDiff
      | ItemRemovalAuditDiff
      | NumericItemAuditDiff
      | ErrorAuditDiff;
  }
}

// empty export to keep file a module
export {};
