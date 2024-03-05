'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class taskDetails extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

        models.taskDetails.hasOne(models.changeDetails,{foreignKey:'taskRunId'})
        }
    }
    taskDetails.init({
        directory:DataTypes.STRING,
        startTime:DataTypes.DATE,
        endTime:DataTypes.DATE,
        totalRunTime:DataTypes.STRING,
        occurences:DataTypes.ARRAY(DataTypes.STRING),
        Status:DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'taskDetails',
    });
    return taskDetails;
};