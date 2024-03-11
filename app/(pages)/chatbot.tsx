import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Fontisto, Ionicons } from "@expo/vector-icons";
import Markdown from "react-native-markdown-display";
import axios from "axios";

const chatbot = () => {
  const [chats, setChats] = useState([]);
  const [prompt, setPrompt] = useState("");
  const scrollViewRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const onPrompt = async () => {
    // setLoading(true);
    // const dummyText = `**Disaster Response Plan: Fire** **If you are stuck in a house that has caught fire, follow these steps:** 1. **Stay calm and assess the situation.** Do not panic. Take a moment to assess the situation and determine the extent of the fire. 2. **If the fire is small and contained, try to put it out yourself.** Use a fire extinguisher or a bucket of water to try to extinguish the flames. 3. **If the fire is large or spreading, evacuate the house immediately.** Do not stop to gather your belongings. Leave the house and go to a safe place. 4. **Call the fire department.** Once you are out of the house, call the fire department immediately. Give them your location and a description of the fire. 5. **Stay away from the house until the fire department arrives.** Do not re-enter the house until the fire department has declared it safe.`;
    // await new Promise((resolve, rejects) => setTimeout(resolve, 2000));

    try {
      setLoading(true);
      setChats((prev) => [...prev, prompt]);
      const response = await axios.post(
        `https://backend-6q2l.onrender.com/api/v1/prompt`,
        {
          text: prompt,
        }
      );
      console.log(response.data.data);
      setChats((prev) => [...prev, response.data.data]);
    } catch (err) {
      console.log(err);
    } finally {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 mt-2">
      <View className="flex-1 bg-white items-center">
        <ScrollView ref={scrollViewRef}>
          <View className="flex-1 align-bottom justify-end w-[90%] p-4 mt-4">
            {chats &&
              chats.map((chat, index) => (
                <Markdown key={index}>{chat}</Markdown>
              ))}
            {loading && (
              <View className="flex-row items-center justify-start">
                <Fontisto name="spinner" size={24} />

                <Text className="ml-2">Generating Response.....</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View className="flex-row  w-[90%] items-end relative justify-center">
          <TextInput
            className="w-full p-2 bg-primary rounded-md mb-4 pr-6"
            placeholder="Enter prompt here...."
            onChangeText={(text) => setPrompt(text)}
          />
          <TouchableOpacity
            className="absolute right-4 bottom-6"
            onPress={() => onPrompt()}
          >
            <Ionicons name="return-up-forward" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default chatbot;
