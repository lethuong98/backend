const db = require('../models/index');
const fs = require('fs');
const { Op } = require('sequelize');
const path = require('path');
const _ = require('lodash');
var unorm = require('unorm');
const cloudinary = require('cloudinary').v2;

const filterColorAndSize = (filter, list) => {
  for (let i = 0; i < filter.length; i++) {
    if (list.indexOf(filter[i]) >= 0) {
      return true;
    }
  }
  return false;
};

const checkActionColor = (oldColor, newColor) => {
  const total = _.concat(oldColor, newColor);
  const countObj = {};

  for (let i = 0; i < total.length; i++) {
    const element = total[i];
    countObj[element] = (countObj[element] || 0) + 1;
  }

  const result = [];
  for (const element in countObj) {
    if (countObj.hasOwnProperty(element) && countObj[element] === 1) {
      result.push(element); // Convert back to number if needed
    }
  }
  const deleteArray = result.filter((item) => {
    return oldColor.find((item2) => item2 === item);
  });
  const addArray = result.filter((item) => {
    return newColor.find((item2) => item2 === item);
  });
  return { deleteArray, addArray };
};

const checkActionSize = (oldSize, newSize) => {
  const total = _.concat(oldSize, newSize);
  const countObj = {};

  for (let i = 0; i < total.length; i++) {
    const element = total[i];
    countObj[element] = (countObj[element] || 0) + 1;
  }

  const result = [];
  for (const element in countObj) {
    if (countObj.hasOwnProperty(element) && countObj[element] === 1) {
      result.push(element); // Convert back to number if needed
    }
  }
  const deleteArray = result.filter((item) => {
    return oldSize.find((item2) => item2 === item);
  });
  const addArray = result.filter((item) => {
    return newSize.find((item2) => item2 === item);
  });
  return { deleteArray, addArray };
};

