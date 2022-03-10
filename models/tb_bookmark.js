'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_bookmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_bookmark.belongsTo(models.tb_user, {
        as: "user",
        foreignKey: {
          name: "userId"
        }
      });

      tb_bookmark.belongsTo(models.tb_story, {
        as: "story",
        foreignKey: {
          name: "storyId"
        }
      });

    }
  }
  tb_bookmark.init({
    userId: DataTypes.INTEGER,
    storyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tb_bookmark',
  });
  return tb_bookmark;
};