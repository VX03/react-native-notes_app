import React, { useState } from "react";
import {
	View,
	StyleSheet,
	Button,
	TouchableOpacity,
	Text,
	Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import CustomTextInput from "./CustomTextInput";
import CustomAlert from "./CustomAlert";
import { insertUser } from "./db.js";
import { useEffect } from "react";

const Register = () => {
	const navigation = useNavigation();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [address, setAddress] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");

	const [showRegisterSuccessPopup, setShowRegisterSuccessPopup] =
		useState(false);
	const [showRegisterErrPopup, setShowRegisterErrPopup] = useState(false);
	const [errMsg, setErrMsg] = useState("");

	const checkEmail = (email) => {
		var re = /\S+@\S+\.\S+/;
		return re.test(email);
	};
	function checkPhone(phone) {
		return /^[0-9]{8}$/.test(phone) || phone == "";
	}
	const btnOnClick = () => {
		console.log(checkPhone(phone));
		if (
			checkEmail(email) &&
			checkPhone(phone) &&
			username != "" &&
			email != "" &&
			password != ""
		) {
			insertUser(username, password, phone, address, email)
				.then((result) => {
					setShowRegisterSuccessPopup(true);
					//navigation.navigate("login");
					setUsername("");
					setAddress("");
					setEmail("");
					setPhone("");
					setPassword("");
				})
				.catch((error) => {
					setShowRegisterErrPopup(true);
					setErrMsg(error);
					//Alert.alert(error);
				});
		} else if (username == "") {
			setShowRegisterErrPopup(true);
			setErrMsg("Username must be filled");
		} else if (email == "") {
			setShowRegisterErrPopup(true);
			setErrMsg("Email must be filled");
		} else if (password != "") {
			setShowRegisterErrPopup(true);
			setErrMsg("Password must be filled");
		} else if (!checkPhone(phone)) {
			setShowRegisterErrPopup(true);
			setErrMsg("Phone number must only contain 8 numbers");
		} else if (!checkEmail(email)) {
			setShowRegisterErrPopup(true);
			setErrMsg("Email is not correct");
		}
	};

	return (
		<LinearGradient
			colors={["#645CBB", "#A084DC", "#BFACE2", "#EBC7E6"]}
			style={styles.container}
		>
			<CustomAlert
				displayMode={"success"}
				displayMsg={"Register successful!!!"}
				visibility={showRegisterSuccessPopup}
				dismissAlert={setShowRegisterSuccessPopup}
			/>
			<CustomAlert
				displayMode={"failed"}
				displayMsg={errMsg}
				visibility={showRegisterErrPopup}
				dismissAlert={setShowRegisterErrPopup}
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
					input={email}
					setInput={setEmail}
					placeholder="Email Address"
					haveLogo={true}
					logoName={"mail"}
				/>
				<CustomTextInput
					input={phone}
					setInput={setPhone}
					placeholder="Phone"
					haveLogo={true}
					logoName={"call"}
					keyboardType={"number-pad"}
				/>
				<CustomTextInput
					input={address}
					setInput={setAddress}
					placeholder="Address"
					haveLogo={true}
					logoName={"location"}
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
					onPress={btnOnClick}
					title="Register"
					color={"purple"}
				/>
			</View>
			<TouchableOpacity
				style={styles.toRegister}
				onPress={() => {
					navigation.navigate("login");
				}}
			>
				<Text style={{ color: "red" }}>
					Have an account? Login Here!
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
export default Register;
