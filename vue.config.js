module.exports = {
  /* ... other config ... */
  productionSourceMap: false,
  chainWebpack: config => {
    config.externals({
      Nimiq: "Nimiq"
    });
  },
  transpileDependencies: ["vue-stepper"]
};
