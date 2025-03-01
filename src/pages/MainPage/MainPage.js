import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Button,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { all, singleUser } from "../../functions/database/usuarios";
import APIservices from "../../functions/axios/index.js";

const serviceAxios = new APIservices();

const MainPage = ({ navigation, route }) => {

  const [fetchData, setFetchData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);


  async function showAllUsers() {
    setLoading(true);
    if (route.params.isAdmin){
      let usersList = await all();
      setFetchData(usersList);
      setIsAdmin(true);
      setLoading(false);
    }
    else if(await serviceAxios.admVerifyAccount(route.params.emailRoot)) {
      let usersList = await all();
      setFetchData(usersList);
      setIsAdmin(true)
      setLoading(false);
    }
    else {
      let usersList = await singleUser(route.params.id);
      setFetchData(usersList);
      setIsAdmin(false)
      setLoading(false);
    }
  }

  function renderItem(navigation, item) {
    if (isAdmin) {
      if (item.usuario != route.params.usuario) {
        return (
          <TouchableOpacity
            onPress={() =>{
              navigation.navigate("SingleItem", {
                selectedUser: item,
                adminData: route.params
              })
              setFetchData([])
            } 
            
            }
          >
            <Text style={style.items}>{item.usuario}</Text>
          </TouchableOpacity>
        );
      }
    } else {
      return (
        <TouchableOpacity
          onPress={() =>{
            navigation.navigate("SingleItem", {
              selectedUser: item
            })
            setFetchData([])
          }
          }
        >
          <Text style={style.items}>{item.usuario}</Text>
        </TouchableOpacity>
      );
    }
  }
  return (
    <View>
      <Button
        onPress={() => showAllUsers()}
        title="Listar/Atualizar usuários Cadastrados Na Base"
      ></Button>
      {loading && <ActivityIndicator size="large" color="#00ff00" />}
      {fetchData.length > 0 && (
        <FlatList
          data={fetchData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderItem(navigation, item)}
        ></FlatList>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  items: {
    marginTop: 10,
    width: 100,
    alignSelf: "center",
    textAlign: "center",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "grey",
  },
});
export default MainPage;
