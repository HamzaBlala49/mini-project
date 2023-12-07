const mysql = require("mysql");

const connectionIfo = {
  host: "localhost",
  user: "root",
  password: "",
  database:"debt_system"
};
let connection = mysql.createConnection(connectionIfo);


module.exports = {
  connection
}
