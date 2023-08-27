const db = require('../models/index');

const getCategorys = async (req, res) => {
  const rowsPerPage = Number(req.query.rowsPerPage) || 100;
  const page = Number(req.query.page) || 0;
  const offSet = page * rowsPerPage;
  try {
    const { count, rows } = await db.Category.findAndCountAll({
      limit: Number(rowsPerPage),
      offset: offSet,
    });

    if (rows) {
      return res.status(200).send({
        data: rows,
        total: count,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Lỗi server');
  }
};
const createCategory = async (req, res) => {
  try {
    const nameCategory = req.body.nameCategory;
    if (!nameCategory) {
      return res.status(422).send({ success: false, message: 'Dữ liệu không hợp lệ:' });
    } else {
      const data = await db.Category.create({
        nameCategory,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return res.status(201).send({
        success: true,
        message: 'Thêm mới danh mục sản phẩm thành công',
        data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Lỗi server' });
  }
};
const getCategory = async (req, res) => {
  try {
    const data = await db.Category.findByPk(req.params.id);
    if (data) {
      return res.status(200).send({
        data,
      });
    }
    return res.status(204).send({});
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Lỗi server' });
  }
};
const updateCategory = async (req, res) => {
  try {
    const nameCategory = req.body.nameCategory;
    if (!nameCategory) {
      return res.status(422).send({ success: false, message: 'Dữ liệu không hợp lệ:' });
    }
    const data = await db.Category.update(
      {
        nameCategory,
        updatedAt: new Date(),
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
        message: 'Sửa danh mục thành công',
        data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Lỗi server' });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const data = await db.Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (data) {
      return res.status(200).send({
        success: true,
        message: 'Xoá danh mục sản phẩm thành công',
        data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getCategorys, createCategory, getCategory, updateCategory, deleteCategory };
