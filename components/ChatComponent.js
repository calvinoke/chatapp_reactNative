import { View, Text, Pressable } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../utils/styles";

const ChatComponent = ({ item }) => {
	const navigation = useNavigation();
	const [messages, setMessages] = useState({});

	useLayoutEffect(() => {
		if (item.messages && item.messages.length > 0) {
			setMessages(item.messages[item.messages.length - 1]);
		}
	}, [item.messages]);  // Added item.messages to the dependency array
	

	//passing the id and name to the Messaging screen when navigating
	const handleNavigation = () => {
		navigation.navigate("Messaging", {
			id: item._id,  // Use _id instead of id
			name: item.name,
		});
	};
	

	return (
		<Pressable style={styles.cchat} onPress={handleNavigation}>
			<Ionicons
				name='person-circle-outline'
				size={45}
				color='black'
				style={styles.cavatar}
			/>

			<View style={styles.crightContainer}>
				<View>
					<Text style={styles.cusername}>{item.name}</Text>

					<Text style={styles.cmessage}>
						{messages?.text ? messages.text : "Tap to start chatting"}
					</Text>
				</View>
				<View>
					<Text style={styles.ctime}>
						{messages?.time ? messages.time : "now"}
					</Text>
				</View>
			</View>
		</Pressable>
	);
};

export default ChatComponent;