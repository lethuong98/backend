require('dotenv').config();
const crypto = require('crypto');
const db = require('../models/index');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    //check exist data
    if (!email || !password)
      return res.status(400).send({ success: false, message: 'Dữ liệu không đầy đủ' });

    //check exist user
    const checkEmail = await db.User.findOne({
      where: {
        email,
      },
    });
    if (!checkEmail)
      return res.status(404).send({ success: false, message: 'Tài khoản không tồn tại' });

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
      res.cookie('accessToken', accessToken);
      res.cookie('refreshToken', refreshToken);

      return res.status(200).send({
        success: true,
        message: 'Đăng nhập thành công',
        data,
      });
    } else {
      return res.status(400).send({
        success: true,
        message: 'Tài khoản hoặc mật khẩu không chính xác',
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Lỗi server',
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const authorizationletter = req.headers?.authorizationletter;
    if (!authorizationletter) {
      return res.status(498).send({
        success: false,
        message: 'refresh token không tồn tại',
      });
    }

    const refreshToken = authorizationletter.split(' ')[1];
    const data = await db.Token.findOne({
      where: {
        token: refreshToken,
      },
    });
    if (!data) {
      return res.status(498).send({
        success: false,
        message: 'refresh token không tồn tại',
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
        success: false,
        message: 'refresh token hết hạn',
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
      message: 'refresh token thành công',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Lỗi server',
    });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.body?.refreshToken;
    if (refreshToken) {
      await db.Token.destroy({
        where: {
          token: refreshToken,
        },
      });
    }

    return res.status(200).send({
      success: true,
      message: 'Đăng xuất thành công',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Lỗi server',
    });
  }
};

module.exports = { login, refreshToken, logout };
