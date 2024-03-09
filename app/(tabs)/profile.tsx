import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserSelector } from "@/context/userContext";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useNavigation } from "expo-router";

const profile = () => {
  const { user } = useUserSelector();
  const navigation = useNavigation();
  console.log(user);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flexDirection: "row", width: "100%" }}>
        <View style={{ flex: 1 }} className="items-center justify-center">
          <View className="rounded-full h-[50px] w-[50px] bg-gray-300"></View>
        </View>
        <View style={{ flex: 1 }}>
          <Text>Joined On :</Text>
          <Text>
            {new Date().getDate() - new Date(user.createdAt).getDate()} Days
            Before
          </Text>
        </View>
      </View>
      <View className="w-full mt-2 p-4">
        <Text className="text-3xl font-semibold">{user?.fullname}</Text>
      </View>
      <View className="flex-1 px-4 my-4">
        <Text className="text-lg font-bold">Profile</Text>
        <TouchableOpacity className="w-full flex-row p-2  bg-[#FBF0E5]  rounded-xl items-center mt-2">
          <View className="p-2 rounded-full">
            <FontAwesome
              name="dot-circle-o"
              size={30}
              color={"#E17F49"}
              className="text-orange-600"
            />
          </View>
          <Text className="ml-2 text-lg font-semibold">Manage Details</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-full flex-row p-2  bg-[#FBF0E5]  rounded-xl items-center mt-2">
          <View className="p-2 rounded-full">
            <FontAwesome
              name="dot-circle-o"
              size={30}
              color={"#E17F49"}
              className="text-orange-600"
            />
          </View>
          <Text className="ml-2 text-lg font-semibold">Emergency Contacts</Text>
        </TouchableOpacity>
        <View className="w-full flex-row p-2  bg-[#FBF0E5]  rounded-xl items-center mt-2">
          <Link
            href={"/(pages)/geofence"}
            className="w-full flex-row p-2  bg-[#FBF0E5]  rounded-xl items-center justify-center"
            // onPress={() => navigation.navigate("profile")}
          >
            <View className="p-2 rounded-full flex justify-center items-center">
              <FontAwesome
                name="map-marker"
                size={30}
                color={"#E17F49"}
                className="text-orange-600 text-center"
              />
            </View>
            <Text className="ml-2 text-lg font-semibold">Add Geofence</Text>
          </Link>
        </View>
      </View>
      <TouchableOpacity className="bg-[#faf0e6c9] p-2 rounded-md w-fit m-2">
        <Text className="font-semibold text-md text-center">Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default profile;
