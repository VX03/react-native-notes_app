import React, { useState } from "react";

import { Modal, Text, View, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomTextInput from "./CustomTextInput";

export default function CustomAlert({
	displayMode,
	displayMsg,
	visibility,
	dismissAlert,
	passwordAlert,
	cancelAlert,
	password,
	setPassword,
}) {
	return (
		<View>
			<Modal
				visible={visibility}
				animationType={"fade"}
				transparent={true}
			>
				<View
					style={{
						flex: 1,
						backgroundColor: "rgba(52, 52, 52, 0.8)",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<View
						style={{
							alignItems: "center",
							backgroundColor: "#ECF2FF",
							height: displayMode != "password" ? 200 : 280,
							width: "90%",
							borderWidth: 1,
							borderColor: "#fff",
							borderRadius: 7,
							elevation: 10,
						}}
					>
						<View style={{ alignItems: "center", margin: 10 }}>
							{displayMode == "success" ? (
								<>
									<Ionicons
										name="checkmark-done-circle"
										color={"green"}
										size={80}
									/>
								</>
							) : displayMode == "password" ? (
								<>
									<Ionicons
										name="lock-closed"
										color={"grey"}
										size={80}
									/>
								</>
							) : (
								<>
									<MaterialIcons
										name="cancel"
										color={"red"}
										size={80}
									/>
								</>
							)}

							<Text style={{ fontSize: 18, marginTop: 5 }}>
								{displayMsg}
							</Text>
							{displayMode == "password" ? (
								<>
									<CustomTextInput
										placeholder={"password"}
										input={password}
										setInput={setPassword}
										secureTextEntry={true}
									/>
								</>
							) : (
								<></>
							)}
						</View>
						<View
							style={{
								width: "90%",
								alignItems: "center",
								justifyContent: "center",
								flexDirection: "row",
							}}
						>
							{displayMode == "password" ? (
								<>
									<TouchableOpacity
										activeOpacity={0.9}
										onPress={() => cancelAlert()}
										style={{}}
									>
										<Text
											style={{
												margin: 15,
												backgroundColor: "purple",
												padding: 10,
												width: 80,
												textAlign: "center",
												borderRadius: 10,
												color: "white",
											}}
										>
											CANCEL
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										activeOpacity={0.9}
										onPress={() => passwordAlert(false)}
										style={{}}
									>
										<Text
											style={{
												marginVertical: 15,
												backgroundColor: "purple",
												padding: 10,
												borderRadius: 10,
												width: 80,
												width: 80,
												textAlign: "center",
												color: "white",
											}}
										>
											OK
										</Text>
									</TouchableOpacity>
								</>
							) : (
								<>
									<TouchableOpacity
										activeOpacity={0.9}
										onPress={() => dismissAlert(false)}
										style={{}}
									>
										<Text
											style={{
												marginVertical: 15,
												backgroundColor: "purple",
												padding: 10,
												borderRadius: 10,
												width: 80,
												width: 80,
												textAlign: "center",
												color: "white",
											}}
										>
											OK
										</Text>
									</TouchableOpacity>
								</>
							)}
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}
