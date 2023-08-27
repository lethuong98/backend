const db = require('../models/index');

const getSizes = async (req, res) => {
  const rowsPerPage = Number(req.query.rowsPerPage) || 100;
  const page = Number(req.query.page) || 0;
  const offSet = page * rowsPerPage;
  try {
    const {count, rows} = await db.Size.findAndCountAll({ limit: Number(rowsPerPage), offset: offSet });
    const dataToGetTotal = await db.Size.findAll();
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
const createSize = async (req, res) => {
  try {
    const nameSize = req.body.nameSize;
    if (!nameSize) {
      return res.status(422).send({ success: false, message: 'Dữ liệu không hợp lệ:' });
    } else {
      const data = await db.Size.create({
        nameSize,
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
const getSize = async (req, res) => {
  try {
    const data = await db.Size.findByPk(req.params.id);
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
const updateSize = async (req, res) => {
  try {
    const nameSize = req.body.nameSize;
    if (!nameSize) {
      return res.status(422).send({ success: false, message: 'Dữ liệu không hợp lệ:' });
    }
    const data = await db.Size.update(
      {
        nameSize,
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
const deleteSize = async (req, res) => {
  try {
    const data = await db.Size.destroy({
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

module.exports = { getSizes, createSize, getSize, updateSize, deleteSize };
