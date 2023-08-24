const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();
const crypto = require('crypto');
const db = require('../models/index');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ success: false, message: 'Dữ liệu không đầy đủ' });
    }

    const checkEmail = await db.User.findOne({
      where: {
        email,
      },
    });
    if (!checkEmail) {
      return res.status(404).send({ success: false, message: 'Tài khoản này không tồn tại' });
    }
    password = crypto.createHash('md5').update(password).digest('hex');
    const data = await db.User.findOne({
      attributes: { exclude: ['password'] },
      where: {
        email,
        password,
      },
    });
    if (data) {
      const accessToken = jwt.sign(
        {
          email: data.email,
          roleId: data.roleId,
        },
        process.env.SECRET_KEY,
        { expiresIn: 60 * 60 }
      );
      const refreshToken = jwt.sign(
        {
          email: data.email,
          roleId: data.roleId,
        },
        process.env.SECRET_KEY,
        { expiresIn: 60 * 60 * 24 }
      );
      const data2 = await db.Token.create({
        userId: data.id,
        token: refreshToken,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      res.cookie(
        'accessToken',
        accessToken
        // { httpOnly: true }
      );
      res.cookie('refreshToken', refreshToken);

      return res.status(200).send({
        success: true,
        message: 'Đăng nhập thành công',
        data,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: 'Tài khoản hoặc mật khẩu không chính xác',
      });
    }
  } catch (error) {}
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.headers.authorizationletter.split(' ')[1];
    const data = await db.Token.findOne({
      where: {
        token: refreshToken,
      },
    });
    if (!data) {
      return res.status(498).send({
        success: true,
        message: 'refresh token does not exist',
      });
    }
    const decode = jwt.decode(refreshToken);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const expiresIn = decode?.exp;
    if (currentTimestamp > expiresIn) {
      const data2 = await db.Token.destroy({
        where: {
          token: refreshToken,
        },
      });
      return res.status(498).send({
        success: true,
        message: 'refresh token expires',
      });
    }
    const newAccessToken = jwt.sign(
      {
        email: decode?.email,
        roleId: decode?.roleId,
      },
      process.env.SECRET_KEY,
      { expiresIn: 60 * 60 }
    );
    res.cookie('accessToken', newAccessToken);
    return res.status(200).send({
      success: true,
      message: 'refresh token sucess',
    });
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    const data = await db.Token.destroy({
      where: {
        token: refreshToken,
      },
    });
    if (data) {
      return res.status(200).send({
        success: true,
        message: 'Đăng xuất thành công',
      });
    }
    return res.status(403).send({
      success: false,
      message: 'Đăng xuất thất bại',
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {  login, refreshToken, logout };
