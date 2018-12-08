const catBlg = require("../../src/blg/catBlg");
const catDao = require("../../src/dao/catDao");

jest.mock("../../src/dao/catDao");

const mockDaoSelect = data => {
  catDao.select.mockResolvedValue(data);
};

const mockDaoSelectError = (errorCode, errorMsg) => {
  catDao.select.mockRejectedValue({
    statusCode: errorCode,
    message: errorMsg
  });
};

const mockDaoInsert = data => {
  catDao.insert.mockResolvedValue(data);
};

const mockDaoInsertError = (errorCode, errorMsg) => {
  catDao.insert.mockRejectedValue({
    statusCode: errorCode,
    message: errorMsg
  });
};

const mockDaoRemove = data => {
  catDao.remove.mockResolvedValue(data);
};

const mockDaoRemoveError = (errorCode, errorMsg) => {
  catDao.remove.mockRejectedValue({
    statusCode: errorCode,
    message: errorMsg
  });
};

// Test Cases Below...
describe("catBlg.getOne", () => {
  test("should return a document when key exists", () => {
    // Setup Mocks
    const KEY = "thisiskey";
    const cloudantResponse = {
      _id: KEY,
      _rev: "fdsajfjasldfjasdfjasfdahsjdfhas",
      color: "Saba",
      name: "Hoge"
    };
    mockDaoSelect(cloudantResponse);

    // Call Business Logic
    const reqParams = {
      __ow_path: `/simple-api-handler/v1/cats/${KEY}`,
      __bx_creds: { cloudantnosqldb: { url: "https://example.com" } }
    };
    return catBlg.getOne(reqParams).then(response => {
      expect.assertions(4);
      // assert response
      expect(response).not.toBeUndefined();
      expect(response.statusCode).toBe(200);
      expect(response.body).toBe(cloudantResponse);
      // assert mock value mappings
      expect(catDao.select).toBeCalledWith(
        reqParams.__bx_creds.cloudantnosqldb,
        KEY
      );
    });
  });

  test("should return error when key do not exist", () => {
    // Setup Mocks
    const KEY = "nonExistKey";
    const errMsg = "Error thrown from mock.";
    mockDaoSelectError(500, errMsg);

    // Call Business Logic
    const reqParams = {
      __ow_path: `/simple-api-handler/v1/cats/${KEY}`,
      __bx_creds: { cloudantnosqldb: { url: "https://example.com" } }
    };
    return catBlg.getOne(reqParams).catch(response => {
      expect.assertions(5);
      expect(response).not.toBeUndefined();
      expect(response.statusCode).toBe(500);
      expect(response.body._id).toBe(KEY);
      expect(response.body.message).toBe(errMsg);
      // assert mock value mappings
      expect(catDao.select).toBeCalledWith(
        reqParams.__bx_creds.cloudantnosqldb,
        KEY
      );
    });
  });
});

describe("catBlg.create", () => {
  test("should return a created document keys", () => {
    // Setup Mocks
    const cloudantResponse = {
      _id: "createdKey",
      _rev: "thatisrevision",
      ok: true
    };
    mockDaoInsert(cloudantResponse);

    // Call Business Logic
    const reqParams = {
      __ow_path: `/simple-api-handler/v1/cats`,
      __bx_creds: { cloudantnosqldb: { url: "https://example.com" } },
      color: "Black",
      name: "Piyo"
    };
    return catBlg.create(reqParams).then(response => {
      expect.assertions(6);
      // assert response
      expect(response).not.toBeUndefined();
      expect(response.statusCode).toBe(201);
      expect(response.body).toBe(cloudantResponse);
      // assert mock value mappings
      expect(catDao.insert.mock.calls[0][0]).toEqual(
        reqParams.__bx_creds.cloudantnosqldb
      );
      expect(catDao.insert.mock.calls[0][1].color).toBe("Black");
      expect(catDao.insert.mock.calls[0][1].name).toBe("Piyo");
    });
  });

  test("should return error when unexpected error", () => {
    // Setup Mocks
    const errMsg = "Error thrown from mock.";
    mockDaoInsertError(500, errMsg);

    // Call Business Logic
    const reqParams = {
      __ow_path: `/simple-api-handler/v1/cats`,
      __bx_creds: { cloudantnosqldb: { url: "https://example.com" } },
      color: "Black",
      name: "Piyo"
    };
    return catBlg.getOne(reqParams).catch(response => {
      expect.assertions(6);
      expect(response).not.toBeUndefined();
      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe(errMsg);
      // assert mock value mappings
      expect(catDao.insert.mock.calls[0][0]).toEqual(
        reqParams.__bx_creds.cloudantnosqldb
      );
      expect(catDao.insert.mock.calls[0][1].color).toBe("Black");
      expect(catDao.insert.mock.calls[0][1].name).toBe("Piyo");
    });
  });
});
