const db = require('../models/index');
const { Op } = require('sequelize');
const moment = require('moment');

const createDetail = async (data) => {
  return await db.OrderDetail.create({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};
const updateDetail = async (data, where) => {
  return await db.OrderDetail.update(
    {
      ...data,
      updatedAt: new Date(),
    },
    { where }
  );
};
const getProduct = async (id) => {
  return await db.Product.findOne({ attributes: ['totalSold'], where: { id } });
};
const getProductDetail = async (where) => {
  return await db.ProductDetail.findOne({ attributes: ['sold', 'quantity'], where: where });
};
const updateProduct = async (data, id) => {
  return await db.Product.update(
    {
      ...data,
      updatedAt: new Date(),
    },
    {
      where: {
        id,
      },
    }
  );
};
const updateProductDetail = async (data, where) => {
  return await db.ProductDetail.update(
    {
      ...data,
      updatedAt: new Date(),
    },
    {
      where: where,
    }
  );
};
const deleteDetail = async (where) => {
  return await db.OrderDetail.destroy({
    where,
  });
};
const getCountOrder = async (req, res) => {
  try {
    const date = req.query.date || '';
    const month = req.query.month || '';
    let filter = {};
    if (month) {
      filter = {
        ...filter,
        filterDate: {
          [Op.like]: '%' + '-' + month + '-' + '%',
        },
      };
    }
    if (date) {
      filter = {
        ...filter,
        filterDate: {
          [Op.like]: '%' + date + '%',
        },
      };
    }
    const { count, rows } = await db.Order.findAndCountAll({
      where: filter,
      attributes: ['id'],
    });
    return res.status(200).send({
      total: count,
    });
  } catch (error) {
    console.log(error);
  }
};
const getRevenue = async (req, res) => {
  try {
    const date = req.query.date || '';
    const month = req.query.month || '';
    let filter = {};
    if (month && month.length < 3) {
      filter = {
        ...filter,
        filterDate: {
          [Op.like]: '%' + '-' + month + '-' + '%',
        },
      };
    }
    if (month && month.length > 2) {
      const monthFilter = month.split(',').map((item) => {
        return {
          filterDate: {
            [Op.like]: '%' + '-' + item + '-' + '%',
          },
        };
      });
      // console.log('monthFilter', monthFilter);
      filter = {
        ...filter,
        [Op.or]: monthFilter,
      };
    }
    if (date) {
      filter = {
        ...filter,
        filterDate: {
          [Op.like]: '%' + date + '%',
        },
      };
    }
    const data = await db.Order.findAll({
      where: filter,
      attributes: ['totalMoney', 'filterDate'],
    });
    if (month) {
      let total = month.split(',').map((item) => {
        return data.filter((item2) => item2.filterDate.includes(`-${item}-`));
      });
      total = total.map((item) => {
        return item.reduce((itemm1, itemm2) => itemm1 + itemm2.totalMoney, 0);
      });
      return res.status(200).send({
        total,
      });
    } else {
      const total = data.reduce((item1, item2) => item1 + item2.totalMoney, 0);
      return res.status(200).send({
        total,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const getOrders = async (req, res) => {
  const searchKeyword = req.query.searchKeyword || '';
  const date = req.query.date || '';
  const page = Number(req.query.page) || 0;
  const rowsPerPage = Number(req.query.rowsPerPage) || 10000;
  const sortBy = req.query.sortBy || 'createdAt';
  const sorted = req.query.sorted || 'desc';
  const userId = req.query.userId || '';
  let filter = {
    [Op.or]: [
      {
        fullName: {
          [Op.like]: '%' + searchKeyword + '%',
        },
      },
      {
        address: {
          [Op.like]: '%' + searchKeyword + '%',
        },
      },
    ],
  };
  if (date) {
    filter = {
      ...filter,
      filterDate: {
        [Op.like]: '%' + date + '%',
      },
    };
  }
  if (userId) {
    filter = {
      ...filter,
      userId,
    };
  }
  try {
    let { count, rows } = await db.Order.findAndCountAll({
      where: filter,
      offset: page * rowsPerPage,
      limit: rowsPerPage,
      order: [[sortBy, sorted]],
    });
    const orderDetail = await db.OrderDetail.findAll();
    rows.map((item) => {
      const detail = orderDetail.filter((item2) => item2.orderId === item.id);
      item.dataValues.detail = detail;
    });
    return res.status(200).send({
      data: rows,
      total: count,
    });
  } catch (error) {}
};
const getOrder = () => {};
const createOrder = async (req, res) => {
  try {
    console.log(req.body);
    console.log(JSON.parse(req.body.infoProduct));
    const data = await db.Order.create({
      userId: req.body.userId,
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      note: req.body.note,
      coupon: req.body.coupon,
      totalMoney: Number(req.body.totalMonney),
      filterDate: moment(new Date()).format('DD-MM-YYYY'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const products = JSON.parse(req.body.infoProduct);
    products.map(async (item) => {
      createDetail({
        orderId: data.id,
        productId: item.product.id,
        nameProduct: item.product.nameProduct,
        sizeId: item.size.sizeId,
        colorId: item.color.colorId,
        quantity: item.quantity,
        totalMoney: item.product.saleProduct
          ? item.quantity * item.product.salePrice
          : item.quantity * item.product.regularPrice,
        userId: req.body.userId,
        rating: 0,
        thumbnail: item.product?.gallery[item.color.indexColor].listLink.split(',')[0],
      });
      const product = await getProduct(item.product.id);
      updateProduct(
        { totalSold: Number(product.totalSold) + Number(item.quantity) },
        item.product.id
      );
      const productDetail = await getProductDetail({
        productId: item.product.id,
        colorId: item.color.colorId,
        sizeId: item.size.sizeId,
      });
      updateProductDetail(
        {
          sold: Number(productDetail.sold) + Number(item.quantity),
          quantity: Number(productDetail.quantity) - Number(item.quantity),
        },
        {
          productId: item.product.id,
          colorId: item.color.colorId,
          sizeId: item.size.sizeId,
        }
      );
      return res.status(200).send({ success: true, message: 'Đặt hàng thành công' });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Đặt hàng thất bại' });
  }
};
const deleteOrder = () => {};

module.exports = {
  getOrders,
  getCountOrder,
  getOrder,
  createOrder,
  deleteOrder,
  getRevenue,
};
