// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { join } from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 3451;
const DIST_FOLDER = join(process.cwd(), 'dist');
const CONFIG = {
  'api_url': process.env['SNL_API_URL'] || 'http://localhost:3451/api',
};

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main.bundle');

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { AppConfig } from './src/app/app.config';
import { AppServerConfig } from './src/app/app.server.config';

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP),
    { provide: AppConfig, useValue: new AppServerConfig(CONFIG) },
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

app.get('/health', (req, res) => {
  res.status(200).json({
    'status': 'UP',
    'buildInfo': {
      'environment': 'development',
      'project': 'snl',
      'name': 'snl-frontend',
      'version': '0.1.0'
    }
  });
});

app.get('/cfg', (req, res) => {
    res.status(200).json(CONFIG);
});

// TODO: implement data requests securely
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render(join(DIST_FOLDER, 'browser', 'index.html'), { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});
