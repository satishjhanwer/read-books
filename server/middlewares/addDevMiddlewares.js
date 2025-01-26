const path = require('path');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

module.exports = function addDevMiddlewares(app, webpackConfig) {
  const compiler = webpack(webpackConfig);
  const middleware = webpackDevMiddleware(compiler, { publicPath: webpackConfig.output.publicPath, stats: true });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  const {
    context: { outputFileSystem },
  } = middleware;

  app.get('*', (req, res) => {
    outputFileSystem.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
      if (err) {
        res.sendStatus(404);
      } else {
        res.send(file.toString());
      }
    });
  });
};
