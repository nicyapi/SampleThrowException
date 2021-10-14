/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* eslint-env jest */

<<<<<<< Updated upstream
<<<<<<< Updated upstream
const fs = require('fs');
const path = require('path');
const runTests = require('./server-test-suite.js').runTests;
const runServer = require('../src/server.js').createServer;
=======
=======
>>>>>>> Stashed changes
const path = require('path');
const runTests = require('./server-test-suite.js').runTests;
const runServer = require('../src/server.js').createServer;
const {safeDeleteFile} = require('../../cli/test/test-utils.js');
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

describe('sqlite server', () => {
  const state = {
    port: undefined,
    closeServer: undefined,
  };

  const dbPath = path.join(__dirname, 'server-test.tmp.sql');

  beforeAll(async () => {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

    const {port, close} = await runServer({
=======
    await safeDeleteFile(dbPath);

    const {port, close, storageMethod} = await runServer({
>>>>>>> Stashed changes
=======
    await safeDeleteFile(dbPath);

    const {port, close, storageMethod} = await runServer({
>>>>>>> Stashed changes
      logLevel: 'silent',
      port: 0,
      storage: {
        storageMethod: 'sql',
        sqlDialect: 'sqlite',
        sqlDatabasePath: dbPath,
      },
    });

    state.port = port;
    state.closeServer = close;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  });

  afterAll(() => {
    fs.unlinkSync(dbPath);
    state.closeServer();
=======
=======
>>>>>>> Stashed changes
    state.storageMethod = storageMethod;
  });

  afterAll(async () => {
    await state.closeServer();
    await safeDeleteFile(dbPath);
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  });

  runTests(state);
});
