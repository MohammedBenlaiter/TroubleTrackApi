'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Project.belongsTo(models.User, { foreignKey: 'ownerId' });
      Project.hasMany(models.Error, { foreignKey: 'projectId' });
      Project.belongsToMany(models.User, { through: 'ProjectMembers', foreignKey: 'projectId' });
    }
  }
  Project.init({
    projectId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'userId'
      }
    },
  }, {
    sequelize,
    modelName: 'Project',
    tableName: 'Project',
    timestamps: false
  });
  return Project;
};