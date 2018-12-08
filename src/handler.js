/**
 * Entrypoint for Cat Oparation.
 */

"use strict";

const catBlg = require("./blg/catBlg");

/**
 * ネコをDBに登録する
 * @param {String} params.__bx_creds.url 接続URL
 * @param {String} params.name 名称
 * @param {String} params.color 色
 * @returns {Object} Promise for the Cloudant result
 */
function createCat(params) {
  return catBlg.create(params);
}

/**
 * キーに合致するネコを取得する.
 * @param {String} params.__bx_creds.url 接続URL
 * @param {String} params.id ID
 * @returns {Object} Promise for the Cloudant result
 */
function getCat(params) {
  return catBlg.getOne(params);
}

/**
 * キーに合致するネコを更新する.
 * @param {String} params.__bx_creds.url 接続URL
 * @param {String} params.name 名称
 * @param {String} params.color 色
 * @returns {Object} Promise for the Cloudant result
 */
function updateCat(params) {
  return catBlg.update(params);
}

/**
 * キーに合致するネコを取得する.
 * @param {String} params.__bx_creds.url 接続URL
 * @param {String} params.id ID
 * @returns {Object} Promise for the Cloudant result
 */
function deleteCat(params) {
  return catBlg.deleteOne(params);
}

exports.createCat = createCat;
exports.getCat = getCat;
exports.updateCat = updateCat;
exports.deleteCat = deleteCat;
