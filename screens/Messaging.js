import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, TextInput, Text, FlatList, Pressable } from "react-native";
import socket from "../utils/socket";
import MessageComponent from "../components/MessageComponent";
import { styles } from "../utils/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Messaging = ({ route, navigation }) => {
	const [user, setUser] = useState("");
	const { name, id } = route.params;

	const [chatMessages, setChatMessages] = useState([]);
	const [message, setMessage] = useState("");

	const getUsername = async () => {
		try {
			const value = await AsyncStorage.getItem("username");
			if (value !== null) {
				setUser(value);
			}
		} catch (e) {
			console.error("Error while loading username!");
		}
	};

	const handleNewMessage = () => {
		const hour = new Date().getHours().toString().padStart(2, '0');
		const mins = new Date().getMinutes().toString().padStart(2, '0');

		if (id) {
			socket.emit("newMessage", {
				message,
				room_id: id,  // Ensure this is correct
				user,
				timestamp: { hour, mins },
			});
		} else {
			console.error('Room ID is undefined!');
		}
	};
	

	//Messaging screen receives the correct id by logging it in the Messaging component
	useLayoutEffect(() => {
		console.log("Route Params:", route.params);  // Check the id and name
		navigation.setOptions({ title: name });
		getUsername();
		socket.emit("findRoom", id);
		socket.on("foundRoom", (roomChats) => setChatMessages(roomChats));
	}, []);
	
	useEffect(() => {
		socket.on("foundRoom", (roomChats) => setChatMessages(roomChats));
	}, [socket]);

	return (
		<View style={styles.messagingscreen}>
			<View
				style={[
					styles.messagingscreen,
					{ paddingVertical: 15, paddingHorizontal: 10 },
				]}
			>
				{chatMessages[0] ? (
					<FlatList
						data={chatMessages}
						renderItem={({ item }) => (
							<MessageComponent item={item} user={user} />
						)}
						keyExtractor={(item) => item.id}
					/>
				) : (
					""
				)}
			</View>

			<View style={styles.messaginginputContainer}>
				<TextInput
					style={styles.messaginginput}
					onChangeText={(value) => setMessage(value)}
				/>
				<Pressable
					style={styles.messagingbuttonContainer}
					onPress={handleNewMessage}
				>
					<View>
						<Text style={{ color: "#f2f0f1", fontSize: 20 }}>SEND</Text>
					</View>
				</Pressable>
			</View>
		</View>
	);
};

export default Messaging;