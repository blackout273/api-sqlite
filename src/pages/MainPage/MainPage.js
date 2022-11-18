
import React, { useEffect, useState } from 'react'
import { Text, View, Button, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'

import {find,create} from '../../functions/database/administradores'
import {all,singleUser} from '../../functions/database/usuarios'

const MainPage = ({ navigation, route }) => {
    const [fetchData, setFetchData] = useState([]);
    async function showAllUsers() {
        console.log(route.params)
        if (route.params.email == "superuser@teste.com"){
            await find(route.params.email).then(async (result)=>{
                console.log('Esse usuário ADMIN ja existe MAN')

    
            }).catch(async ()=>{
                await create(route.params.email)
                console.log(`Criou um USUARIO ADM para ${route.params.email}`)

            })
            
        }
        await find(route.params.email).then(async (result)=>{
            console.log('bem vindo super usuario')
            let usersList = await all()
            setFetchData(usersList)

        }).catch(async ()=>{
            let usersList = await singleUser(route.params.id)
            setFetchData(usersList)
        })
        
    }
    function isAdmin(){
        return true
    }
    function renderItem(navigation,item){
        if(isAdmin()) return <TouchableOpacity onPress={()=>navigation.navigate('SingleItem',{selectedUser:item,adminData:route.params})} ><Text style={style.items}>{item.usuario}</Text></TouchableOpacity>
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