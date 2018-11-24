/**
 * Handle CRUD operation to CatDB
 */

const Cloudant = require("@cloudant/cloudant");

/**
 * Cloudantクラアントを作成する.
 * @param {String} url 接続URL
 */
function getClient(cloudantUrl) {
  const cloudant = Cloudant({ url: cloudantUrl });
  const db = cloudant.db.use("cats");
  return db;
}

/**
 * ネコをDBに登録する.
 * @param {String} connectionInfo.url 接続URL
 * @param {String} entiry._id ドキュメントID(キー)
 * @param {String} entiry.name 名称プロパティ
 * @param {String} entiry.color 色プロパティ
 * @returns {Promise}
 */
function insert(connectionInfo, entity) {
  return getClient(connectionInfo.url).insert(entity);
}

/**
 * キーに合致するネコをDBから取得する.
 * @param {String} connectionInfo.url 接続URL
 * @param {String} key ドキュメントID(キー)
 * @returns {Promise}
 */
function select(connectionInfo, key) {
  return getClient(connectionInfo.url).get(key);
}

module.exports = {
  insert: insert,
  select: select
};
