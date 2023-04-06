import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, ActivityIndicator,Button } from "react-native";
import { FAB } from "react-native-elements";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { retrieveUser, editUser } from "./db";

import * as ImagePicker from "expo-image-picker";

const FloatingBtn = ({ editable, fn }) => {
	return (
		<FAB
			style={styles.buttonDesign}
			icon={(props) => (
				<Ionicons
					name={!editable ? "create-outline" : "checkmark-outline"}
					size={24}
					color={"white"}
				/>
			)}
			placement={"right"}
			onPress={fn}
		/>
	);
};

const TxtFieldWithLogo = ({ editable, value, fn, logoname, isNumberOnly }) => {
	const [onFocus, setOnFocus] = useState(false);

	useEffect(() => {});

	return (
		<View
			style={[
				styles.rowContainer,
				{
					borderBottomColor: editable
						? onFocus
							? "blue"
							: "grey"
						: "transparent",
					borderBottomWidth: 1,
				},
			]}
		>
			<Ionicons
				name={logoname}
				size={30}
				color={onFocus ? "blue" : "grey"}
			/>
			{isNumberOnly ? (
				<TextInput
					editable={editable}
					value={value}
					onChangeText={(txt) => fn(txt)}
					style={[styles.txt]}
					multiline={true}
					keyboardType={"number-pad"}
					onFocus={() => setOnFocus(true)}
					onBlur={() => setOnFocus(false)}
				/>
			) : (
				<TextInput
					editable={editable}
					value={value}
					onChangeText={(txt) => fn(txt)}
					style={[styles.txt]}
					multiline={true}
					onFocus={() => setOnFocus(true)}
					onBlur={() => setOnFocus(false)}
				/>
			)}
		</View>
	);
};

const Profile = () => {
	const navigation = useNavigation();
	const [results, setResults] = useState(null);
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [email, setEmail] = useState("");
	const [editable, setEditable] = useState(false);

	const [onFocusName, setOnFocusName] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const [image, setImage] = useState(null);
	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};
	_retrieveDataSetData = () => {
		try {
			AsyncStorage.getItem("id").then((data) => {
				if (data !== null) {
					// We have data!!
					retrieveUser(data).then((results) => {
						// console.log(results)
						changeName(results.username);
						changeAddress(results.address);
						changePhone(results.phone);
						changeEmail(results.email);
						setResults(results);
						setIsLoading(false);
					});
				}
			});
		} catch (error) {
			// Error retrieving data
		}
	};

	_retrieveDataEditData = () => {
		try {
			AsyncStorage.getItem("id").then((data) => {
				if (data !== null && results) {
					// We have data!!
					editUser(data, name, phone, address, email)
						.then((results) => {
							console.log(results);
							// changeName(results.username);
							// changeAddress(results.address);
							// changePhone(results.phone);
							// changeEmail(results.email);
						})
						.catch((error) => {
							console.log(error);
						});
				}
			});
		} catch (error) {
			// Error retrieving data
		}
	};

	useEffect(() => {
		_retrieveDataSetData();
	}, []);

	useEffect(() => {
		if (!editable) {
			//editUser()
			_retrieveDataEditData();
		}
	}, [editable]);
	const changeName = (txt) => {
		setName(txt);
	};

	const changePhone = (txt) => {
		setPhone(txt);
	};

	const changeAddress = (txt) => {
		setAddress(txt);
	};

	const changeEmail = (txt) => {
		setEmail(txt);
	};

	const changeEditable = () => {
		setEditable(!editable);
	};

	return (
		<View
			style={styles.container}
			resetScrollToCoords={{ x: 0, y: 0 }}
			scrollEnabled={true}
		>
			{isLoading ? (
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<ActivityIndicator size="large" color="purple" />
				</View>
			) : (
				<>
					<LinearGradient
						colors={["#e0aaff", "#9d4edd", "#5a189a"]}
						style={styles.topContainer}
					>
						<TouchableOpacity
							style={styles.logout}
							onPress={() => {
								navigation.navigate("login");
								AsyncStorage.clear();
							}}
						>
							<Ionicons
								name={"log-out-outline"}
								size={35}
								color={"red"}
							/>
						</TouchableOpacity>
						<View style={styles.subTopContainer}>
                            <TouchableOpacity onPress={pickImage}>
							<Image
								source={
									image
										? { uri: image }
										: require("../images/profile.jpg")
								}
								style={styles.imgStyle}

							/>
                            </TouchableOpacity>

			
							<View
								style={{
									borderBottomColor: editable
										? onFocusName
											? "blue"
											: "white"
										: "transparent",
									borderBottomWidth: 1,
									width: "70%",
									marginHorizontal: 10,
								}}
							>
								<TextInput
									autoCorrect={false}
									editable={editable}
									value={name}
									underlineColorAndroid="transparent"
									multiline={true}
									placeholder={"Input your name..."}
									placeholderTextColor={"grey"}
									onChangeText={(txt) => changeName(txt)}
									onBlur={() => setOnFocusName(false)}
									onFocus={() => setOnFocusName(true)}
									style={[
										styles.whiteTextStyle,
										styles.title,
										{ textAlign: "center" },
									]}
								/>
							</View>
						</View>
					</LinearGradient>
					<View style={styles.middleContainer}>
						<TxtFieldWithLogo
							editable={editable}
							value={address}
							fn={changeAddress}
							logoname={"location-outline"}
							placeholder={"Address"}
						/>
						<TxtFieldWithLogo
							editable={editable}
							value={email}
							fn={changeEmail}
							logoname={"mail-outline"}
							placeholder={"Email"}
						/>
						<TxtFieldWithLogo
							editable={editable}
							value={phone}
							fn={changePhone}
							logoname={"call-outline"}
							isNumberOnly={true}
							placeholder={"Phone No."}
						/>
					</View>
					<FloatingBtn editable={editable} fn={changeEditable} />
				</>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#F7F1F6" },
	topContainer: {
		height: "45%",
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
		elevation: 10,
	},
	subTopContainer: {
		justifyContent: "center",
		alignItems: "center",
		height: "60%",
	},
	rowContainer: {
		flexDirection: "row",
		marginVertical: 15,
		paddingBottom: 10,
	},
	buttonDesign: {
		position: "absolute",
		bottom: 50,
	},
	imgStyle: {
		width: 150,
		height: 150,
		borderRadius: 100,
	},
	whiteTextStyle: {
		color: "white",
		paddingTop: 5,
		paddingBottom: 10,
	},
	title: {
		fontSize: 30,
	},
	txt: {
		fontSize: 20,
		paddingHorizontal: 10,
		color: "black",
	},
	middleContainer: {
		marginHorizontal: 40,
		marginVertical: 20,
		height: 350,
	},
	logout: {
		justifyContent: "center",
		alignItems: "flex-end",
		margin: 25,
	},
});

export default Profile;
