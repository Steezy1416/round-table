const {Model, DataTypes} = require("sequelize")
const sequelize = require("../config/connection")

class UserChat extends Model {}

UserChat.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "user",
                key: "id"
            }
        },
        chat_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "chat",
                key: "id"
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: "user_chat"
    }
)

module.exports = UserChat