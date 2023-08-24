const db = require('../models/index');
const Ajv = require('ajv');
const ajv = new Ajv();

const schema = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    fullName: { type: 'string', minLength: 1, maxLength: 50 },
    email: { type: 'string', minLength: 1, maxLength: 150 },
    phoneNumber: { type: 'string', minLength: 10, maxLength: 20 },
    subjectName: { type: 'string', minLength: 1, maxLength: 350 },
    note: { type: 'string', minLength: 1, maxLength: 350 },
  },
  required: ['userId', 'fullName', 'email', 'phoneNumber', 'subjectName', 'note'],
};
const validate = ajv.compile(schema);

const getFeedBacks = async (req, res) => {
  try {
    const data = await db.FeedBack.findAll();
    if (data) {
      res.status(200).send({
        success: true,
        data,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Lỗi server');
  }
};
const createFeedBack = async (req, res) => {
  try {
    const dataPost = {
      userId: Number(req.body.userId),
      fullName: req.body.fullName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      subjectName: req.body.subjectName,
      note: req.body.note,
    };
    const valid = validate(dataPost);
    if (!valid) {
      console.log(validate.errors);
      return res.status(422).send({ success: false, message: 'Dữ liệu không hợp lệ:' });
    } else {
      const data = await db.FeedBack.create({
        ...dataPost,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return res.status(201).send({
        success: true,
        message: 'Tạo feedback sản phẩm thành công',
        data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Lỗi server' });
  }
};
const getFeedBack = async (req, res) => {
  try {
    const data = await db.FeedBack.findByPk(req.params.id);
    if (data) {
      return res.status(200).send({
        data,
      });
    } else {
      return res.status(204).send({
        data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Lỗi server' });
  }
};
const updateFeedBack = async (req, res) => {
  try {
    const dataPost = {
      userId: Number(req.body.userId),
      fullName: req.body.fullName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      subjectName: req.body.subjectName,
      note: req.body.note,
    };
    const valid = validate(dataPost);
    if (!valid) {
      console.log(validate.errors);
      return res.status(422).send({ success: false, message: 'Dữ liệu không hợp lệ:' });
    } else {
      const data = await db.FeedBack.update(
        {
          ...dataPost,
          updatedAt: new Date(),
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      return res.status(201).send({
        success: true,
        message: 'cập nhật feedback sản phẩm thành công',
        data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Lỗi server' });
  }
};

const deleteFeedBack = async (req, res) => {
  try {
    const data = await db.FeedBack.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (data) {
      return res.status(200).send({
        success: true,
        message: 'Xoá feedback thành công',
        data,
      });
    } else {
      return res.status(204).send({
        success: true,
        message: 'Không tìm thấy feedback',
        data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getFeedBacks, createFeedBack, getFeedBack, updateFeedBack, deleteFeedBack };
