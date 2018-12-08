/**
 * Business Logic for Cat.
 */

"use strict";

const catDao = require("../dao/catDao");
const uuid = require("uuid/v4");

/**
 * ネコをDBに登録する
 * @param {String} params.__bx_creds.url 接続URL
 * @param {String} params.name 名称
 * @param {String} params.color 色
 * @returns {Promise} Promise for the Cloudant result
 */
function create(params) {
  return new Promise(function(resolve, reject) {
    const cat = {
      _id: uuid(),
      name: params.name,
      color: params.color
    };

    catDao
      .insert(params.__bx_creds.cloudantnosqldb, cat)
      .then(body => {
        resolve(createResponse(201, body));
      })
      .catch(err => {
        reject(createResponse(err.statusCode, { message: err.message }));
      });
  });
}

/**
 * キーに合致するネコをDBから取得する.
 * @param {String} params.__bx_creds.url 接続URL
 * @param {String} params.id キー
 * @returns {Promise} Promise for the Cloudant result
 */
function getOne(params) {
  return new Promise(function(resolve, reject) {
    // params.__ow_path should be /simple-api-handler/v1/cats/{id}
    params.id = params.__ow_path.split("/")[4];
    catDao
      .select(params.__bx_creds.cloudantnosqldb, params.id)
      .then(body => {
        resolve(createResponse(200, body));
      })
      .catch(err => {
        const errBody = {
          _id: params.id,
          message: err.message
        };
        reject(createResponse(err.statusCode, errBody));
      });
  });
}

/**
 * キーに合致するネコを更新する.
 * @param {String} params.__bx_creds.url 接続URL
 * @param {String} params.id キー
 * @param {String} params.name 名称
 * @param {String} params.color 色
 * @returns {Promise} Promise for the Cloudant result
 */
function update(params) {
  return new Promise(function(resolve, reject) {
    params.id = params.__ow_path.split("/")[4];
    catDao
      .select(params.__bx_creds.cloudantnosqldb, params.id)
      .then(data => {
        if (params.name) {
          data.name = params.name;
        }
        if (params.color) {
          data.color = params.color;
        }
        return catDao.insert(params.__bx_creds.cloudantnosqldb, data);
      })
      .then(body => {
        resolve(createResponse(200, body));
      })
      .catch(err => {
        const errBody = {
          _id: params.id,
          message: err.message
        };
        reject(createResponse(err.statusCode, errBody));
      });
  });
}

/**
 * キーに合致するネコを削除する.
 * @param {String} params.__bx_creds.url 接続URL
 * @param {String} params.id キー
 * @returns {Promise} Promise for the Cloudant result
 */
function deleteOne(params) {
  return new Promise(function(resolve, reject) {
    params.id = params.__ow_path.split("/")[4];
    catDao
      .select(params.__bx_creds.cloudantnosqldb, params.id)
      .then(data => {
        const key = { _id: data._id, rev: data._rev };
        return catDao.remove(params.__bx_creds.cloudantnosqldb, key);
      })
      .then(body => {
        resolve(createResponse(200, body));
      })
      .catch(err => {
        const errBody = {
          _id: params.id,
          message: err.message
        };
        reject(createResponse(err.statusCode, errBody));
      });
  });
}

/**
 * レスポンスオブジェクトを生成する
 * @param {Integer} statusCode 2xx,3xx,4xx,5xxを入れる
 * @param {Object} body ボディ
 */
function createResponse(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body
  };
}

module.exports = {
  create: create,
  getOne: getOne,
  update: update,
  deleteOne: deleteOne
};
