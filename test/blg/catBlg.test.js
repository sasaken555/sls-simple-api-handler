const catBlg = require("../../src/blg/catBlg");
const catDao = require("../../src/dao/catDao");

jest.mock("../../src/dao/catDao");

function mockDaoSelect(data) {
  catDao.select.mockResolvedValue(data);
}

function mockDaoInsert(data) {
  catDao.insert.mockResolvedValue(data);
}

function mockDaoRemove(data) {
  catDao.insert.mockResolvedValue(data);
}

test("should return a certain document", () => {
  // Setup Mocks
  const KEY = "thisiskey";
  const cloudantResponse = {
    _id: KEY,
    rev: "fdsajfjasldfjasdfjasfdahsjdfhas"
  };
  mockDaoSelect(cloudantResponse);

  // Call Business Logic
  const reqParams = {
    __ow_path: `/simple-api-handler/v1/cats/${KEY}`,
    __bx_creds: { cloudantnosqldb: { url: "https://example.com" } }
  };
  return catBlg.getOne(reqParams).then(response => {
    expect.assertions(2);
    expect(response).not.toBeUndefined();
    expect(response.body).toBe(cloudantResponse);
  });
});
