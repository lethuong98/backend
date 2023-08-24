const db = require('../models/index');

const getColors = async (req, res) => {
  const rowsPerPage = Number(req.query.rowsPerPage);
  const offSet = Number(req.query.page) * rowsPerPage;
  try {
    const data = await db.Color.findAll({ limit: Number(rowsPerPage), offset: offSet });
    const dataToGetTotal = await db.Color.findAll();
    if (data) {
      return res.status(200).send({
        data: data,
        total: dataToGetTotal.length,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Lỗi server');
  }
};
const createColor = async (req, res) => {
  try {
    const { nameColor, previewColor } = req.body;
    if (!nameColor || !previewColor) {
      return res.status(422).send({ success: false, message: 'Dữ liệu không hợp lệ:' });
    }
    const data = await db.Color.create({
      nameColor,
      previewColor,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return res.status(201).send({
      success: true,
      message: 'Thêm mới màu sản phẩm thành công',
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Lỗi server' });
  }
};
const getColor = async (req, res) => {
  try {
    const data = await db.Color.findByPk(req.params.id);
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
const updateColor = async (req, res) => {
  try {
    const { nameColor, previewColor } = req.body;
    console.log(req.body);
    if (!nameColor) {
      return res.status(422).send({ success: false, message: 'Dữ liệu không hợp lệ:' });
    }
    const data = await db.Color.update(
      {
        nameColor,
        previewColor,
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
        message: 'Sửa màu thành công',
        data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Lỗi server' });
  }
};
const deleteColor = async (req, res) => {
  try {
    const data = await db.Color.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (data) {
      return res.status(200).send({
        success: true,
        message: 'Xoá màu sản phẩm thành công',
        data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getColors, createColor, getColor, updateColor, deleteColor };
