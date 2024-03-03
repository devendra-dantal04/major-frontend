import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Tabs } from "expo-router";
import AllPosts from "../(pages)/allposts";
import MyPosts from "../(pages)/myposts";
import { SafeAreaView } from "react-native-safe-area-context";

// const Tab = createMaterialTopTabNavigator();

const Posts = () => {
  const [tab, setTab] = useState("allpost");

  return (
    <>
      <SafeAreaView className="flex-1 bg-white">
        <View className="p-4 flex-row">
          <TouchableOpacity
            className="flex-1 border-slate-300"
            style={{
              borderBottomWidth: tab == "allpost" ? 2 : 0,
              borderColor: "rgb(8 47 73)",
            }}
            onPress={() => setTab("allpost")}
          >
            <Text className="text-center font-semibold text-lg">All Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 border-slate-300"
            style={{
              borderBottomWidth: tab == "mypost" ? 2 : 0,
              borderColor: "rgb(8 47 73)",
            }}
            onPress={() => setTab("mypost")}
          >
            <Text className="text-center font-semibold text-lg">My Posts</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1">
          {tab == "allpost" ? <AllPosts /> : <MyPosts />}
        </View>
      </SafeAreaView>
    </>
  );

  if (tab == "allpost") {
    return <AllPosts />;
  } else {
    return <MyPosts />;
  }
};

export default Posts;
