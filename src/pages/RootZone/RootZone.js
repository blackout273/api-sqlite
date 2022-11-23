import React, { useEffect, useState, setState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from "react-native";
import { all ,updateAdminState } from "../../functions/database/usuarios";
import {
  allAdmins,
  removeAllAdmins,
  addToAdminList,
  checkIfIsAdmin,
  removeAdminList,
} from "../../functions/database/administradores";

const RootZone = ({ navigation, route }) => {
  const [fetchData, setFetchData] = useState([]);
  const [fetchDataAdmin, setFetchDataAdmin] = useState([]);
  const [state, setState] = useState(false);

  async function listAll() {
    let usersList = await all();
    let commomList=[]
    let admList=[]
    for(let i = 0; i<usersList.length; i++){
      if(usersList[i].isAdmin) admList.push(usersList[i])
      else{commomList.push(usersList[i])}
    }
    console.log("commomList",commomList)
    console.log("admList",admList)
    setFetchData(commomList)
    setFetchDataAdmin(admList)
    // if(usersList.isAdmin) setFetchData(usersList)
    // else{setFetchDataAdmin(usersList)}
  }
  useEffect(() => {
    listAll();
  }, []);

  function renderItem(navigation, item) {
      return (
        <TouchableOpacity
          onPress={async () => {
            await updateAdminState({isAdmin:1,id:item.id}).then(result=>result).catch(err=>err)
            listAll()

          }}
        >
          <View
            style={{
              backgroundColor: "#ffffff",
              marginTop: 10,
              width: 100,
              alignSelf: "center",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "grey",
            }}
          >
            <Text
              style={{
                textAlign: "center",
              }}
            >
              {item.usuario}
            </Text>
          </View>
        </TouchableOpacity>
      );
  }

  function renderItem2(navigation, item) {
    return (
      <TouchableOpacity
        onPress={async () => {
          console.log(item)
          await updateAdminState({isAdmin:0,id:item.id}).then(result=>result).catch(err=>err)
          listAll()
        }}
      >
        <View
          style={{
            backgroundColor: "#ffffff", //colorBackground.hasOwnProperty(item.id)? "#808080":
            marginTop: 10,
            width: 100,
            alignSelf: "center",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "grey",
          }}
        >
          <Text
            style={{
              textAlign: "center",
            }}
          >
            {item.usuario}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View>
      <Text style={style.textLabel}>Usuários</Text>
      {fetchData.length > 0 && (
        <FlatList
          data={fetchData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderItem(navigation, item)}
        ></FlatList>
      )}
      <Text style={style.textLabel}>Usuários Administrativos</Text>
      {fetchDataAdmin.length > 0 && (
        <FlatList
          data={fetchDataAdmin}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderItem2(navigation, item)}
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
  textLabel:{
    textAlign:"center",
    marginTop:"3%",
    backgroundColor:"#909090",
    color:"#fff",
    borderRadius:10
  }
});
export default RootZone;
