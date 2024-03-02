import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Polygon } from "react-native-maps";
import { useStateSelector, useUserSelector } from "@/context/userContext";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";

const Page = () => {
  const { location } = useStateSelector();
  const { user } = useUserSelector();
  const [markers, setMarkers] = useState([]);
  const [geofenceName, setGeofenceName] = useState("");

  const addGeofence = async () => {
    try {
      const response = await axios.post(
        `https://backend-6q2l.onrender.com/api/v1/geofence/create`,
        {
          userId: user?._id,
          coordinates: markers,
          geofenceName,
        }
      );
      console.log("Log", response.data);
      if (response.data.status) {
        Alert.alert("GeoFence Success", "Geofence Successfully added.");
      }
    } catch (err) {
      Alert.alert("GeoFence Error", "Not able to add geofence");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1, position: "relative" }}>
        <View className="absolute top-5 z-10 flex justify-center items-center w-full">
          <TextInput
            value={geofenceName}
            onChangeText={(newText) => setGeofenceName(newText)}
            placeholder="Enter Geofence Name"
            className="w-[80%] bg-white/80 p-2 rounded-md"
          />
          <TouchableOpacity
            className="w-[80%] mt-1 p-2 bg-white/70"
            onPress={() => addGeofence()}
          >
            <Text className="font-semibold text-center">Add Geofence</Text>
          </TouchableOpacity>
        </View>
        <MapView
          style={{ height: "100%", width: "100%", flex: 1, zIndex: 0 }}
          zoomControlEnabled
          showsMyLocationButton
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={(e) => {
            console.log(typeof e.nativeEvent.coordinate);
            setMarkers([...markers, e.nativeEvent.coordinate]);
            console.log(markers);
          }}
        >
          {markers.length > 0 &&
            markers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={marker}
                draggable
                onDrag={(e) => console.log(e.nativeEvent.coordinate)}
                onDragStart={(e) => console.log(e.nativeEvent.coordinate)}
              />
            ))}

          {markers.length > 0 && (
            <Polygon coordinates={markers} fillColor="rgba(255, 16, 0, 0.13)" />
          )}
        </MapView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Page;
