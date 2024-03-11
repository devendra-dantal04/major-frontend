import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import AllPosts from "../(pages)/allposts";
import MyPosts from "../(pages)/myposts";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { useUserSelector } from "@/context/userContext";

// const Tab = createMaterialTopTabNavigator();

const Posts = () => {
  const { user } = useUserSelector();
  const [tab, setTab] = useState("allpost");
  const [isVisible, setIsVisible] = useState(false);
  const [postData, setPostData] = useState([]);
  const [userPostData, setUserPostData] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const getPosts = async () => {
    try {
      const response = await axios.get(
        `https://backend-6q2l.onrender.com/api/v1/article`
      );

      setPostData(response.data.data);
      console.log("Log", response.data);
      if (response.data.status) {
        Alert.alert("Successfully Fetched", "Successfully added.");
      }
    } catch (err) {
      Alert.alert("Error", "Something while fetching post");
    }
  };

  const getUserPosts = async () => {
    try {
      console.log(user?._id);
      const response = await axios.get(
        `https://backend-6q2l.onrender.com/api/v1/article/${user?._id}`
      );

      setUserPostData(response.data.data);

      if (response.data.status) {
        Alert.alert("Successfully Fetched", "Successfully added.");
      }
    } catch (err) {
      Alert.alert("Error", "Something while fetching post");
    }
  };

  useEffect(() => {
    getPosts();
    getUserPosts();
  }, [user]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `https://backend-6q2l.onrender.com/api/v1/article/create`,
        {
          ...formData,
          createdBy: user?._id,
        }
      );
      console.log("Log", response.data);
      if (response.data.status) {
        Alert.alert("Post Success", "Post Successfully added.");
      }
    } catch (err) {
      Alert.alert("Error", "Something while creating post");
    } finally {
      setIsVisible(false);
      setFormData({
        title: "",
        content: "",
      });
    }
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-white relative">
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
          <AllPosts posts={tab == "allpost" ? postData : userPostData} />
        </View>
        <TouchableOpacity
          className="w-[60px] h-[60px] rounded-full absolute bottom-4 right-4 bg-[#ebe5af] flex items-center justify-center"
          onPress={() => setIsVisible(true)}
        >
          <MaterialCommunityIcons name="feather" color={"black"} size={26} />
        </TouchableOpacity>

        <Modal visible={isVisible} transparent={true}>
          <View className="flex-1 justify-center items-center bg-black/50 backdrop-blur-3xl">
            <View className="relative first-letter:w-[90%] h-auto bg-white backdrop-blur-sm p-4 rounded-md">
              <TouchableOpacity
                className="absolute right-2 top-2"
                onPress={() => setIsVisible(false)}
              >
                <FontAwesome name="close" size={20} />
              </TouchableOpacity>
              <Text className="text-lg font-medium mb-4">Create Post</Text>
              <View className="flex gap-2">
                <TextInput
                  placeholder="Post Title"
                  className="p-2 w-full placeholder:text-black border border-gray-200 rounded-md"
                  value={formData.title}
                  onChangeText={(val) =>
                    setFormData({ ...formData, title: val })
                  }
                />
                <TextInput
                  multiline={true}
                  numberOfLines={5}
                  placeholder="Description"
                  className="p-2 w-full placeholder:text-black border border-gray-200 rounded-md"
                  value={formData.content}
                  onChangeText={(val) =>
                    setFormData({ ...formData, content: val })
                  }
                />
                <TouchableOpacity
                  className="bg-primary p-2 rounded-md w-full"
                  onPress={() => handleSubmit()}
                >
                  <Text className="text-center font-semibold">Create Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default Posts;
