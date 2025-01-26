const { resolve } = require('path');

const colors = require('colors');
const express = require('express');
const ip = require('ip');

const argv = require('./argv');
const port = require('./port');

const goodReadAPI = require('./api/good-read-api');
const setup = require('./middlewares/frontendMiddleware');

const app = express();

app.use('/api', goodReadAPI);

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// use the gzipped bundle
app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});

// Start your app.
app.listen(port, host, async (err) => {
  if (err) {
    console.error(colors.red(err.message));
    return;
  }

  console.log(`
    ${colors.green('Access URLs:')}
    ${colors.white('-----------------------------------')}
    Localhost: ${colors.magenta(`http://${prettyHost}:${port}`)}
    LAN: ${colors.magenta(`http://${ip.address()}:${port}`)}
    ${colors.white('-----------------------------------')}
    ${colors.blue('Press CTRL-C to stop')}
  `);
});
