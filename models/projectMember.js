'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProjectMember extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ProjectMember.belongsTo(models.Project, {
                foreignKey: 'projectId', as: 'Project'
            });
            ProjectMember.belongsTo(models.User, {
                foreignKey: 'userId', as: 'User'
            });
        }
    }
    ProjectMember.init({
        projectMemberId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Project',
                key: 'projectId'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'userId'
            }
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'ProjectMember',
        tableName: 'ProjectMember',
        timestamps: false
    });
    return ProjectMember;
};