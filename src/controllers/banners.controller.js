const db = require('../models/index');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const getAllBanners = async (req, res) => {
  const rowsPerPage = Number(req.query.rowsPerPage) || 100;
  const offSet = Number(req.query.page) * rowsPerPage || 0;

  try {
    const data = await db.Banners.findAll({
      order: [['createdAt', 'DESC']],
      limit: rowsPerPage,
      offset: offSet,
    });
    const dataToGetTotal = await db.Banners.findAll();

    return res.status(200).send({
      data: data,
      total: dataToGetTotal.length,
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send('Lỗi server');
  }
};

const createBanners = async (req, res) => {
  const previewBanners = req.file?.path || '';
  try {
    const data = await db.Banners.create({
      nameBanners: req.body.nameBanners,
      previewBanners,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return res.status(201).send({
      success: true,
      message: 'Thêm banners thành công',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Lỗi server' });
  }
};
const getBanners = async (req, res) => {
  try {
    const data = await db.Banners.findByPk(req.params.id);
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
const updateBanners = async (req, res) => {
  try {
    const bannersChange = req.body.bannersChange;
    if (bannersChange === 'false') {
      const data = await db.Banners.update(
        {
          nameBanners: req.body.nameBanners,
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
        message: 'Sửa banners thành công',
        data,
      });
    }
    const newPreviewBanners = req.file?.path || '';
    cloudinary.uploader.destroy(
      `banners/${path.basename(req.body.oldBanners, path.extname(req.body.oldBanners))}`
    );

    const data = await db.Banners.update(
      {
        nameBanners: req.body.nameBanners,
        previewBanners: newPreviewBanners,
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
const deleteBanners = async (req, res) => {
  try {
    const dataDelete = await db.Banners.findByPk(req.params.id);
    const previewBanners = dataDelete?.previewBanners;
    if (previewBanners) {
      cloudinary.uploader.destroy(
        `banners/${path.basename(previewBanners, path.extname(previewBanners))}`
      );
    }
    const data = await db.Banners.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).send({
      success: true,
      message: 'Xoá banners thành công',
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Lỗi server' });
  }
};

module.exports = {
  getAllBanners,
  getBanners,
  createBanners,
  updateBanners,
  deleteBanners,
};
