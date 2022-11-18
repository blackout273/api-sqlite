import db from "./sqliteDatabase.js";
import JWT from 'expo-jwt'
import APIservices from "../axios/index.js";
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21lIjoiTHVjYXMgTmFuaWNhIn0.L5_1mxlyOln5fex_zQ65nkLMgD7GF-KMvBwiOwxyGew"

const serviceAxios = new APIservices()

/**
 * INICIALIZAÇÃO DA TABELA
 * - Executa sempre, mas só cria a tabela caso não exista (primeira execução)
 */
db.transaction((tx) => {
  //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
  //tx.executeSql("DROP TABLE cars;");
  //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>

  tx.executeSql(
    "CREATE TABLE dadosUsuarios ( id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, email VARCHAR (100), senha VARCHAR (64), usuario VARCHAR (64), createdAt DATETIME DEFAULT (CURRENT_TIMESTAMP) );"
  );
});


export const create = async (obj) => {
  return new Promise(async (resolve, reject) => {
    let hashPassword = await serviceAxios.transformToHash(obj.senha).then(result=>result).catch(e=>e)
    console.log(`Hash Password: ${hashPassword} ${typeof(hashPassword)} ${hashPassword.length}`)
        db.transaction(async (tx) => {
          tx.executeSql(
            "INSERT INTO dadosUsuarios (email, senha, usuario) values (?, ?, ?);",
            [obj.email, hashPassword, obj.usuario],
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
export const checkIfUserExist = (email,id) => {

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM dadosUsuarios WHERE email=?;",
        [email],

        async (_, { rows }) => {
          if (rows.length <= 0) resolve("Este email é novo")
          else if (rows.length >=0 && rows._array[0].id == id) resolve("Este email é novo")
          else reject("Obj not found: email=" + email)

        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};



export const update = (obj) => {
  return new Promise(async (resolve, reject) => {
    let hashPassword = await serviceAxios.transformToHash(obj.senha).then(result=>result).catch(e=>e)
    console.log(`Hash Password: ${hashPassword} ${typeof(hashPassword)} ${hashPassword.length}`)

    await checkIfUserExist(obj.email,obj.id).then(result => {
      return resolve(
        db.transaction((tx) => {
          
          tx.executeSql(
            "UPDATE dadosUsuarios SET email=?, senha=?, usuario=? WHERE id=?;",
            [obj.email, hashPassword, obj.usuario, obj.id],
            
            (_, { rowsAffected , rows }) => {
              console.log(rowsAffected)
              if (rowsAffected > 0) resolve(rowsAffected);
              else reject("Error updating obj: id=" + obj.id);
            },
            (_, error) => reject(error)
          );
        })
      )
    }).catch(erro => {
      return reject("Email ja existe")
    })

  });
};



// async function trataSenha(senha) {
//   return JWT.decode(senha, key)
// }
export const find = (email, senha) => {

  return new Promise(async (resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM dadosUsuarios WHERE email=?;",
        [email],
        //-----------------------
        async (_, { rows }) => {
          if (rows.length > 0) {
            console.log(`Senha deste usuário: ${rows._array[0].senha}`)
            let verifyPassword = await serviceAxios.compareHash(senha,rows._array[0].senha).then(result=>result).catch(e=>e)
            verifyPassword == true ? resolve(rows._array[0]) : reject("Obj not found: email=" + email)
          }
          else {
            reject("Obj not found: email=" + email)
          };
        },
        (_, error) => reject(error)
      );
    });
  });
};


export const singleUser = (userId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM dadosUsuarios WHERE id = ?;",
        [userId],
        //-----------------------
        (_, { rows }) => {
          if (rows.length > 0) resolve([{ usuario: rows._array[0].usuario, email: rows._array[0].email, id: rows._array[0].id }]);
          else reject("Obj not found: brand=" + brand);
        },
        (_, error) => reject(error)
      );
    });
  });
};


export const all = () => {
  const usersList = []
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM dadosUsuarios;",
        [],

        (_, { rows }) => {
          for (let i = 0; i < rows._array.length; i++) {
            usersList.push({ usuario: rows._array[i].usuario, email: rows._array[i].email, id: rows._array[i].id })
          }

          resolve(usersList)
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
        "DELETE FROM dadosUsuarios WHERE id=?;",
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

export default {
  create,
  update,
  find,
  singleUser,
  all,
  remove,
};