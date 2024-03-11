import { View, Text, ScrollView } from "react-native";
import React from "react";

const PostComponent = ({ postData }) => {
  return (
    <View className=" p-4 min-h-[200px] w-[90%] rounded-md bg-primary shadow-md mb-2">
      <Text className="text-2xl font-bold">{postData.title}</Text>
      <Text className="text-md my-3">{postData.content}</Text>
      <View className="h-[1px] mb-2 bg-slate-500 w-full mt-6"></View>
      <Text>Created By : {postData.createdBy.username}</Text>
    </View>
  );
};

const allposts = ({ posts }) => {
  return (
    <ScrollView className="bg-white flex-1 m-2 ">
      <View className="flex-1 items-center justify-center">
        {posts.map((post, index) => (
          <PostComponent key={index} postData={post} />
        ))}
      </View>
    </ScrollView>
  );
};

export default allposts;
