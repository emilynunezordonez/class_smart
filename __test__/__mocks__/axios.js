const axiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),

};

const axios = {
  create: jest.fn(() => axiosInstance),
  ...axiosInstance
};

export default axios;
