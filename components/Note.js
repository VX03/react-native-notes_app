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
import {
	checkNotePassword,
	deleteNote,
	editNote,
	editNotePassword,
} from "./db";
import CustomAlert from "./CustomAlert";

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
	const [locked, setLocked] = useState(false);
	const [editable, setEditable] = useState(false);
	const [password, setPassword] = useState("");
	const [editPassword, setEditPassword] = useState("");
	const [passwordIsVisible, setPasswordIsVisible] = useState(false);
	const [editPasswordIsVisible, setEditPasswordIsVisible] = useState(false);
	const [errorIsVisible, setErrorIsVisible] = useState(false);
	const [alertName, setAlertName] = useState("");
	const [errMsg, setErrMsg] = useState("");
	const [successMsg, setSuccessMsg] = useState("");
	const [successIsVisible, setSuccessIsVisible] = useState(false);

	useEffect(() => {
		if (item) {
			setTitle(item.title);
			setContent(item.content);
			setLastEdit(item.date_edited);
			if (item.password != null && item.password != "") setLocked(true);
			else setLocked(false);
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
				console.log("id: " + id);
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

	const lockOnClick = () => {
		if (locked)
			setAlertName("To remove locked state, type in the password:");
		else setAlertName("Type in the password for the note:");
		setPasswordIsVisible(true);
	};

	const pressOk = () => {
		// setPasswordIsVisible(false)
		if (locked) {
			AsyncStorage.getItem("id").then((id) => {
				checkNotePassword(id, item.title, password)
					.then((results) => {
						editNotePassword(id, item.title, null)
							.then((results) => {
								setPassword("");
								setPasswordIsVisible(false);
								setLocked(false);

								setSuccessMsg("This note is unlocked!");
								setSuccessIsVisible(true);
								console.log(results);
							})
							.catch((error) => {
								console.log(error);
							});
					})
					.catch((error) => {
						setErrMsg("Wrong Password");
						setErrorIsVisible(true);
					});
			});
		} else {
			AsyncStorage.getItem("id").then((id) => {
				if (password != null && password != "") {
					editNotePassword(id, item.title, password)
						.then((results) => {
							setPassword("");
							setLocked(true);
							setPasswordIsVisible(false);
							setSuccessMsg("This note is locked!");
							setSuccessIsVisible(true);
							console.log(results);
						})
						.catch((error) => {
							console.log(error);
						});
				} else {
					setErrMsg("Password must not be empty");
					setErrorIsVisible(true);
				}
			});
		}
	};

	const editPass = () => {
		setEditPasswordIsVisible(true);
	};

	const cancel = () => {
		setPasswordIsVisible(false);
		setPassword("");
	};

	const editPressOk = () => {
		// console.log("HERO")
		AsyncStorage.getItem("id").then((id) => {
			if (editPassword != null && editPassword != "") {
				editNotePassword(id, item.title, editPassword)
					.then((results) => {
						setEditPassword("");
						setLocked(true);
						setEditPasswordIsVisible(false);
						console.log(results);
						setSuccessMsg("Password is edited!");
						setSuccessIsVisible(true);
					})
					.catch((error) => {
						console.log(error);
					});
			} else if (editPassword == null || editPassword == "") {
				setErrMsg("Password must not be empty");
				setErrorIsVisible(true);
			}
		});
	};

	const pressCancel = () => {
		setEditPasswordIsVisible(false);
		setEditPassword("");
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
			<CustomAlert
				displayMode={"password"}
				visibility={passwordIsVisible}
				passwordAlert={pressOk}
				cancelAlert={cancel}
				displayMsg={alertName}
				password={password}
				setPassword={setPassword}
			/>
			<CustomAlert
				displayMode={"password"}
				visibility={editPasswordIsVisible}
				passwordAlert={editPressOk}
				cancelAlert={pressCancel}
				displayMsg={"Edit password"}
				password={editPassword}
				setPassword={setEditPassword}
			/>
			<CustomAlert
				displayMode={"error"}
				visibility={errorIsVisible}
				dismissAlert={setErrorIsVisible}
				displayMsg={errMsg}
			/>
			<CustomAlert
				displayMode={"success"}
				displayMsg={successMsg}
				visibility={successIsVisible}
				dismissAlert={setSuccessIsVisible}
			/>
			<ScrollView style={styles.container}>
				<View style={{ flexDirection: "row", marginBottom: 10 }}>
					<TouchableOpacity onPress={() => setModalVisible(false)}>
						<Ionicons name="close-circle-outline" size={35} />
					</TouchableOpacity>
					<TouchableOpacity
						style={{ position: "absolute", right: 50 }}
						onPress={lockOnClick}
					>
						<Ionicons
							name={
								locked
									? "lock-closed-outline"
									: "lock-open-outline"
							}
							size={35}
							color={"grey"}
						/>
					</TouchableOpacity>
					{locked ? (
						<TouchableOpacity
							onPress={editPass}
							style={{ position: "absolute", right: 100 }}
						>
							<Ionicons
								name="key-outline"
								size={35}
								color={"grey"}
							/>
						</TouchableOpacity>
					) : (
						<></>
					)}
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
