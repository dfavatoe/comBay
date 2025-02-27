import mongoose from "mongoose";

const { Schema } = mongoose;

const categoriesListsSchema = new Schema({
  _id: Schema.Types.ObjectId,
  categoriesList: [String],
});

const CategoryListModel = mongoose.model(
  "CategoriesList",
  categoriesListsSchema
);

export default CategoryListModel;
