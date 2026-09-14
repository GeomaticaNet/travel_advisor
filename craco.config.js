module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Find the oneOf rule that contains the babel-loader
      const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf);
      if (oneOfRule) {
        const babelLoader = oneOfRule.oneOf.find(
          (rule) => rule.loader && rule.loader.includes('babel-loader')
        );
        if (babelLoader && babelLoader.exclude) {
          // Exclude mapbox-gl from Babel transpilation
          if (Array.isArray(babelLoader.exclude)) {
            babelLoader.exclude.push(/node_modules\/mapbox-gl/);
          } else {
            babelLoader.exclude = [babelLoader.exclude, /node_modules\/mapbox-gl/];
          }
        }
      }
      return webpackConfig;
    },
  },
};
