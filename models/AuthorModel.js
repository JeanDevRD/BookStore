import connection from "../utils/DbConnection.js";
import { DataTypes } from "sequelize";

const Authors = connection.define("Authors",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        tableName: "Authors"
    }
);

export default Authors;

