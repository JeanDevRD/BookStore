import connection from "../utils/DbConnection.js"
import AuthorModel from "../models/AuthorModel.js"
import CategoryModel from "../models/CategoryModel.js"
import BookModel from "../models/BookModel.js"
import PublisherModel from "../models/PublisherModel.js"

try{
    await connection.authenticate();
    console.log("Database connection established")
} catch (ex) {
    console.error("Error, database connection:", err);
}

BookModel.belongsTo(AuthorModel, { foreignKey: "athorId" });
BookModel.belongsTo(CategoryModel, { foreignKey: "categoriesId" });
BookModel.belongsTo(PublisherModel, { foreignKey: "publisherId" });

AuthorModel.hasMany(BookModel, { foreignKey: "athorId" });
CategoryModel.hasMany(BookModel, { foreignKey: "categoriesId" });
PublisherModel.hasMany(BookModel, { foreignKey: "publisherId" });

export default {
    sequelize: connection,
    BookModel,
    AuthorModel,
    PublisherModel,
    CategoryModel,
};



