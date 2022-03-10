'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_story extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_story.belongsTo(models.tb_user, {
        as: "user",
        foreignKey: {
          name: "userId"
        }
      });

      tb_story.hasOne(models.tb_bookmark, {
        as: "bookmark",
        foreignKey: {
          name: "storyId"
        }
      });


    }
  }
  tb_story.init({
    title: DataTypes.STRING,
    desc: DataTypes.STRING,
    image: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tb_story',
  });
  return tb_story;
};