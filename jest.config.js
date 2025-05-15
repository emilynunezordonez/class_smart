export const setupFilesAfterEnv = ["<rootDir>/jest.setup.js"];
export const collectCoverage = true;
export const collectCoverageFrom = ["src/**/*.{js,jsx}"];
export const transform =   {"^.+\\.[t|j]sx?$": "babel-jest"};
