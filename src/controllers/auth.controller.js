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

const forgetPassword = async (req, res) => {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;
  const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'lethuong1621998@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    let into = await transport.sendMail({
      from: '"Hanz Store"<lethuong1621998@gmail.com>',
      to: 'lethuong16021998@gmail.com',
      subject: 'MẬT KHẨU MỚI',
      text: 'Hello',
      html: '<b>Hello</b>',
    });
    console.log('send mail ok');
  } catch (error) {
    console.log(error);
  }

  return res.send('sssssss23423423ssss');
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

module.exports = { forgetPassword, login, refreshToken, logout };
