// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { CONFIG } from './url-config';
import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { join } from 'path';
let cors = require('cors');
const helmet = require('helmet');

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 3451;
const DIST_FOLDER = join(process.cwd());

app.use(cors());
app.options('*', cors()); // include before other routes

// helmetjs configuration
app.use(helmet());
// Referrer policy configuration
app.use(helmet.referrerPolicy({
    policy: 'origin'
}));
// CSP settings
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ['\'self\'', '*.hmcts.net'],
        fontSrc: ['\'self\' data:', '*.hmcts.net'],
        scriptSrc: ['\'self\'', '*.hmcts.net', 'www.google-analytics.com'],
        connectSrc: ['\'self\'', '*.hmcts.net'],
        mediaSrc: ['\'self\'', '*.hmcts.net'],
        frameSrc: ['\'none\'', '*.hmcts.net'],
        imgSrc: ['\'self\'', 'www.google-analytics.com', '*.hmcts.net'],
        frameAncestors: ['\'self\'', '*.hmcts.net']
    },
    browserSniff: true,
    setAllHeaders: true,
}));
app.use(helmet.hidePoweredBy({ setTo: 'shhh..Its a secret' }));
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.noCache());
app.use(helmet.ieNoOpen());

app.all('/*', function(req, res, next) {
    let allowedOrigins = [CONFIG.apiUrl, CONFIG.notesUrl];
    let origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization, Origin');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.end();
    } else {
        next();
    }
});

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
  res.sendFile(join(DIST_FOLDER, 'browser', 'index.html'), { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});
