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
import { FontAwesome5 } from "@expo/vector-icons";

const alerts = () => {
  const [allAlerts, setAllAlerts] = useState([]);

  const { user } = useUserSelector();

  useEffect(() => {
    const getSOSDetails = async () => {
      console.log("Called");
      try {
        const response = await axios.get(
          `http://192.168.0.110:5500/api/v1/sos/active_sos/${user?._id}`
        );
        console.log("Log", response.data.data);
        setAllAlerts(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    getSOSDetails();
  }, []);

  const getDirection = (data) => {
    console.log(data);
    if (!socket.connected) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}&travelmode=walking`;
    Linking.openURL(url);
  };

  const AlertCard = ({ alert }) => {
    return (
      <View
        key={`${alert.username}-${alert._id}`}
        className="w-[85vw] min-h-[160px] bg-amber-400 p-6 rounded-lg mb-3"
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
        <View>
          {user?._id == alert.owner_id ? (
            <>
              <TouchableOpacity
                onPress={() => getDirection(alert.coordinates)}
                className="p-4 w-[100%] bg-amber-500 rounded-md mt-4 flex flex-row items-center justify-center"
              >
                <Text className="text-white text-center font-bold text-base mr-2">
                  Get Direction
                </Text>
                <FontAwesome5 name="directions" size={22} color="white" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity className="p-4 w-[100%] bg-amber-500 rounded-md mt-4 flex flex-row items-center justify-center">
              <Text className="text-white text-center font-bold text-base mr-2">
                Accepted Users
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const isVisible = false;

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
              <AlertCard alert={alert} />
            ))}
          </ScrollView>
        )}
      </View>
      <Modal animationType="slide" transparent={true} visible={isVisible} />
    </>
  );
};

export default alerts;
