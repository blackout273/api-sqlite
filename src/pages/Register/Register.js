import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { create, checkIfUserExist } from "../../functions/database/usuarios";
import JWT from "expo-jwt";
import uuid from "uuid";
key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21lIjoiTHVjYXMgTmFuaWNhIn0.L5_1mxlyOln5fex_zQ65nkLMgD7GF-KMvBwiOwxyGew";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState();
  const [usuario, setUsuario] = useState();
  const [senha1, setSenha1] = useState();
  const [senha2, setSenha2] = useState();
  const [loadingRegister,setLoadingRegister] = useState(false);

  function sanitizeStrings(string) {
    let n = string.search(/^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    if (n == 0) return string;
    return undefined;
  }

  async function validation() {
    try {
        setLoadingRegister(true);
      if (usuario && senha1 && senha2) {
        if (sanitizeStrings(email)) {
          if (senha1 != senha2) {
            Alert.alert("Senhas diferentes");
            setLoadingRegister(false);
          } else {
            await checkIfUserExist(email)
              .then(async () => {
                await create({ email: email, senha: senha1, usuario: usuario })
                  .then((idUser) => {
                    
                    Alert.alert(`Criado email: ${email}  usuario: ${usuario} `);
                    setLoadingRegister(false);
                    navigation.navigate("MainPage", { id: idUser });
                  })
                  .catch((msg) => {
                    console.log(msg);
                    setLoadingRegister(false);
                  });
              })
              .catch((err) => {
                console.log(err);
                Alert.alert(`E-mail já utilizado`);
                setLoadingRegister(false);
                navigation.navigate("Register");
              });
          }
        } else {
          Alert.alert("Insira um e-mail válido");
          setLoadingRegister(false);
        }
      } else {
        Alert.alert("Preencher todos os campos");
        setLoadingRegister(false);
      }
    } catch (error) {
        setLoadingRegister(false);
      throw new Error(`Erro: ${error}`);
    }
  }

  return (
    <View style={style.container}>
      <Image
        style={style.image}
        source={{
          uri: "https://repository-images.githubusercontent.com/78664391/f7e46780-6bf6-11eb-999f-8212c69d76bc",
        }}
      />
      <Text>E-mail</Text>
      <TextInput
        autoCapitalize="none"
        style={style.input}
        onChangeText={setEmail}
      ></TextInput>
      <Text>Usuário</Text>
      <TextInput
        autoCapitalize="none"
        style={style.input}
        onChangeText={setUsuario}
      ></TextInput>
      <Text>Senha</Text>
      <TextInput
        autoCapitalize="none"
        secureTextEntry={true}
        style={style.input}
        onChangeText={setSenha1}
      ></TextInput>
      <Text>Senha</Text>
      <TextInput
        autoCapitalize="none"
        secureTextEntry={true}
        style={style.input}
        onChangeText={setSenha2}
      ></TextInput>
      <TouchableOpacity style={style.btn} onPress={() => validation()}>
        {(loadingRegister && <ActivityIndicator size="small" color="#ffffff"/> || <Text style={{ color: "white" }}>Register</Text> )}
      </TouchableOpacity>
      <TouchableOpacity
        style={style.btn}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={{ color: "white" }}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={style.btnRoot}
        onPress={() => navigation.navigate("RootZone", { Command: true })}
      >
        <Text>
          Conceder Root
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  btn: {
    backgroundColor: "red",
    color: "#FFFFFF",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    marginTop: 20,
    padding:10,
    width: 100,
  },
  btnRoot: {
    backgroundColor: "orange",
    color: "#FFFFFF",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    marginTop: 20,
    width: 100,
    padding:10
  },
  input: {
    textAlign: "center",
    width: 120,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    borderRadius: "5%",
    borderRadius: 10,
    padding:5
  },
  image: {
    alignSelf: "center",
    width: 120,
    height: 100,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Register;
