import React, { useState, useEffect } from "react";
import {
	Alert,
	Animated,
	StyleSheet,
	TouchableOpacity,
	View,
	Text,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import { CurvedBottomBarExpo } from "react-native-curved-bottom-bar";

import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AllNotes from "./components/AllNotes";
import AddNotes from "./components/AddNotes";
import Profile from "./components/Profile";
import Note from "./components/Note";
import Login from "./components/Login";
import Register from "./components/Register";
const Stack = createStackNavigator();
const Loginstack = createStackNavigator();

const LoginStack = () => {
	return (
		<Loginstack.Navigator
			initialRouteName="login"
			screenOptions={{ headerShown: false }}
		>
			<Loginstack.Screen
				name="login"
				component={Login}
				options={{ headerShown: false }}
			/>
			<Loginstack.Screen
				name="main"
				component={MainStack}
				options={{ headerStyle: { backgroundColor: "#B6B8D6" } }}
			/>
			<Loginstack.Screen
				name="register"
				component={Register}
				options={{ headerStyle: { backgroundColor: "#B6B8D6" } }}
			/>
		</Loginstack.Navigator>
	);
};

const MainStack = () => {
	const [pressTrash, setPressTrash] = useState(false);
	const [applyLock, setApplyLock] = useState(false);



	const _renderIcon = (routeName, selectedTab) => {
		let icon = "";

		switch (routeName) {
			case "allNotes":
				icon = "clipboard-outline";
				break;
			case "profile":
				icon = "person-outline";
				break;
		}
		return (
			<Ionicons
				name={icon}
				size={25}
				color={routeName === selectedTab ? "black" : "gray"}
			/>
		);
	};

	const renderTabBar = ({ routeName, selectedTab, navigate }) => {
		return (
			<TouchableOpacity
				onPress={() => navigate(routeName)}
				style={styles.tabbarItem}
			>
				{_renderIcon(routeName, selectedTab)}
			</TouchableOpacity>
		);
	};

	const AllNotesComponent = (props) => <AllNotes setApplyLock={() => setApplyLock(false)}/>;

	const ProfileComponent = (props) => (<Profile setApplyLock={() => setApplyLock(false)}/>);

	const AddNotesComponent = (props) => (
		<AddNotes
			applyLock={applyLock}
			setApplyLock={setApplyLock}
			pressTrash={pressTrash}
			setPressTrash={setPressTrash}
		/>
	);

	return (
		<CurvedBottomBarExpo.Navigator
			screenOptions={{
				headerShown: false,
			}}
			type="DOWN"
			style={[styles.bottomBar]}
			shadowStyle={styles.shawdow}
			height={55}
			circleWidth={50}
			bgColor="#B6B8D6"
			initialRouteName="allNotes"
			borderTopLeftRight
			renderCircle={({ selectedTab, navigate }) => (
				<Animated.View style={styles.btnCircleUp}>
					<TouchableOpacity
						style={styles.button}
						onPress={() => {
                            navigate("addNotes")}}
					>
						<Ionicons name={"add-outline"} color="gray" size={30} />
					</TouchableOpacity>
				</Animated.View>
			)}
			tabBar={renderTabBar}
		>
			<CurvedBottomBarExpo.Screen
				name="allNotes"
				position="LEFT"
				component={AllNotesComponent}
				options={{ headerStyle: { backgroundColor: "#B6B8D6" } }}
                
			/>
			<CurvedBottomBarExpo.Screen
				name="addNotes"
				position="center"
				component={AddNotesComponent}
				options={{
					headerStyle: { backgroundColor: "#B6B8D6" },
					headerTitleStyle: {
						fontWeight: "bold",
					},
					title: "Add Notes",
					headerShown: true,
					headerRight: () => (
						<View style={{ flexDirection: "row" }}>
							<TouchableOpacity
								style={{ marginRight: 15 }}
								onPress={() => {
									setApplyLock(!applyLock);
								}}
							>
								<Ionicons
									name={applyLock ? "lock-closed":'lock-open'}
									size={28}
									color={applyLock ? "purple":"grey"}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								style={{ marginRight: 10 }}
								onPress={() => {
									setPressTrash(true);
								}}
							>
								<Ionicons
									name={"trash-outline"}
									size={28}
									color="red"
								/>
							</TouchableOpacity>
						</View>
					),
				}}
			/>
			<CurvedBottomBarExpo.Screen
				name="profile"
				component={ProfileComponent}
				position="RIGHT"
				options={{ tabBarHideOnKeyboard: true }}
			/>
		</CurvedBottomBarExpo.Navigator>
	);
};

export default function App() {
	return (
		<NavigationContainer>
			<LoginStack />
		</NavigationContainer>
	);
}

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	shawdow: {
		shadowColor: "#DDDDDD",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 1,
		shadowRadius: 5,
	},
	button: {
		flex: 1,
		justifyContent: "center",
	},
	bottomBar: {},
	btnCircleUp: {
		width: 60,
		height: 60,
		borderRadius: 30,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#BDEDE0",
		bottom: 30,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
		elevation: 1,
	},
	imgCircle: {
		width: 30,
		height: 30,
		tintColor: "gray",
	},
	tabbarItem: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	img: {
		width: 30,
		height: 30,
	},
});
