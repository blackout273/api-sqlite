import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import APIservices from "../../functions/axios";

import { find } from "../../functions/database/usuarios";
const serviceAxios = new APIservices();

const Login = ({ navigation }) => {
  const [botao, setBotao] = useState();
  const [email, setEmail] = useState();
  const [senha, setSenha] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingRoot, setLoadingRoot] = useState(false);

  async function validation() {
    if (email && senha) {
      try {
        setLoading(true);
        await find(email, senha)
          .then((userData) => {
            Alert.alert("Bem-Vindo");
            setLoading(false);
            navigation.navigate("MainPage", userData);
          })
          .catch((err) => {
            Alert.alert("Username/Senha errada");
            navigation.navigate("Login");
            setLoading(false);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Preencher todos os campos");
    }
  }
  async function validationRoot() {
    if (email && senha) {
      try {
        setLoadingRoot(true);
        await serviceAxios
          .admLoginAccount(email, senha)
          .then((result) => {
            if (result != false) {
              alert("Bem-Vindo");
              setLoadingRoot(false);
              navigation.navigate("MainPage", result);
            } else {
              alert("Username/Senha errada");
              navigation.navigate("Login");
              setLoadingRoot(false);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Preencher todos os campos");
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
        id="1"
        onChangeText={setEmail}
      ></TextInput>
      <Text>Senha</Text>
      <TextInput
        autoCapitalize="none"
        secureTextEntry={true}
        style={style.input}
        id="3"
        onChangeText={setSenha}
      ></TextInput>
      <TouchableOpacity style={style.btnRoot} onPress={() => validationRoot()}>
        {(loadingRoot && (
          <ActivityIndicator size="small" color="#000000" />
        )) || <Text style={{ color: "black" }}>root</Text>}
      </TouchableOpacity>
      <TouchableOpacity
        style={style.btn}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={{ color: "white" }}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity style={style.btn} onPress={() => validation()}>
        {(loading && <ActivityIndicator size="small" color="#ffffff" />) || (
          <Text style={{ color: "white" }}>Go</Text>
        )}
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
    width: 100,
    padding:10
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

export default Login;
