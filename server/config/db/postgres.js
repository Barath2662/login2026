const Sequelize = require("sequelize");

const db_conn = process.env.DBCONN;


const sequelize = new Sequelize(db_conn);


const connectPostgres = async() =>{
    try {
        await sequelize.authenticate();
        console.log("database connected successfully");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {connectPostgres,sequelize};