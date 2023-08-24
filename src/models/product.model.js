'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init(
    {
      nameProduct: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      regularPrice: DataTypes.INTEGER,
      salePrice: DataTypes.INTEGER,
      weight: DataTypes.STRING,
      dimensions: DataTypes.STRING,
      materials: DataTypes.STRING,
      other: DataTypes.STRING,
      subDesc: DataTypes.STRING,
      desc: DataTypes.STRING,
      totalSold: DataTypes.INTEGER,
      newProduct: DataTypes.BOOLEAN,
      saleProduct: DataTypes.BOOLEAN,
      listSize: DataTypes.STRING,
      listColor: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Product',
    }
  );
  return Product;
};
