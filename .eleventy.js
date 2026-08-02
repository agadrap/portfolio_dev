module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("jsonify", (value) => JSON.stringify(value));

  return {
    dir: {
      input: "blog-src",
      output: "blog",
      includes: "_layouts"
    }
  };
};
