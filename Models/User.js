const {Model, DataTypes} = require("sequelize")
const sequelize = require("../Config/connection")

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isLen: [4]
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: "user"
    }
)

module.exports = User