import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStateSelector, useUserSelector } from "@/context/userContext";

import socket from "@/context/socket";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { Link } from "expo-router";
import { sendSMSAsync } from "expo-sms";
import { Audio } from "expo-av";
import axios from "axios";

const sos = () => {
  const { user } = useUserSelector();
  const { location, isSocketConnected } = useStateSelector();
  const [isSOS, setIsSOS] = useState(false);
  const [accepted_count, setAccepted_count] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState();

  const playSound = async () => {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sos.mp3")
    );
    setSound(sound);

    if (isPlaying) {
      sound.stopAsync();
    } else {
      await sound.setIsLoopingAsync(true);
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      // staysActiveInBackground: true,
    });
  };

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound?.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const activeSOS = async () => {
    const response = await axios.get(
      `https://backend-6q2l.onrender.com/api/v1/sos/active_sos/${user?._id}`
    );
    if (Array.from(response.data.data).length > 0) {
      setIsSOS(true);
    }
  };

  useEffect(() => {
    activeSOS();
  }, [user]);

  const SendSMS = (emergency_contact: string[], message: string) => {
    sendSMSAsync(emergency_contact, message).catch((err) => console.error(err));
  };

  const InitSOS = (description: string, sosId?: string) => {
    if (!isSocketConnected || user == null) return;
    setIsSOS(!isSOS);
    const { emergency_contact } = user;
    if (isSOS) {
      setAccepted_count(0);
      return socket.emit("SOS_Cancel", sosId, (data) => {
        if (data.err) return alert(data.msg);
        const message = `I am ${data} and I am not in danger anymore.`;
        SendSMS(emergency_contact, message);
        setIsSOS(false);
      });
    }
    socket.emit("INITIATE_SOS", description, (data) => {
      if (data.err) return alert(data.msg);
      const message = `I am ${
        data.name
      } and I am in danger. Please help me. My location is https://www.google.com/maps/search/?api=1&query=${
        data.coordinates.latitude
      },${data.coordinates.longitude}.\n Send at ${new Date(
        data.time
      ).toLocaleString()}`;

      setIsSOS(true);
      SendSMS(emergency_contact, message);
    });
  };

  return (
    <SafeAreaView>
      <View className="flex-1 p-8 items-center relative">
        <View className="border-4 border-red-500 p-2 w-[200px] h-[200px] rounded-full">
          <TouchableOpacity
            className="h-full w-full rounded-full bg-red-600 items-center justify-center"
            onPress={() => {
              InitSOS("general");
            }}
          >
            <Text className="text-white text-2xl font-bold">
              {isSOS ? "Cancel SOS" : "SOS"}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="absolute right-2 top-2">
          <Link href={"/(pages)/chatbot"}>Go to Chatbot</Link>
        </View>
        <View className="mt-6 h-[90px]">
          <View className="flex flex-row gap-3">
            <View className="h-[80px] w-[80px] rounded-xl bg-red-400 flex justify-center items-center">
              <Ionicons name="flame" size={32} color="white" />
              <Text className="font-semibold text-md text-white">Fire</Text>
            </View>
            <View className="h-[80px] w-[80px] rounded-xl bg-red-400 flex justify-center items-center">
              <FontAwesome name="ambulance" size={32} color="white" />
              <Text className="font-semibold text-md text-white">
                Ambulance
              </Text>
            </View>
            <View className="h-[80px] w-[80px] rounded-xl bg-red-400"></View>
          </View>
        </View>

        <View className="mt-6 flex items-center justify-center h-[170px]">
          <TouchableOpacity
            className="h-[150px] rounded-full w-[150px] bg-red-300 flex items-center justify-center"
            onPress={() => playSound()}
          >
            <View className="h-[110px] rounded-full w-[110px] bg-red-400 flex items-center justify-center">
              <MaterialCommunityIcons
                name="alarm-light"
                size={40}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </View>

        <View className="mt-8">
          <TouchableOpacity className="flex flex-row justify-center bg-red-700 rounded-2xl w-[60vw] h-12 items-center">
            <Text className="text-white font-semibold text-xl mr-2">
              Emergency Call
            </Text>
            <FontAwesome size={30} name="phone" color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default sos;
