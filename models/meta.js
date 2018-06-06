'use strict';
module.exports = (sequelize, DataTypes) => {
  var Meta = sequelize.define('Meta', {
    key: DataTypes.STRING,
    value: DataTypes.TEXT
  }, {});
  Meta.associate = function(models) {
    // associations can be defined here
  };
  return Meta;
};