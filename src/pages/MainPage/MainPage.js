
import React, { useEffect, useState } from 'react'
import { Text, View, Button, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'

import {all} from '../../functions/database/usuarios'
const MainPage = ({ navigation }) => {
    const [fetchData, setFetchData] = useState([]);
    async function showAllUsers() {
        let usersList = await all()
        setFetchData(usersList)
    }

    function renderItem(navigation,item){
        return <TouchableOpacity onPress={()=>navigation.navigate('SingleItem',item)} ><Text style={style.items}>{item.usuario}</Text></TouchableOpacity>
    }
    return (
        <View>
            <Button onPress={() => showAllUsers()} title="Listar/Atualizar usuários Cadastrados Na Base"></Button>
            {fetchData.length>0 && 
             <FlatList  data={fetchData} keyExtractor={(item)=>item.id} renderItem={({item})=>renderItem(navigation,item) } ></FlatList>
             }
        </View>
    )
}

const style = StyleSheet.create({
    
    items:{
        marginTop:10,
        width:100,
        alignSelf:"center",
        textAlign:"center",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "grey",
    }
})
export default MainPage