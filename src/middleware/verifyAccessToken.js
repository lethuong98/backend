const jwt = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(498).send({
      success: true,
      message: 'valid',
    });
  }
  const accessToken = authorization.split(' ')[1];
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const expiresIn = jwt.decode(accessToken)?.exp;
  if (currentTimestamp > expiresIn) {
    return res.status(401).send({
      success: true,
      message: 'expires',
    });
  } else {
    jwt.verify(accessToken, process.env.SECRET_KEY, (err, data) => {
      if (err) {
        return res.status(498).send({
          success: true,
          message: 'valid',
        });
      }
      next();
    });
  }
};
module.exports = verifyAccessToken;
