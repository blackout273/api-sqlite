import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Modal,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { remove, update , find } from "../../functions/database/usuarios";

import JWT from "expo-jwt";
key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21lIjoiTHVjYXMgTmFuaWNhIn0.L5_1mxlyOln5fex_zQ65nkLMgD7GF-KMvBwiOwxyGew";

const SingleItem = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState();
  const [usuario, setUsuario] = useState();
  const [senha1, setSenha1] = useState();
  const [senha2, setSenha2] = useState();
  const [loading,setLoading] = useState(false);

  async function removerUsuario(userID) {
    await remove(userID)
      .then((result) => {
        Alert.alert("Usuário Excluído com sucesso.");
        if (route.params.adminData) navigation.navigate("MainPage", route.params) 
        else navigation.navigate("Login");
      })
      .catch(() => {
        Alert.alert("Erro ao tentar remover usuario.");
        navigation.navigate("MainPage",route.params);
      });
  }

  function sanitizeStrings(string) {
    let n = string.search(/^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    if (n == 0) return string;
    return undefined;
  }

  async function atualizar(userID) {
    try {
      setLoading(true);
      if ((usuario || route.params.selectedUser.usuario) && (senha1 && senha2)) {
        if (sanitizeStrings(email || route.params.selectedUser.email)) {
          if (senha1 != senha2) {
            Alert.alert("Senhas diferentes");
            setLoading(false);
          } else {
            // const token = JWT.encode({ password: senha1 }, key)
            let obj = {
              email: email || route.params.selectedUser.email,
              senha: senha1,
              usuario: usuario || route.params.selectedUser.usuario,
              id: userID,
            };
            await update(obj)
              .then(async () => {
                alert("Usuario Atualizado com sucesso");
                await find(obj.email,obj.senha).then(userData=>{
                  if (route.params.adminData) {
                    setLoading(false);
                    navigation.navigate("MainPage", route.params.adminData )
                  }
                  else {
                    setLoading(false);
                    navigation.navigate("MainPage", userData )
                  };
                }).catch(err=>{
                  console.log(err)
                  setLoading(false);
                })

              })
              .catch((err) => {
                console.log("ResultErr",err)
                alert("E-mail já utilizado");
                setLoading(false);
                navigation.navigate("MainPage", route.params.adminData || route.params.selectedUser );
              });
          }
        } else {
          Alert.alert("Insira um e-mail válido");
          setLoading(false);
        }
      } else {
        Alert.alert("Campo Senha em branco.");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      throw new Error(`Erro: ${error}`);
    }
  }

  return (
    <View>
      <View>
        <Text style={styles.textStyle}>
          Alterar ou Remover Usuário {route.params.selectedUser.usuario} ?
        </Text>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>E-mail</Text>
            <TextInput
              autoCapitalize="none"
              style={styles.input}
              onChangeText={setEmail}
              placeholder={route.params.selectedUser.email}
            ></TextInput>
            <Text>Usuário</Text>
            <TextInput
              autoCapitalize="none"
              style={styles.input}
              onChangeText={setUsuario}
              placeholder={route.params.selectedUser.usuario}
            ></TextInput>
            <Text>Senha</Text>
            <TextInput
              autoCapitalize="none"
              secureTextEntry={true}
              style={styles.input}
              onChangeText={setSenha1}
            ></TextInput>
            <Text>Senha</Text>
            <TextInput
              autoCapitalize="none"
              secureTextEntry={true}
              style={styles.input}
              onChangeText={setSenha2}
            ></TextInput>
            <TouchableOpacity
              onPress={() => atualizar(route.params.selectedUser.id)}
            >
              {(loading && <ActivityIndicator style={styles.btn2} size="small" color="#000000"  /> || <Text style={styles.btn2}>Atualizar</Text>)}
              
            </TouchableOpacity>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.buttonTextStyle}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Atualizar</Text>
      </Pressable>

      <View style={[styles.button2, styles.buttonOpen2]}>
        <TouchableOpacity
          onPress={() => removerUsuario(route.params.selectedUser.id)}
        >
          <Text style={styles.textStyle}>Excluir Usuário</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => atualizar(route.params.selectedUser.id)} ><Text style={styles.btn2}>Atualizar</Text></TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    textAlign: "center",
    width: 100,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    borderRadius: "5%",
    borderRadius: 10,
  },
  btn1: {
    color: "red",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
  },
  btn2: {
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    color: "black",
    borderStyle: "solid",
    borderColor: "red",
  },
  btns: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderStyle: "solid",
    border: "black",
    elevation: 2,
  },
  button2: {
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#FCDDBC",
  },
  buttonOpen2: {
    backgroundColor: "#D9DBBC",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  buttonTextStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default SingleItem;
