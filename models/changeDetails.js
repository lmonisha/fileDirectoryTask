'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class changeDetails extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
    
        }
    }
    changeDetails.init({
       AddedList:DataTypes.ARRAY(DataTypes.STRING),
       deletedFileList:DataTypes.ARRAY(DataTypes.STRING)
    }, {
        sequelize,
        modelName: 'changeDetails',
    });
    return changeDetails;
};