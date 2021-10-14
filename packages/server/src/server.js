/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const path = require('path');
const createHttpServer = require('http').createServer;
const express = require('express');
const morgan = require('morgan');
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
const compression = require('compression');
>>>>>>> Stashed changes
=======
const compression = require('compression');
>>>>>>> Stashed changes
const bodyParser = require('body-parser');
const ApiClient = require('@lhci/utils/src/api-client.js');
const createProjectsRouter = require('./api/routes/projects.js');
const StorageMethod = require('./api/storage/storage-method.js');
const {errorMiddleware} = require('./api/express-utils.js');
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
const version = require('../package.json').version;
>>>>>>> Stashed changes
=======
const version = require('../package.json').version;
>>>>>>> Stashed changes

const DIST_FOLDER = path.join(__dirname, '../dist');

/**
 * @param {LHCI.ServerCommand.Options} options
 * @return {Promise<{app: Parameters<typeof createHttpServer>[1], storageMethod: StorageMethod}>}
 */
async function createApp(options) {
  const {storage} = options;

  const storageMethod = StorageMethod.from(storage);
  await storageMethod.initialize(storage);

  const app = express();
  if (options.logLevel !== 'silent') app.use(morgan('short'));

<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
  // While LHCI should be served behind nginx/apache that handles compression, it won't always be.
  app.use(compression());

>>>>>>> Stashed changes
=======
  // While LHCI should be served behind nginx/apache that handles compression, it won't always be.
  app.use(compression());

>>>>>>> Stashed changes
  // 1. Support large payloads because LHRs are big.
  // 2. Support JSON primitives because `PUT /builds/<id>/lifecycle "sealed"`
  app.use(bodyParser.json({limit: '10mb', strict: false}));

<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
  app.get('/', (_, res) => res.redirect('/app'));
  app.use('/version', (_, res) => res.send(version));
>>>>>>> Stashed changes
=======
  app.get('/', (_, res) => res.redirect('/app'));
  app.use('/version', (_, res) => res.send(version));
>>>>>>> Stashed changes
  app.use('/v1/projects', createProjectsRouter({storageMethod}));
  app.use('/app', express.static(DIST_FOLDER));
  app.get('/app/*', (_, res) => res.sendFile(path.join(DIST_FOLDER, 'index.html')));
  app.use(errorMiddleware);

  return {app, storageMethod};
}

/**
 * @param {LHCI.ServerCommand.Options} options
<<<<<<< Updated upstream
<<<<<<< Updated upstream
 * @return {Promise<{port: number, close: () => void}>}
=======
 * @return {Promise<{port: number, close: () => Promise<void>, storageMethod: StorageMethod}>}
>>>>>>> Stashed changes
=======
 * @return {Promise<{port: number, close: () => Promise<void>, storageMethod: StorageMethod}>}
>>>>>>> Stashed changes
 */
async function createServer(options) {
  const {app, storageMethod} = await createApp(options);

  return new Promise(resolve => {
    const server = createHttpServer(app);
    server.listen(options.port, () => {
      const serverAddress = server.address();
      const listenPort =
        typeof serverAddress === 'string' || !serverAddress ? options.port : serverAddress.port;

      resolve({
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        port: listenPort,
        close: () => {
          server.close();
          storageMethod.close();
=======
=======
>>>>>>> Stashed changes
        storageMethod,
        port: listenPort,
        close: async () => {
          await Promise.all([new Promise(r => server.close(r)), storageMethod.close()]);
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
        },
      });
    });
  });
}

module.exports = {createApp, createServer, ApiClient};
