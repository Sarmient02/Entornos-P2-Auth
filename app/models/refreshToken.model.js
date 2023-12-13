const config = require("../config/auth.config");
const { v4: uuidv4 } = require("uuid");
require('dotenv').config({path: '../../.env'});

module.exports = (sequelize, Sequelize) => {
  const RefreshToken = sequelize.define("refresh_token", {
    token: {
      type: Sequelize.STRING,
    },
    expiry_date: {
      type: Sequelize.DATE,
    },
  }, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  RefreshToken.createToken = async function (user) {
    let expiredAt = new Date();

    expiredAt.setSeconds(expiredAt.getSeconds() + (3600*24));

    let _token = uuidv4();

    let refreshToken = await this.create({
      token: _token,
      user_id: user.id,
      expiry_date: expiredAt.getTime(),
    });

    return refreshToken.token;
  };

  RefreshToken.verifyExpiration = (token) => {
    return  token.expiry_date.getTime() < new Date().getTime();
  };

  return RefreshToken;
};