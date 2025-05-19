export default {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx}"],
  transform: { "^.+\\.[t|j]sx?$": "babel-jest" },
  moduleNameMapper: {
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/__test__/__mocks__/fileMock.js",
  },
};
