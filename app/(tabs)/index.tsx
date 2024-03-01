import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Circle, Marker } from "react-native-maps";
import { useEffect, useRef, useState } from "react";
import { useUserSelector, useStateSelector } from "@/context/userContext";
import socket from "@/context/socket";
import axios from "axios";

export default function Map() {
  const mapRef = useRef<MapView>(null);
  const { location } = useStateSelector();
  const { user } = useUserSelector();
  const [nearbyUser, setNearByUser] = useState([]);
  const [administration, setAdministration] = useState([]);
  const [SOSDetails, setSOSDetails] = useState([]);

  // (async () => {
  //   while (true) {
  //     const { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       return alert("Grant permission to access your location");
  //     }
  //     const { status: NotificationStatus } =
  //       await Notifications.requestPermissionsAsync();
  //     if (NotificationStatus !== "granted")
  //       return alert(
  //         "Hey! You might want to enable notifications for my app, they are good."
  //       );
  //     break;
  //   }
  // })();

  useEffect(() => {
    if (user) socket.emit("SET_ACTIVE_USER", user._id);

    socket.on("NEW_USER_ADDED", (users) => {
      setNearByUser(users);
    });
  }, []);

  const getSOSDetails = async () => {
    const response = await axios.get(
      `https://backend-6q2l.onrender.com/api/v1/sos/active_sos`
    );
    setSOSDetails(response.data.data);
  };

  useEffect(() => {
    socket.on("SEND_ADMINISTRATIONS", (data) => {
      setAdministration(data);
      console.log(data);
    });

    getSOSDetails();

    socket.on("Refetch_SOS_Details", getSOSDetails);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: "100%", width: "100%" }}>
        <MapView
          ref={mapRef}
          style={{ height: "100%", width: "100%" }}
          zoomControlEnabled
          showsMyLocationButton
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={location} />
          {nearbyUser &&
            nearbyUser.map((user, index) => {
              return (
                <Marker coordinate={user.location} key={`user-${index}`}>
                  <View className="px-2 py-2">
                    <Text>{user.username}</Text>
                  </View>
                </Marker>
              );
            })}

          {/* {administration &&
            administration.map((admin) => {
              return (
                <Marker coordinate={admin.location}>
                  <View>
                    <Text>{admin.name}</Text>
                  </View>
                </Marker>
              );
            })} */}
          {SOSDetails?.map((sos, index) => {
            return (
              <Circle
                center={sos.coordinates}
                radius={120}
                fillColor={"rgba(255,0,0,0.05)"}
                strokeColor={"rgba(255,0,0,0.0)"}
                strokeWidth={0}
                key={index}
              />
            );
          })}
        </MapView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
