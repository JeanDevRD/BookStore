import connection from "../utils/DbConnection.js";
import { DataTypes } from "sequelize";

const Books = connection.define(
    "Books",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        tittle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        publicationYear: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        coverImage: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        categoriesId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Categories",
                key: "id",
            },
        },
        athorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Authors",
                key: "id",
            },
        },
        publisherId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Publishers",
                key: "id",
            },
        },
    },
    {
        totableName: "Books"
    }
)

export default Books;