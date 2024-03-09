import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

const chatbot = () => {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-white items-center">
        <View className="flex-1 align-bottom justify-end w-[90%] p-4">
          <Text>Hello</Text>
        </View>
        <View className="flex-row  w-[90%] items-end relative justify-center">
          <TextInput
            className="w-full p-2 bg-primary rounded-md mb-4"
            placeholder="Enter prompt here...."
          />
          <TouchableOpacity className="absolute right-4 bottom-6">
            <Ionicons name="return-up-forward" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default chatbot;
