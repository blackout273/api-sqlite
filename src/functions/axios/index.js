const axios = require("axios");

class APIservices {
  constructor() {
    axios.create({
      baseURL: "http://localhost:3000/",
      headers: "application/json",
    });
  }

  async transformToHash(userPassword) {
    var data = JSON.stringify({
      userPassword: userPassword,
    });

    var config = {
      method: "post",
      url: "https://api-encrypt-three.vercel.app",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "*",
      },
      data: data,
    };

    return axios(config)
      .then((response) => response.data)
      .catch((error) => error);
  }

  compareHash(userPassword, passwordFromDB) {
    var data = JSON.stringify({
      userPassword: userPassword,
      hash: passwordFromDB,
    });

    var config = {
      method: "post",
      url: "https://api-encrypt-three.vercel.app/compare",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "*",
      },
      data: data,
    };

    return axios(config)
      .then((response) => response.data)
      .catch((error) => error);
  }

  async admVerifyAccount(admEmail) {
    var data = JSON.stringify({
      emailRoot: admEmail,
    });

    var config = {
      method: "post",
      url: "https://api-admin-manager.herokuapp.com/verificar-admin",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    return axios(config)
      .then((response) => {
        // console.log("API RESULT",response.data)
        if (!!response.data["Message"]) {
          return false;
        } else {
          return true;
        }
      })
      .catch(() => false);
  }
  async admLoginAccount(admEmail, admSenha) {
    var data = JSON.stringify({
      emailRoot: admEmail,
    });

    var config = {
      method: "post",
      url: "https://api-admin-manager.herokuapp.com/login-admin",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    return axios(config)
      .then(async (response) => {
        if (await this.compareHash(admSenha, response.data.senha)) {
          return response.data;
        } else {
          return false;
        }
      })
      .catch((error) => error);
  }
}
module.exports = APIservices;
