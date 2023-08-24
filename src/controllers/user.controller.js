const db = require('../models/index');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const moment = require('moment');
const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET,
// });

// cloudinary.api.delete_resources(
//   ['users/trang-ao-po-lo-nu-2_xy7vct', 'users/trang-ao-po-lo-nu-1_1692783898424'],
//   function (error, result) {
//     console.log(error);
//     console.log(result);
//   }
// );

const getUsers = async (req, res) => {
  const role = req.query.role || 0;
  const rowsPerPage = Number(req.query.rowsPerPage) || 100;
  const page = Number(req.query.page) || 0;
  const offSet = page * rowsPerPage;
  const searchKeyword = req.query.searchKeyword || '';
  const month = req.query.month || '';
  const date = req.query.date || '';

  let filter = {
    role: role || [1, 2, 3],
    [Op.or]: [
      {
        fullName: {
          [Op.like]: '%' + searchKeyword + '%',
        },
      },
      {
        email: {
          [Op.like]: '%' + searchKeyword + '%',
        },
      },
      {
        phoneNumber: {
          [Op.like]: '%' + searchKeyword + '%',
        },
      },
      {
        address: {
          [Op.like]: '%' + searchKeyword + '%',
        },
      },
      {
        hobby: {
          [Op.like]: '%' + searchKeyword + '%',
        },
      },
    ],
  };
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
  try {
    const data = await db.User.findAll({
      attributes: { exclude: ['password'] },
      where: filter,
      order: [['createdAt', 'DESC']],
      limit: Number(rowsPerPage),
      offset: offSet,
    });
    const dataToGetTotal = await db.User.findAll({
      attributes: ['id'],
      where: filter,
    });

    return res.status(200).send({
      data: data,
      total: dataToGetTotal.length,
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send('Lỗi server');
  }
};

const getAuthor = async (req, res) => {
  try {
    const data = await db.User.findAll({
      attributes: ['id', 'fullName'],
    });
    if (data) {
      return res.status(200).send({
        data: data,
      });
    }
  } catch (error) {}
};

const createUser = async (req, res) => {
  const avatar = req.file?.path || '';
  try {
    if (!req.body.email || !req.body.password || !req.body.fullName) {
      return res.status(400).send({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' });
    }
    const checkEmail = await db.User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (checkEmail) {
      return res.status(409).send({ success: false, message: 'Email đã được sử dụng' });
    }
    const password = crypto.createHash('md5').update(req.body.password).digest('hex');
    const data = await db.User.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password,
      phoneNumber: req.body.phoneNumber || '',
      hobby: req.body.hobby || '',
      address: req.body.address || '',
      avatar,
      role: req.body.role || '3',
      filterDate: moment(new Date()).format('DD-MM-YYYY'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return res.status(201).send({
      success: true,
      message: 'Tạo tài khoản thành công',
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Lỗi server' });
  }
};
const changePassword = async (req, res) => {
  try {
    const data = await db.User.findByPk(req.params.id);
    if (crypto.createHash('md5').update(req.body.curentPassword).digest('hex') === data.password) {
      const dataUpdate = await db.User.update(
        {
          password: crypto.createHash('md5').update(req.body.newPassword).digest('hex'),
        },
        { where: { id: req.params.id } }
      );
      if (dataUpdate) {
        return res.status(200).send({ success: true, message: 'Thay đổi mật khẩu thành công' });
      } else {
        return res.status(200).send({ success: false, message: 'Thay đổi mật khẩu thất bại' });
      }
    }
    return res.status(200).send({ success: false, message: 'Mật khẩu hiện tại không đúng' });
  } catch (error) {
    console.log('error', error);
  }
};
const getUser = async (req, res) => {
  try {
    const data = await db.User.findByPk(req.params.id);
    if (data) {
      return res.status(200).send({
        success: true,
        data,
      });
    }
    return res.status(204).send({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: 'Lỗi server' });
  }
};
const updateUser = async (req, res) => {
  const prevAvatar = req.body?.prevAvatar || '';
  const avatar = req.file?.path || '';

  if (avatar) {
    try {
      if (prevAvatar) {
        cloudinary.uploader.destroy(
          `users/${path.basename(req.body?.prevAvatar, path.extname(req.body?.prevAvatar))}`
        );
      }
      const data = await db.User.update(
        {
          ...req.body,
          avatar,
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
        message: 'Sửa tài khoản thành công',
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success: false, message: 'Lỗi server' });
    }
  }

  try {
    const data = await db.User.update(
      {
        ...req.body,
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
      message: 'Sửa tài khoản thành công',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Lỗi server' });
  }
};
const deleteUser = async (req, res) => {
  try {
    const dataDelete = await db.User.findByPk(req.params.id);
    const avatar = dataDelete?.avatar;
    if (avatar) {
      cloudinary.uploader.destroy(
          `users/${path.basename(avatar, path.extname(avatar))}`
        );
    }
    const data = await db.User.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).send({
      success: true,
      message: 'Xoá tài khoản thành công',
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Lỗi server' });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getAuthor,
  changePassword,
};
