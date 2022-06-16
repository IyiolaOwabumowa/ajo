const morgan = require('morgan');
const chalk = require('chalk');

const morganChalk = morgan(function (tokens: any, req: any, res: any) {
  return [
    chalk.green.bold(tokens.method(req, res)),
    chalk.red.bold(tokens.status(req, res)),
    chalk.white(tokens.url(req, res)),
    chalk.yellow(tokens['response-time'](req, res) + ' ms'),
  ].join(' ');
});


module.exports = {
  morganChalk,
};
