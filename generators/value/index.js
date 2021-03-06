'use strict';

var yeoman = require('yeoman-generator');
var _ = require('lodash');
var path = require('path');

var format = require('util').format;

var utils = require('../_utils');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.props = {};

    this.throwError = function (message) {
      this.log.error(message);
      process.exit(1);
    };

    this.props.root = path.join(this.destinationRoot(), './app/src');

    var raw = this.args[0];

    if (raw.indexOf('.') === -1)
      this.throwError('First argument should be module name and value name separated by a dot.');

    this.props.feature = raw.split('.')[0];
    this.props.name = _.camelCase(_.deburr(raw.split('.')[1]));

    if (_.isEmpty(this.props.feature) || _.isEmpty(this.props.name))
      this.throwError('Feature and/or value name can\'t be empty.');

    this.props.value = _.capitalize(this.props.name);

  },
  writing: function () {

    this.fs.copy(
      this.templatePath('value.js'),
      this.destinationPath(format('%s/%s/%s.value.js', this.props.root, this.props.feature, this.props.name))
    );

    utils.injectComponent.call(this,
      format(
        '  .value(\'%s\', require(\'./%s.value.js\'))',
        this.props.value,
        this.props.name
      )
    );
  }
});
