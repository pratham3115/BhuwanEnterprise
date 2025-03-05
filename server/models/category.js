const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true }, // Made image required and added trim
  },
  { timestamps: true },
)

const Category = mongoose.model("Category", categorySchema)
module.exports = Category

