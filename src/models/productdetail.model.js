'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductDetail.init(
    {
      productId: DataTypes.INTEGER,
      colorId: DataTypes.INTEGER,
      sizeId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,    
      sold: DataTypes.INTEGER,    
    },
    {
      sequelize,
      modelName: 'ProductDetail',
    }
  );
  return ProductDetail;
};
