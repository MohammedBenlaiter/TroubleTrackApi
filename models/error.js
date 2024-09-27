'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Error extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Error.belongsTo(models.Project, { foreignKey: 'projectId' });
        }
    }
    Error.init({
        errorId: {
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
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }, message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        stack_trace: {
            type: DataTypes.TEXT
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'open'
        },
    }, {
        sequelize,
        modelName: 'Error',
        tableName: 'Error',
        timestamps: false
    });
    return Error;
};