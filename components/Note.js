import React, { useState, useEffect } from "react";
import {
	View,
	ScrollView,
	StyleSheet,
	Text,
	Modal,
	TouchableOpacity,
} from "react-native";
import NoteForm from "./NoteForm";
import { FAB } from "react-native-elements";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteNote, editNote } from "./db";
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

const Note = ({ ModalVisible, setModalVisible, item }) => {
	const [title, setTitle] = useState(null);
	const [content, setContent] = useState(null);
	const [lastEdited, setLastEdit] = useState(null);

	const [editable, setEditable] = useState(false);

	useEffect(() => {
		if (item) {
			setTitle(item.title);
			setContent(item.content);
			setLastEdit(item.date_edited);
		}
	}, [item]);

	const changeEditable = () => {
		if (editable && (title !== item.title || content !== item.content)) {
			const date = new Date();

			let day = date.getDate();
			let month = date.getMonth() + 1;
			let year = date.getFullYear();

			// This arrangement can be altered based on how we want the date's format to appear.
			let currentDate = `${day}/${month}/${year}`;
			setLastEdit(currentDate);

			AsyncStorage.getItem("id").then((id) => {
				editNote(id, title, item.title, content, currentDate)
					.then((results) => {
						console.log(results);
					})
					.catch((error) => {
						console.log(error);
					});
			});
		}

		setEditable(!editable);
	};

	const trashOnClick = () => {
		AsyncStorage.getItem("id").then((id) => {
            if (id != null) {
                console.log("id: "+id)
				deleteNote(id, title)
					.then((results) => {
						console.log(results);
						setModalVisible(false);
					})
					.catch((error) => {
						console.log(error);
					});
			}
		});
	};
	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={ModalVisible}
			onRequestClose={() => {
				Alert.alert("Modal has been closed.");
				setModalVisible(!ModalVisible);
			}}
		>
			<ScrollView style={styles.container}>
				<View style={{ flexDirection: "row", marginBottom: 10 }}>
					<TouchableOpacity onPress={() => setModalVisible(false)}>
						<Ionicons name="close-circle-outline" size={35} />
					</TouchableOpacity>

					<TouchableOpacity
						onPress={trashOnClick}
						style={{ position: "absolute", right: 0 }}
					>
						<Ionicons
							name="trash-outline"
							size={35}
							color={"red"}
						/>
					</TouchableOpacity>
				</View>
				<Text style={styles.date}>{lastEdited}</Text>
				<View style={styles.noteform}>
					<NoteForm
						title={title}
						content={content}
						titleOnchange={setTitle}
						contentOnchange={setContent}
						editable={editable}
					/>
				</View>
				<FloatingBtn editable={editable} fn={changeEditable} />
			</ScrollView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F7F1F6",
		padding: 25,
		width: "100%",
		height: "100%",
	},
	noteform: { marginBottom: 90 },
	buttonDesign: { position: "absolute", bottom: 15 },
	date: { textAlign: "right", color: "grey" },
});

export default Note;
