import db from "./sqliteDatabase.js";
import JWT from 'expo-jwt'
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21lIjoiTHVjYXMgTmFuaWNhIn0.L5_1mxlyOln5fex_zQ65nkLMgD7GF-KMvBwiOwxyGew"
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
    await checkIfUserExist(obj.email).then(result => {

      return resolve(
        db.transaction((tx) => {

          tx.executeSql(
            "INSERT INTO dadosUsuarios (email, senha, usuario) values (?, ?, ?);",
            [obj.email, obj.senha, obj.usuario],
            //-----------------------
            (_, { rowsAffected, insertId }) => {
              if (rowsAffected > 0) resolve(insertId);
              else reject("Error inserting obj: " + JSON.stringify(obj)); // insert falhou
            },
            (_, error) => reject(error) // erro interno em tx.executeSql
          );
        }))
    }).catch(erro => {
      return reject("catch")
    })

  });

};
export const checkIfUserExist = (email) => {

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM dadosUsuarios WHERE email=?;",
        [email],

        async (_, { rows }) => {

          if (rows.length <= 0) resolve("Este email é novo")
          else reject("Obj not found: email=" + email)
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};



export const update = (id, obj) => {
  return new Promise(async (resolve, reject) => {
    await checkIfUserExist(obj.email).then(result => {
      return resolve(
        db.transaction((tx) => {
          
          tx.executeSql(
            "UPDATE dadosUsuarios SET email=?, senha=?, usuario=? WHERE id=?;",
            [obj.email, obj.senha, obj.usuario, id],
            
            (_, { rowsAffected }) => {
              if (rowsAffected > 0) resolve(rowsAffected);
              else reject("Error updating obj: id=" + id);
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



async function trataSenha(senha) {
  return JWT.decode(senha, key)
}
export const find = (email, senha) => {

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM dadosUsuarios WHERE email=?;",
        [email],
        //-----------------------
        async (_, { rows }) => {
          if (rows.length > 0) {
            const senhaJWT = await trataSenha(rows._array[0].senha)
            senhaJWT.password == senha ? resolve(rows._array[0]) : reject("Obj not found: email=" + email)
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


const findByBrand = (brand) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM cars WHERE brand LIKE ?;",
        [brand],
        //-----------------------
        (_, { rows }) => {
          if (rows.length > 0) resolve(rows._array);
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
  findByBrand,
  all,
  remove,
};