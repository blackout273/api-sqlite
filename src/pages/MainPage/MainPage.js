import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Button,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { find, create } from "../../functions/database/administradores";
import { all, singleUser } from "../../functions/database/usuarios";
import APIservices from "../../functions/axios/index.js";

const serviceAxios = new APIservices();

const MainPage = ({ navigation, route }) => {
  const [fetchData, setFetchData] = useState([]);
  async function showAllUsers() {
    // console.log(await serviceAxios.admVerifyAccount(route.params.email))

    if (await serviceAxios.admVerifyAccount(route.params.email)) {
      let usersList = await all();
      setFetchData(usersList);
    } else {
      let usersList = await singleUser(route.params.id);
      setFetchData(usersList);
    }
  }
  async function isAdmin() {
    if (await serviceAxios.admVerifyAccount(route.params.email)) return true;
    else {
      return false;
    }
  }
  function renderItem(navigation, item) {
    if (isAdmin())
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("SingleItem", {
              selectedUser: item,
              adminData: route.params,
            })
          }
        >
          <Text style={style.items}>{item.usuario}</Text>
        </TouchableOpacity>
      );
    return (
      <TouchableOpacity onPress={() => navigation.navigate("SingleItem", item)}>
        <Text style={style.items}>{item.usuario}</Text>
      </TouchableOpacity>
    );
  }
  return (
    <View>
      <Button
        onPress={() => showAllUsers()}
        title="Listar/Atualizar usuários Cadastrados Na Base"
      ></Button>
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
