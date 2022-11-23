import db from "./sqliteDatabase.js";
import APIservices from "../axios/index.js";
const serviceAxios = new APIservices();

db.transaction((tx) => {
  tx.executeSql(
    "CREATE TABLE dadosAdministradores ( id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, emailRoot VARCHAR (100),senha VARCHAR (64), usuario VARCHAR (64), createdAt DATETIME DEFAULT (CURRENT_TIMESTAMP) );"
  );
});

export const addToAdminList = async (emailRoot,usuario) => {
  return new Promise(async (resolve, reject) => {
    db.transaction(async (tx) => {
      tx.executeSql(
        "INSERT INTO dadosAdministradores (emailRoot, usuario) values (?,?);",
        [emailRoot,usuario],
        //-----------------------
        (_, { rowsAffected, insertId }) => {
          console.log(rowsAffected);
          if (rowsAffected > 0) resolve(insertId);
          else reject("Error inserting obj: " + JSON.stringify(obj)); // insert falhou
        },
        (_, error) => {
          console.log(error);
          reject(error);
        } // erro interno em tx.executeSql
      );
    });
  });
};

export const checkIfIsAdmin = (emailRoot) => {
  return new Promise(async (resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM dadosAdministradores WHERE emailRoot=?;",
        [emailRoot],
        //-----------------------
        async (_, { rows }) => {
          console.log("checkIfIsAdmin: ",rows.length)
          if (rows.length > 0) resolve(rows._array[0].id);
          reject("Obj not found: emailRoot=" + emailRoot);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const removeAdminList = (id) => {
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

export const removeAllAdmins = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "DELETE FROM dadosAdministradores;",
        [],
        //-----------------------
        (_, { rowsAffected }) => {
          resolve(rowsAffected);
        },
        (_, error) => reject(error)
      );
    });
  });
};
export const allAdmins = () => {
  const usersList = [];
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM dadosAdministradores;",
        [],

        (_, { rows }) => {
          for (let i = 0; i < rows._array.length; i++) {
            usersList.push({
              usuario: rows._array[i].usuario,
              emailRoot: rows._array[i].emailRoot,
              id: rows._array[i].id,
            });
          }

          resolve(usersList);
        },
        (_, error) => reject(error)
      );
    });
  });
};
