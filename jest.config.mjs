import nextJest from "next/jest.js";

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
    // Path to your Next.js app (loads next.config.js and .env files)
    dir: "./",
});

// Custom Jest configuration
const config = {
    coverageProvider: "v8",

    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

    testEnvironment: "jest-environment-jsdom",

    preset: "ts-jest",
};

// Export async config so next/jest can load Next.js config
export default createJestConfig(config);
