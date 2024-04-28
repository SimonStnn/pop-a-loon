export default {
  runtime: {
    getURL: jest.fn(),
    onInstalled: {
      addListener: jest.fn(),
    },
  },
};
