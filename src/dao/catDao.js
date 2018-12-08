/**
 * Handle CRUD operation to CatDB
 */

const Cloudant = require("@cloudant/cloudant");

/**
 * Cloudantクラアントを作成する.
 * @param {String} cloudantUrl Cloudant接続URL
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
 * @returns {Promise} resolved Object's keys are [_id,_rev,color,name]
 */
function insert(connectionInfo, entity) {
  return getClient(connectionInfo.url).insert(entity);
}

/**
 * キーに合致するネコをDBから取得する.
 * @param {String} connectionInfo.url 接続URL
 * @param {String} key ドキュメントID(キー)
 * @returns {Promise} resolved Object's keys are [id,rev,ok]
 */
function select(connectionInfo, key) {
  return getClient(connectionInfo.url).get(key);
}

/**
 * キーに合致するネコをDBから削除する.
 * @param {String} connectionInfo.url 接続URL
 * @param {String} key._id ドキュメントID
 * @param {String} key.rev ドキュメントリビジョン
 * @returns {Promise} resolved Object's keys are [id,rev,ok]
 */
function remove(connectionInfo, key) {
  return getClient(connectionInfo.url).destroy(key._id, key.rev);
}

module.exports = {
  insert: insert,
  select: select,
  remove: remove
};
