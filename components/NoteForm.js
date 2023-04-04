import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const NoteForm = ({
	title,
	content,
	titleOnchange,
	contentOnchange,
	editable,
}) => {
	const [titleOnFocus, setTitleOnFocus] = useState(false);
	const [contentOnFocus, setContentOnFocus] = useState(false);

	const titleFocus = () => {
		setTitleOnFocus(true);
	};
	const contentFocus = () => {
		setContentOnFocus(true);
	};
	const titleBlur = () => {
		setTitleOnFocus(false);
	};
	const contentBlur = () => {
		setContentOnFocus(false);
	};

	return (
		<>
			<View
				style={[
					styles.withUnderline,
					{
						borderBottomColor: titleOnFocus ? "blue" : "grey",
					},
				]}
			>
				<TextInput
					style={[styles.txtInput]}
					multiline={true}
					placeholder={"Title"}
					placeholderTextColor={"grey"}
					value={title}
					onBlur={titleBlur}
					onFocus={titleFocus}
					underlineColorAndroid="transparent"
					onChangeText={(txt) => titleOnchange(txt)}
					editable={editable}
				/>
			</View>
			<View
				style={[
					styles.withUnderline,
					{
						minHeight: 450,
						marginVertical: 10,
						borderBottomColor: contentOnFocus ? "blue" : "grey",
					},
				]}
			>
				<TextInput
					style={[styles.txtInput]}
					multiline={true}
					placeholder={"Write your thoughts here..."}
					placeholderTextColor={"grey"}
					value={content}
					onBlur={contentBlur}
					onFocus={contentFocus}
					onChangeText={(txt) => contentOnchange(txt)}
					editable={editable}
				/>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	txtInput: {
		fontSize: 20,
	},
	withUnderline: {
		borderBottomWidth: 1,
		borderBottomColor: "grey",
		padding: 10,
	},
});

export default NoteForm;
