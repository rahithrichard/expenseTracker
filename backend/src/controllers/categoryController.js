const categoryService = require("../services/categoryService");

const getCategories = async (req, res) => {
  res.json(await categoryService.listCategories());
};

module.exports = {
  getCategories,
};
