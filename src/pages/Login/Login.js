import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native'

import {find} from '../../functions/database/usuarios'

const Login = ({ navigation }) => {
    const [botao, setBotao] = useState()
    const [email, setEmail] = useState()
    const [senha, setSenha] = useState()

    async function validation() {
        if (email && senha) {
            try {
                await find(email,senha).then(userData => {
                    alert("Bem-Vindo")
                    navigation.navigate("MainPage",userData)
                }).catch(err => {
                    alert("Username/Senha errada")
                    navigation.navigate("Login")
                })
            } catch (error) {
                console.log(error)
            } 
            

        } else {
            alert('Preencher todos os campos')
        }

    }

    return (
        <View style={style.container}>
            <Image style={style.image} source={{ uri: "https://repository-images.githubusercontent.com/78664391/f7e46780-6bf6-11eb-999f-8212c69d76bc" }} />
            <Text>E-mail</Text>
            <TextInput autoCapitalize='none' style={style.input} id="1" onChangeText={setEmail} ></TextInput>
            <Text>Senha</Text>
            <TextInput autoCapitalize='none' secureTextEntry={true} style={style.input} id="3" onChangeText={setSenha}></TextInput>
            <TouchableOpacity style={style.btn} onPress={() => validation()} ><Text style={{ color: "white" }}>Go</Text></TouchableOpacity>
            <TouchableOpacity style={style.btn} onPress={() => navigation.navigate("Register")} ><Text style={{ color: "white" }}>Register</Text></TouchableOpacity>

        </View>

    )
}

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
        width: 100
    },
    input: {
        textAlign: "center",
        width: 100,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "black",
        borderRadius: "5%",
        borderRadius: 10
    },
    image: {
        alignSelf: "center",
        width: 120,
        height: 100
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default Login