const convertToLatin = (text) => {
  text = text.replace(/\s+/g, '-');
  return unorm
    .nfkd(text)
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/đ/g, 'd') // Replace đ character
    .replace(/Đ/g, 'D') // Replace Đ character
    .replace(/[áàảãạâấầẩẫậăắằẳẵặ]/g, 'a')
    .replace(/[ÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶ]/g, 'A')
    .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
    .replace(/[ÉÈẺẼẸÊẾỀỂỄỆ]/g, 'E')
    .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
    .replace(/[ÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢ]/g, 'O')
    .replace(/[íìỉĩị]/g, 'i')
    .replace(/[ÍÌỈĨỊ]/g, 'I')
    .replace(/[úùủũụưứừửữự]/g, 'u')
    .replace(/[ÚÙỦŨỤƯỨỪỬỮỰ]/g, 'U')
    .replace(/[ýỳỷỹỵ]/g, 'y')
    .replace(/[ÝỲỶỸỴ]/g, 'Y')
    .toLowerCase();
};
const createDetail = async (data) => {
  return await db.ProductDetail.create({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};
const updateDetail = async (data, where) => {
  return await db.ProductDetail.update(
    {
      ...data,
      updatedAt: new Date(),
    },
    { where }
  );
};
const deleteDetail = async (where) => {
  return await db.ProductDetail.destroy({
    where,
  });
};
const createGallery = async (data) => {
  return await db.Gallery.create({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};
const updateGallery = async (data, where) => {
  return await db.Gallery.update(
    {
      ...data,
      updatedAt: new Date(),
    },
    { where }
  );
};
const deleteGallery = async (where) => {
  return await db.Gallery.destroy({ where });
};
const getTopFiveBestSeller = async (req, res) => {
  const data = await db.Product.findAll({
    order: [['totalSold', 'desc']],
    attributes: ['nameProduct', 'totalSold'],
    limit: 5,
  });
  return res.status(200).send({
    data,
  });
};
const getProducts = async (req, res) => {
  const searchKeyword = req.query.searchKeyword || '';
  const category = req.query.category || '';
  const size = req.query.size || '';
  const color = req.query.color || '';
  const rowsPerPage = Number(req.query.rowsPerPage) || 100;
  const page = Number(req.query.page) || 0;
  const newProduct = req.query.newProduct ? 1 : [0, 1];
  const saleProduct = req.query.saleProduct ? 1 : [0, 1];
  const sortBy = req.query.sortBy || 'createdAt';
  const sorted = req.query.sorted || 'desc';

  let filter = {
    nameProduct: {
      [Op.like]: '%' + searchKeyword + '%',
    },
  };
  if (category) {
    filter = {
      newProduct,
      saleProduct,
      categoryId: category.split(','),
      nameProduct: {
        [Op.like]: '%' + searchKeyword + '%',
      },
    };
  } else {
    filter = {
      newProduct,
      saleProduct,
      nameProduct: {
        [Op.like]: '%' + searchKeyword + '%',
      },
    };
  }
  try {
    const dataProductDetail = await db.ProductDetail.findAll();
    const dataGallery = await db.Gallery.findAll();
    let dataProducts = await db.Product.findAll({
      where: filter,
      order: [[sortBy, sorted]],
    });
    if (size) {
      dataProducts = dataProducts.filter((item) => {
        return filterColorAndSize(item.listSize.split(','), size.split(','));
      });
    }
    if (color) {
      dataProducts = dataProducts.filter((item) => {
        return filterColorAndSize(item.listColor.split(','), color.split(','));
      });
    }

    dataProducts.map((item1) => {
      const detail = dataProductDetail.filter((item2) => item2.productId === item1.id);
      const gallery = dataGallery.filter((item3) => item3.productId === item1.id);
      item1.dataValues.detail = detail;
      item1.dataValues.gallery = gallery;
    });
    const dataReturn = _.chunk(dataProducts, rowsPerPage);
    return res.status(200).send({
      data: dataReturn[page] || [],
      total: dataProducts.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Lỗi server');
  }
};

const getProduct = async (req, res) => {
  try {
    const data = await db.Product.findByPk(req.params.id);
    const detail = await db.ProductDetail.findAll({
      where: { productId: req.params.id },
    });
    const gallery = await db.Gallery.findAll({
      where: { productId: req.params.id },
    });
    if (data) {
      data.dataValues.detail = detail;
      data.dataValues.gallery = gallery;
      return res.status(200).send({
        data,
      });
    } else {
      return res.status(204).send({
        data,
      });
    }
  } catch (error) {
    return res.status(500).send({ success: false, message: 'Lỗi server' });
  }
};

const createProduct = async (req, res) => {
  try {
    const filterGallery = req.body.filterGallery.split(',');
    let gallery = filterGallery.map((item) => {
      return req.files.filter((item2) => item2.filename.indexOf(convertToLatin(item)) === 9);
    });

    gallery = gallery.map((item) => {
      return item.map((item2) => item2.path).toString();
    });

    const dataCreate = {
      nameProduct: req.body.nameProduct,
      categoryId: Number(req.body.categoryId),
      regularPrice: Number(req.body.regularPrice),
      salePrice: Number(req.body.salePrice),
      weight: req.body.weight,
      dimensions: req.body.dimensions,
      materials: req.body.materials,
      other: req.body.other,
      subDesc: req.body.subDesc,
      desc: req.body.desc,
      newProduct: true,
      saleProduct: false,
      listSize: req.body.size,
      listColor: req.body.color,
    };
    const color = req.body.color.split(',');
    const size = req.body.size.split(',');

    const data = await db.Product.create({
      ...dataCreate,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (data) {
      color.map((itemColor, index) => {
        createGallery({
          productId: data.id,
          colorId: itemColor,
          listLink: gallery[index],
        });
        size.map((itemSize) => {
          createDetail({
            productId: data.id,
            colorId: itemColor,
            sizeId: itemSize,
            quantity: req.body.quantity,
            sold: 0,
          });
        });
      });
    }
    return res.status(201).send({
      success: true,
      message: 'Tạo sản phẩm thành công',
    });
  } catch (error) {
    return res.status(500).send('Lỗi server');
  }
};

const updateProduct = async (req, res) => {
  try {
    const filterGallery = req.body.filterGallery.split(',').map((item) => convertToLatin(item));
    let dataRemove = req.body.dataRemove.split(',');
    const oldGallery = req.body.oldGallery.split(',');
    const oldColor = req.body.oldColor.split(',');
    const color = req.body.color.split(',');
    const oldSize = req.body.oldSize.split(',');
    const size = req.body.size.split(',');
    const editColor = checkActionColor(oldColor, color);
    const editSize = checkActionSize(oldSize, size);
    const files = req.files;
    console.log('filterGallery', filterGallery);
    let gallery = [];
    if (files.length > 0) {
      gallery = filterGallery.map((item) => {
        return files.filter((item2) => item2.filename.indexOf(item) === 9);
      });

      gallery = gallery.map((item) => {
        return item.map((item2) => item2.path).toString();
      });
    }

    if (dataRemove.length > 0) {
      cloudinary.api.delete_resources(
        dataRemove.map((item) => `products/${path.basename(item, path.extname(item))}`),
        function (error, result) {
          console.log(error);
          console.log(result);
        }
      );
      const newGallery = _.difference(oldGallery, dataRemove);
      gallery = _.compact(_.concat(gallery, newGallery));

      gallery = filterGallery.map((item) => {
        return gallery.filter((item2) => path.basename(item2).indexOf(item) === 0);
      });

      gallery = gallery.map((item) => {
        return item.toString();
      });
      color.map((item, index) => {
        updateGallery(
          {
            listLink: gallery[index],
          },
          { productId: req.params.id, colorId: item }
        );
      });
    }
    if (editSize.deleteArray.length > 0) {
      editSize.deleteArray.map((item) => {
        deleteDetail({ productId: req.params.id, sizeId: item });
      });
    }
    if (editSize.addArray.length > 0) {
      oldColor.map((itemColor) => {
        editSize.addArray.map((itemSize) => {
          createDetail({
            productId: req.params.id,
            colorId: itemColor,
            sizeId: itemSize,
            quantity: req.body.quantity,
            sold: 0,
          });
        });
      });
    }

    if (editColor.deleteArray.length > 0) {
      editColor.deleteArray.map((item) => {
        deleteGallery({ productId: req.params.id, colorId: item });
        deleteDetail({ productId: req.params.id, colorId: item });
      });
    }
    if (editColor.addArray.length > 0) {
      editColor.addArray.map((itemColor) => {
        let indexGallery = color.findIndex((item2) => item2 === itemColor);
        createGallery({
          productId: req.params.id,
          colorId: itemColor,
          listLink: gallery[indexGallery],
        });
        size.map((itemSize) => {
          createDetail({
            productId: req.params.id,
            colorId: itemColor,
            sizeId: itemSize,
            quantity: req.body.quantity,
            sold: 0,
          });
        });
      });
    }
    const dataUpdate = {
      nameProduct: req.body.nameProduct,
      categoryId: Number(req.body.categoryId),
      regularPrice: Number(req.body.regularPrice),
      salePrice: Number(req.body.salePrice),
      weight: req.body.weight,
      dimensions: req.body.dimensions,
      materials: req.body.materials,
      other: req.body.other,
      subDesc: req.body.subDesc,
      desc: req.body.desc,
      listSize: size.toString(),
      listColor: color.toString(),
    };

    const data = await db.Product.update(
      {
        ...dataUpdate,
        updatedAt: new Date(),
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    await db.ProductDetail.update(
      {
        quantity: req.body.quantity,
      },
      {
        where: {
          productId: req.params.id,
        },
      }
    );
    return res.status(201).send({
      success: true,
      message: 'Sửa thông tin sản phẩm thành công',
    });
  } catch (error) {
    return res.status(500).send('Lỗi server');
  }
};
const deleteProduct = async (req, res) => {
  try {
    let galeryDelete = await db.Gallery.findAll({
      where: {
        productId: req.params.id,
      },
    });
    if (galeryDelete) {
      galeryDelete = galeryDelete.map((item) => item.listLink.split(','));
      galeryDelete.map((item) => {
        cloudinary.api.delete_resources(
          item.map((item2) => `products/${path.basename(item2, path.extname(item2))}`),
          function (error, result) {
            console.log(error);
            console.log(result);
          }
        );
      });
    }
    const gallery = await db.Gallery.destroy({
      where: {
        productId: req.params.id,
      },
    });
    const product = await db.Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    const detailProduct = await db.ProductDetail.destroy({
      where: {
        productId: req.params.id,
      },
    });
    if (gallery && product && detailProduct) {
      return res.status(201).send({
        success: true,
        message: 'Xoá sản phẩm thành công',
      });
    }
  } catch (error) {
    return error;
  }
};
const toggleNewProduct = async (req, res) => {
  const newValue = req.body.newProduct === 'true' ? 0 : 1;
  const data = await db.Product.update(
    {
      newProduct: newValue,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );
  if (data) {
    return res.status(201).send({
      success: true,
      message: 'Thay đổi new thành công',
    });
  }
};
const toggleSaleProduct = async (req, res) => {
  const newValue = req.body.saleProduct === 'true' ? 0 : 1;
  const data = await db.Product.update(
    {
      saleProduct: newValue,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );
  if (data) {
    return res.status(201).send({
      success: true,
      message: 'Thay đổi new thành công',
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  toggleNewProduct,
  toggleSaleProduct,
  getTopFiveBestSeller,
};
