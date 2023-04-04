import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TextInput, Alert } from "react-native";
import CustomTextInput from "./CustomTextInput";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";

import {
	retrieveAllUsers,
	validateUser,
	deleteUserdb,
	createUserdb,
	deleteNotedb,
	createNotedb,
} from "./db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "./CustomAlert";

const Login = () => {
	const navigation = useNavigation();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isVisble, setIsVisible] = useState("");

    useEffect(()=>{
        deleteNotedb()
        createNotedb()
    })

	_storeData = async (id) => {
		try {
			await AsyncStorage.setItem("id", id.toString());
			//   console.log('setitem')
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<LinearGradient
			colors={["#645CBB", "#A084DC", "#BFACE2", "#EBC7E6"]}
			style={styles.container}
		>
			<CustomAlert
				displayMode={"error"}
				visibility={isVisble}
				dismissAlert={setIsVisible}
                displayMsg={"Login Credentials is wrong..."}
			/>
			<View style={styles.centerView}>
				<Ionicons
					name="book-sharp"
					size={100}
					color={"#c0deff"}
					style={{ marginLeft: "35%" }}
				/>
				<CustomTextInput
					input={username}
					setInput={setUsername}
					placeholder="Username"
					haveLogo={true}
					logoName={"person"}
				/>
				<CustomTextInput
					input={password}
					setInput={setPassword}
					placeholder="Password"
					secureTextEntry={true}
					haveLogo={true}
					logoName={"lock-closed"}
				/>

				<Button
					onPress={() => {
						validateUser(username, password)
							.then((results) => {
								 console.log('r: '+results);
								_storeData(results);
								navigation.navigate("main");
							})
							.catch((error) => {
								// Alert.alert(error);
                                setIsVisible(true)
                            });
					}}
					title="login"
					color={"purple"}
				/>
			</View>
			<TouchableOpacity
				style={styles.toRegister}
				onPress={() => {
					navigation.navigate("register");
				}}
			>
				<Text style={{ color: "red" }}>
					Don't have an account? Register here now!
				</Text>
			</TouchableOpacity>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	centerView: {
		alignContent: "center",
		justifyContent: "center",
		alignSelf: "center",
		flex: 1,
		width: "80%",
	},
	toRegister: {
		alignSelf: "center",
		margin: 14,
	},
});

export default Login;
