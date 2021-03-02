module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-typescript"],
  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties",
  ],
  only: ["./src", "./test"],
  env: {
    test: {
      plugins: [
        "istanbul"
      ],
    }
  }
};
