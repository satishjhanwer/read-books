module.exports = {
  collectCoverageFrom: ['!app/app.js', 'app/**/*.{js,jsx}', '!app/global-styles.js', '!app/**/*.test.{js,jsx}'],
  testEnvironment: 'jsdom',
  coverageThreshold: {
    global: {
      lines: 80,
      branches: 80,
      functions: 80,
      statements: 80,
    },
  },
  moduleFileExtensions: ['js'],
  moduleDirectories: ['node_modules', 'app', __dirname],
  moduleNameMapper: {
    '.*\\.(css|less|styl|scss|sass)$': '<rootDir>/mocks/cssModule.js',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/mocks/image.js',
  },
};
