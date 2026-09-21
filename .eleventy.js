module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("jsonify", (value) => JSON.stringify(value));
  eleventyConfig.addFilter("isoDate", (value) => {
    if (!value) return "";
    const d = value instanceof Date ? value : new Date(value);
    return d.toISOString().slice(0, 10);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_layouts"
    }
  };
};
