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

BookModel.belongsTo(AuthorModel, { foreignkey: "athorId"});
BookModel.belongsTo(CategoryModel, { foreignkey: "athorId"});
BookModel.belongsTo(PublisherModel, { foreignkey: "publisherId"});

AuthorModel.hasMany(BookModel, { foreignkey: "athorId"});
CategoryModel.hasMany(BookModel, { foreignkey: "categoryId"});
PublisherModel.hasMany(BookModel, { foreignkey: "publisherId"});

export default {
    sequelize: connection,
    BookModel,
    AuthorModel,
    PublisherModel,
    CategoryModel,
};



