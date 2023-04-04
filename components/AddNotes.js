import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	Modal,
	TouchableOpacity,
	Alert,
} from "react-native";
import NoteForm from "./NoteForm";
import { insertNote } from "./db";
import CustomAlert from "./CustomAlert";
const AddNotes = ({ pressTrash, setPressTrash, applyLock, setApplyLock }) => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const [successIsVisible, setSuccessIsVisible] = useState(false);
	const [ErrorIsVisible, setErrorIsVisible] = useState(false);
	const [passwordIsVisible, setPasswordIsVisible] = useState(false);

	const [password, setPassword] = useState(null);

	const [errMsg, setErrMsg] = useState("");
	useEffect(() => {
		if (pressTrash) {
			setTitle("");
			setContent("");
			setPressTrash(false);
			setApplyLock(false);
		}
	}, [pressTrash]);

	useEffect(() => {
		if (applyLock) {
			setPasswordIsVisible(true);
		}
	}, [applyLock]);

	const onPressBtn = () => {
		AsyncStorage.getItem("id").then((data) => {
			if (data != null && title != "") {
				const date = new Date();

				let day = date.getDate();
				let month = date.getMonth() + 1;
				let year = date.getFullYear();

				let password;
				if (applyLock) {
					password = "123";
				}
				// This arrangement can be altered based on how we want the date's format to appear.
				let currentDate = `${day}/${month}/${year}`;
				insertNote(data, title, content, currentDate, password)
					.then((results) => {
						// Alert.alert("Inserted", results);
						setSuccessIsVisible(true);
						setTitle("");
						setContent("");
						setApplyLock(false);
					})
					.catch((error) => {
						// Alert.alert("ERROR", error);
						setErrorIsVisible(true);
						setErrMsg(error);
					});
			} else if (title == "") {
				setErrMsg("There must be a title");
				setErrorIsVisible(true);
			}
		});
	};

    const cancel = () => {

    }

	return (
		<View style={styles.container}>
			<CustomAlert
				displayMode={"success"}
				visibility={successIsVisible}
				dismissAlert={setSuccessIsVisible}
				displayMsg={"Note is Added!"}
			/>

			<CustomAlert
				displayMode={"error"}
				visibility={ErrorIsVisible}
				dismissAlert={setErrorIsVisible}
				displayMsg={errMsg}
			/>
			<CustomAlert
				displayMode={"password"}
				visibility={passwordIsVisible}
				passwordAlert={setPasswordIsVisible}
                cancelAlert={cancel}
				displayMsg={"Input password:"}
                password={password}
                setPassword={setPassword}
			/>
			<NoteForm
				title={title}
				content={content}
				titleOnchange={setTitle}
				contentOnchange={setContent}
			/>
			<TouchableOpacity style={styles.btnStyle} onPress={onPressBtn}>
				<Text style={styles.btnTxt}>ADD NOTE</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F7F1F6",
		padding: 25,
	},
	txtInput: {
		fontSize: 20,
	},
	withUnderline: {
		borderBottomWidth: 1,
		borderBottomColor: "grey",
		padding: 10,
	},
	btnStyle: {
		backgroundColor: "#5a189a",
		padding: 10,
		borderRadius: 5,
	},
	btnTxt: {
		color: "white",
		fontSize: 15,
		fontWeight: "bold",
		textAlign: "center",
	},
});

export default AddNotes;
