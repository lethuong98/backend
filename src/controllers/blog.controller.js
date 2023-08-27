const db = require('../models/index');
const { Op } = require('sequelize');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const getAllBlog = async (req, res) => {
  const searchKeyword = req.query.searchKeyword || '';
  const rowsPerPage = Number(req.query.rowsPerPage) || 100;
  const page = Number(req.query.page) || 0;
  const offSet = page * rowsPerPage || 0;
  const sortBy = req.query.sortBy || 'createdAt';
  const sorted = req.query.sorted || 'desc';
  let filter = {
    title: {
      [Op.like]: '%' + searchKeyword + '%',
    },
  };
  try {
    const {count, rows} = await db.Blog.findAndCountAll({
      where: filter,
      order: [[sortBy, sorted]],
      limit: Number(rowsPerPage),
      offset: offSet,
    });

    return res.status(200).send({
      data: rows,
      total: count,
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send('Lỗi server');
  }
};

const createBlog = async (req, res) => {
  const banners = req.file?.path || '';
  try {
    const data = await db.Blog.create({
      userId: Number(req.body.userId),
      title: req.body.title,
      banners,
      content: req.body.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return res.status(201).send({
      success: true,
      message: 'Thêm blog thành công',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Lỗi server' });
  }
};
const getBlog = async (req, res) => {
  try {
    const data = await db.Blog.findByPk(req.params.id);
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
const updateBlog = async (req, res) => {
  try {
    const bannersChange = req.body.bannersChange;
    if (bannersChange === 'false') {
      const data = await db.Blog.update(
        {
          title: req.body.title,
          content: req.body.content,
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
        message: 'Sửa blog thành công',
        data,
      });
    }
    const newBanners = req.file?.path || '';
    cloudinary.uploader.destroy(
      `blogs/${path.basename(req.body.oldBanners, path.extname(req.body.oldBanners))}`
    );
    const data = await db.Blog.update(
      {
        title: req.body.title,
        content: req.body.content,
        banners: newBanners,
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
};
const deleteBlog = async (req, res) => {
  try {
    const dataDelete = await db.Blog.findByPk(req.params.id);
    const banners = dataDelete?.banners;
    if (banners) {
      cloudinary.uploader.destroy(`blogs/${path.basename(banners, path.extname(banners))}`);
    }
    const data = await db.Blog.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).send({
      success: true,
      message: 'Xoá blog thành công',
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Lỗi server' });
  }
};

module.exports = {
  getAllBlog,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};
