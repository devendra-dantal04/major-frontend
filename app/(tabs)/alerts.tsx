import {
  View,
  Text,
  FlatList,
  ScrollView,
  Modal,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserSelector } from "@/context/userContext";
import socket from "@/context/socket";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

const alerts = () => {
  const [allAlerts, setAllAlerts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [acceptedUsers, setAcceptedUsers] = useState([]);

  const { user } = useUserSelector();

  useEffect(() => {
    const getSOSDetails = async () => {
      try {
        const response = await axios.get(
          `https://backend-6q2l.onrender.com/api/v1/sos/active_sos/${user?._id}`
        );

        setAllAlerts(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    getSOSDetails();

    socket.on("Refetch_SOS_Details", getSOSDetails);
  }, [socket.connected]);

  const getDirection = (data) => {
    console.log(data);
    if (!socket.connected) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}&travelmode=walking`;
    Linking.openURL(url);
  };

  const acceptRequest = async (sosId) => {
    try {
      const response = await axios.post(
        `https://backend-6q2l.onrender.com/api/v1/sos/${sosId}/accept`,
        {
          userId: user?._id,
        }
      );

      // setAllAlerts(response.data.data);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const AlertCard = ({ alert }) => {
    return (
      <View
        key={`${alert.username}-${alert._id}-2`}
        className="w-[85vw] min-h-[160px] p-6 rounded-lg mb-3 shadow-md bg-[#FBF0E5]"
      >
        <View>
          <Text className="text-base font-semibold">
            Raised by : {alert.user.fullname}
          </Text>
          <Text className="text-base font-semibold">
            Phone Number : {alert.user.phone_number}
          </Text>
          <Text className="text-base font-semibold">
            Description : {alert.user.description}
          </Text>
          <Text className="text-base font-semibold">
            Time : {new Date(alert.createdAt).toLocaleString("en-In")}
          </Text>
        </View>
        <View className="flex flex-row gap-2 mt-2">
          {user._id?.toString() === alert.owner_id.toString() ||
          acceptedUsers.includes(user?._id) ? (
            <>
              <TouchableOpacity
                onPress={() => getDirection(alert.coordinates)}
                className="p-2 flex-1 rounded-md mt-4  bg-[#E17F49] flex flex-row items-center justify-center"
              >
                <Text className="text-white text-center font-semibold text-sm mr-2">
                  Get Direction
                </Text>
                <FontAwesome5 name="directions" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsVisible(!isVisible);
                  setAcceptedUsers(alert.accepted_list);
                }}
                className="p-2 flex-1 bg-[#E17F49] rounded-md mt-4 flex flex-row items-center justify-center"
              >
                <Text className="text-white text-center font-semibold text-sm mr-2">
                  Accepted Users
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              className="p-4 w-[100%] bg-[#E17F49] rounded-md mt-4 flex flex-row items-center justify-center"
              onPress={() => {
                acceptRequest(alert._id);
              }}
            >
              <Text className="text-black text-center font-semibold text-base mr-2">
                Accept Request
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <>
      <View className="flex-1 bg-white justify-center items-center">
        {allAlerts.length <= 0 ? (
          <Text className="text-lg font-semibold text-center">
            No active alerts
          </Text>
        ) : (
          <ScrollView className="flex-1 p-4">
            {allAlerts.map((alert) => (
              <AlertCard alert={alert} key={`alert-${alert._id}`} />
            ))}
          </ScrollView>
        )}
      </View>
      <Modal animationType="fade" transparent={true} visible={isVisible}>
        <View className="flex-1 justify-center items-center bg-black/20 blur-sm ">
          <View className="relative first-letter:w-[70%] h-auto bg-white/90 backdrop-blur-sm p-4 rounded-md">
            <TouchableOpacity
              className="absolute right-2 top-2"
              onPress={() => setIsVisible(false)}
            >
              <FontAwesome name="close" size={20} />
            </TouchableOpacity>
            <Text className="text-lg font-medium">Accepted Users</Text>

            <View>{console.log(acceptedUsers)}</View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default alerts;
