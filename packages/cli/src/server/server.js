/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @param {import('yargs').Argv} yargs
 */
function buildCommand(yargs) {
  return yargs.options({
    logLevel: {
      type: 'string',
      choices: ['silent', 'verbose'],
      default: 'verbose',
    },
    port: {
      alias: 'p',
      type: 'number',
      default: 9001,
    },
    'storage.storageMethod': {
      type: 'string',
      choices: ['sql', 'spanner'],
      default: 'sql',
    },
    'storage.sqlDialect': {
      type: 'string',
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      choices: ['sqlite', 'mysql', 'postgres'],
=======
      choices: ['sqlite', 'postgres'],
>>>>>>> Stashed changes
=======
      choices: ['sqlite', 'postgres'],
>>>>>>> Stashed changes
      default: 'sqlite',
    },
    'storage.sqlDatabasePath': {
      description: 'The path to a SQLite database on disk.',
    },
    'storage.sqlConnectionUrl': {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      description: 'The connection url to a postgres or mysql database.',
=======
      description: 'The connection url to a postgres database.',
>>>>>>> Stashed changes
=======
      description: 'The connection url to a postgres database.',
>>>>>>> Stashed changes
    },
    'storage.sqlConnectionSsl': {
      type: 'boolean',
      default: false,
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      description: 'The path to a SQLite database on disk.',
=======
      description: 'Whether the SQL connection should force use of SSL',
>>>>>>> Stashed changes
=======
      description: 'Whether the SQL connection should force use of SSL',
>>>>>>> Stashed changes
    },
    'storage.sqlDangerouslyResetDatabase': {
      description:
        'Whether to force the database to the required schema. WARNING: THIS WILL DELETE ALL DATA',
      type: 'boolean',
      default: false,
    },
  });
}

/**
 * @param {LHCI.ServerCommand.Options} options
 * @return {Promise<{port: number, close: () => void}>}
 */
async function runCommand(options) {
  const {createServer} = require('@lhci/server');
  return createServer(options);
}

module.exports = {buildCommand, runCommand};
