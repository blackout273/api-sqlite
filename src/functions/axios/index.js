const axios = require('axios')



class APIservices {
  constructor() {
    axios.create({
      baseURL: "http://localhost:3000/",
      headers: "application/json"
    })
  }
 
  async transformToHash(userPassword){
    var data = JSON.stringify({
      "userPassword": userPassword
    });
  
    var config = {
      method: 'post',
      url: 'https://api-encrypt-three.vercel.app',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*'
    },
      data : data
    };
  
    return axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      return response.data
    })
    .catch(function (error) {
      console.log(error);
      return error
    });
    // return await axios.post("http://localhost:3000/",{headers:"application/json"},{
    //   "userPassword":`${JSON.stringify(userPassword)}`
    // })
  }
  compareHash(userPassword,passwordFromDB){
    var data = JSON.stringify({
      "userPassword": userPassword,
      "hash": passwordFromDB
    });
    
    var config = {
      method: 'post',
      url: 'https://api-encrypt-three.vercel.app/compare',
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*'
      },
      data : data
    };
    
    return axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      return response.data
    })
    .catch(function (error) {
      // console.log(error);
      return error
    });
    

  }
}
module.exports = APIservices