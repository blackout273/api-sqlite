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
      email: admEmail,
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
        if (!!response.data["Message"]) return false;
        return true;
      })
      .catch(() => false);
  }
  async admCreateAdminAccount(admEmail) {
    var data = JSON.stringify({
      email: admEmail,
    });

    var config = {
      method: "post",
      url: "https://api-admin-manager.herokuapp.com/criar-admin",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => error);
  }
}
module.exports = APIservices;
