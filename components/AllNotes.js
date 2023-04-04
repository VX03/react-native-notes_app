import React, { useState, useEffect } from "react";
import {
	ScrollView,
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
	FlatList,
	Alert,
	ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FAB } from "react-native-elements";
import CustomTextInput from "./CustomTextInput";
import { useNavigation } from "@react-navigation/native";
import Note from "./Note";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { retrieveNotes } from "./db";

const AllNotes = () => {
	const [data, setData] = useState([]);
	const [txtInput, setTxtInput] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [note, setNote] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const getData = () => {
		AsyncStorage.getItem("id").then((id) => {
			if (id !== null) {
				retrieveNotes(id, txtInput).then((results) => {
					setData(results);
				});
			}
		});
	};

	useEffect(() => {
		getData();
		setIsLoading(false);
	}, [data]);

	const changeNote = (item) => {
		setNote(item);
	};

	return (
		<View style={styles.container}>
			<Note
				ModalVisible={modalVisible}
				setModalVisible={setModalVisible}
				item={note}
			/>
			<View style={styles.inputContainer}>
				<Text style={styles.title}>All Notes</Text>
				<View style={styles.rowContainer}>
					<CustomTextInput
						input={txtInput}
						setInput={setTxtInput}
						placeholder={"Search"}
						onChangeText={getData}
					/>
					{/* <TouchableOpacity
						style={styles.buttonStyle}
						onPress={onSubmit}
					>
						<Ionicons name="send-outline" size={30}></Ionicons>
					</TouchableOpacity> */}
				</View>
			</View>
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
				<FlatList
					data={data}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={styles.itemStyle}
							onPress={() => {
								changeNote(item);
								setModalVisible(true);
							}}
						>
							<Text style={styles.date}>{item.date_edited}</Text>
							<Text
								style={[styles.title, { marginVertical: 10 }]}
							>
								{item.title}
							</Text>
							<Text
								style={styles.content}
								numberOfLines={5}
								ellipsizeMode="tail"
							>
								{item.content != ""
									? item.content
									: "No content."}
							</Text>
							<Ionicons
								name={"lock-closed"}
								color={"white"}
								size={25}
								style={{
									position: "absolute",
									bottom: 10,
									right: 10,
								}}
							/>
						</TouchableOpacity>
					)}
					style={{ marginBottom: 55 }}
					//Setting the number of column
					numColumns={2}
					keyExtractor={(item, index) => index}
				/>
			)}
		</View>
	);
};

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F7F1F6",
	},
	rowContainer: { flexDirection: "row", width: "100%" },
	inputContainer: {
		backgroundColor: "#CF8BA9",
		marginHorizontal: 5,
		marginBottom: 5,
		marginTop: 40,
		borderRadius: 20,
		padding: 10,
		paddingHorizontal: 20,
	},
	buttonDesign: {
		position: "absolute",
		bottom: 50,
	},
	title: {
		fontSize: 30,
		textAlign: "center",
		color: "white",
	},
	buttonStyle: {
		backgroundColor: "#cec2ff",
		margin: 10,
		padding: 10,
		borderRadius: 10,
	},
	itemStyle: {
		flex: 1,
		flexDirection: "column",
		margin: 1,
		width: 30,
		height: 200,
		backgroundColor: "#5a189a",
		borderRadius: 10,
		margin: 5,
		padding: 10,
	},
	date: {
		color: "white",
		textAlign: "right",
	},
	content: {
		color: "white",
	},
});

export default AllNotes;
