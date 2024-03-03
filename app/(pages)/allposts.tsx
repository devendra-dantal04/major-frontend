import { View, Text, ScrollView } from "react-native";
import React from "react";

const PostComponent = () => {
  return (
    <View className="border-gray-700 border-[1.8px]  p-4 max-h-[200px] w-[80%] rounded-md bg-slate-50 shadow-md">
      <Text className="text-2xl font-bold">Indian Bullyig wwwwwwwwwwwww</Text>
      <Text className="text-md my-3">
        Indian Bullyig
        wwwwwwwwwwwwwdfsdklfhsdjkbfsdjgbjsdbgjgbsjdfbgjsbgsjbgsdbgsbgjsdbgjbj
      </Text>
      <View className="h-[1px] mb-2 bg-slate-500 w-full"></View>
      <Text>Created By : blacksmith</Text>
    </View>
  );
};

const allposts = () => {
  return (
    <ScrollView className="bg-white flex-1 m-2 ">
      <View className="flex-1 items-center justify-center">
        <PostComponent />
        <PostComponent />
        <PostComponent />
      </View>
    </ScrollView>
  );
};

export default allposts;
