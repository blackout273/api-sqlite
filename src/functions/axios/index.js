const axios = require('axios')



class GraphqlService {
  constructor() {
    axios.create({
      baseURL: "http://localhost:3000/",
      headers: "application/json"
    })
  }

  async getAllUsers(){
    return await axios.post("http://localhost:3000/", {
      "query": `query{
        consultaUsuarios {
          nome
        }
      }`}).then(({data})=>{
        const usuarios = data.data.consultaUsuarios
        return usuarios
      }).catch(err => {
        console.log(err)
      })
  }

  async checkUser(email) {
   return await axios.post("http://localhost:3000/", {
      "query": `query{
        consultaUsuario(input: {email:${JSON.stringify(email)}}) {
          nome
        }
      }`}).then(({data}) => {
        if (data.data.consultaUsuario!=null){
          const {nome} = data.data.consultaUsuario
          console.log(nome)
          return nome
        }
      }).catch(err => {
        console.log(err)
      })

  }

  post(email, usuario, senha) {
    console.log('request start')
    const post = axios.post("http://localhost:3000/", {
      "query": `mutation{
      createUser(input:{email:${email},usuario:${usuario},senha:${senha}}){
        result
      }
    }`})
    console.log('request end')
    return post
  }
}
module.exports = GraphqlService