import connection from "../utils/DbConnection.js";
import { DataTypes } from "sequelize";

const Publishers = connection.define("Publishers",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primarykey: true,
            allowNull: false
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "Publishers"
    }
);

export default Publishers;