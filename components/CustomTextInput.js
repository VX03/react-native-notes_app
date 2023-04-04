import React from "react";
import { TextInput, StyleSheet,View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const CustomTextInput = ({ setInput, input, placeholder, secureTextEntry, haveLogo, logoName, keyboardType }) => {
	return (
        <View style={{flexDirection:"row", alignItems:'center'}}>
        {haveLogo? <Ionicons name={logoName} size={30} style={{marginRight:10}} color={'white'}/>:<></>}
		<TextInput
			style={[styles.textDesign,{width: haveLogo? '87%':'100%'}]}
			onChangeText={(txt) => setInput(txt)}
			value={input}
			placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
		/>
        </View>
	);
};

export default CustomTextInput;

const styles = StyleSheet.create({
	container: { backgroundColor: "white" },
	textDesign: {
		backgroundColor: "white",
		fontSize: 20,
		padding: 10,
		borderRadius: 10,
		marginVertical: 10,
		borderColor: "lightpink",
		width: '100%',
	},
});
