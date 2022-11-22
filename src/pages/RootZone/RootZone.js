import React, { useEffect, useState } from "react";
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
import { all } from "../../functions/database/usuarios";
import {
  allAdmins,
  removeAllAdmins,
  addToAdminList,
  checkIfIsAdmin,
  removeAdminList,
} from "../../functions/database/administradores";
const RootZone = ({ navigation, route }) => {
  const [fetchData, setFetchData] = useState([]);
  const [apertouBotao, setApertouBotao] = useState(false);
  const [colorBackground, setColorBackGround] = useState("#ffffff");

  async function listAll() {
    let usersList = await all();
    setFetchData(usersList);
  }
  useEffect(() => {
    listAll();
  }, []);

  function renderItem(navigation, item) {
    return (
      <TouchableOpacity
        onPress={async () => {
          await checkIfIsAdmin(item.email)
            .then(async (result) => {
              setColorBackGround({ ...colorBackground, [item.id]: true });
              await removeAdminList(result);
              console.log(item.email, "Não é mais admin");
            })
            .catch(async (err) => {
              setColorBackGround(!{ ...colorBackground, [item.id]: true });
              await addToAdminList(item.email);
              console.log(item.email, "agora é ADMIN! ");
            });
        }}
      >
        <View
          style={{
            backgroundColor: colorBackground.hasOwnProperty(item.id)? "#808080": "#ffffff",
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
export default RootZone;
