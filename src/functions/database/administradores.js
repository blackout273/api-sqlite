import db from "./sqliteDatabase.js";
import APIservices from "../axios/index.js";
const serviceAxios = new APIservices()


db.transaction((tx) => {
  tx.executeSql(
    "CREATE TABLE dadosAdministradores ( id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, email VARCHAR (100), createdAt DATETIME DEFAULT (CURRENT_TIMESTAMP) );"
  );
});

export const create = async (email) => {
    return new Promise(async (resolve, reject) => {

          db.transaction(async (tx) => {
            tx.executeSql(
              "INSERT INTO dadosAdministradores (email) values (?);",
              [email],
              //-----------------------
              (_, { rowsAffected, insertId }) => {
                console.log(rowsAffected)     
                if (rowsAffected > 0) resolve(insertId);
                else reject("Error inserting obj: " + JSON.stringify(obj)); // insert falhou
              },
              (_, error) => {
                console.log(error)
                reject(error)} // erro interno em tx.executeSql
            );
          })
    });
  
  };

  export const find = (email) => {

    return new Promise(async (resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM dadosAdministradores WHERE email=?;",
          [email],
          //-----------------------
          async (_, { rows }) => {
            console.log(rows)
            if (rows.length > 0)  resolve(rows._array[0].id)
            reject("Obj not found: email=" + email)
            ;
          },
          (_, error) => reject(error)
        );
      });
    });
  };

  export const remove = (id) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "DELETE FROM dadosAdministradores WHERE id=?;",
          [id],
          //-----------------------
          (_, { rowsAffected }) => {
            resolve(rowsAffected);
          },
          (_, error) => reject(error)
        );
      });
    });
  };