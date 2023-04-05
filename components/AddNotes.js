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
	RefreshControl,
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

	const [password, setPassword] = useState("");

	const [errMsg, setErrMsg] = useState("");
	useEffect(() => {
		if (pressTrash) {
			setTitle("");
			setContent("");
			setPressTrash(false);
			setApplyLock(false);
		}
	}, [pressTrash]);

	const onPressBtn = () => {
		if (applyLock) {
			setPasswordIsVisible(true);
		} else {
			AsyncStorage.getItem("id").then((data) => {
				if (data != null && title != "") {
					const date = new Date();

					let day = date.getDate();
					let month = date.getMonth() + 1;
					let year = date.getFullYear();

					let pass;
					if (applyLock && password != "") {
						pass = password;
					}
					// This arrangement can be altered based on how we want the date's format to appear.
					let currentDate = `${day}/${month}/${year}`;
					insertNote(data, title, content, currentDate, pass)
						.then((results) => {
							// Alert.alert("Inserted", results);
							setSuccessIsVisible(true);
							setTitle("");
							setContent("");
						})
						.catch((error) => {
							console.log("ere");
							//  Alert.alert("ERROR", error);
							setErrMsg(error);
							setErrorIsVisible(true);
						});
				} else if (title == "") {
					setErrMsg("There must be a title");
					setErrorIsVisible(true);
				}
			});
			setApplyLock(false);
		}
	};

	const cancel = () => {
        setPasswordIsVisible(false)
    };

	const pressOk = () => {
		AsyncStorage.getItem("id").then((data) => {
			if (data != null && title != "") {
				const date = new Date();

				let day = date.getDate();
				let month = date.getMonth() + 1;
				let year = date.getFullYear();

				if (applyLock && (password != "" && password != null)) {
                    let currentDate = `${day}/${month}/${year}`;
                    insertNote(data, title, content, currentDate, password)
                        .then((results) => {
                            // Alert.alert("Inserted", results);
                            setPasswordIsVisible(false)
                            setApplyLock(false)
                            setSuccessIsVisible(true);
                            setTitle("");
                            setContent("");
                            setPassword('')
                        })
                        .catch((error) => {
                            console.log("ere");
                            //  Alert.alert("ERROR", error);
                            setErrMsg(error);
                            setErrorIsVisible(true);
                        });
				} else if (password == null || password == "") {
                    setErrMsg("Password must not be an empty string");
                    setErrorIsVisible(true);
                }
				// This arrangement can be altered based on how we want the date's format to appear.
			} else if (title == "") {
				setErrMsg("There must be a title");
				setErrorIsVisible(true);
			}
		});

        // setPassword('')
	};

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
				passwordAlert={pressOk}
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
