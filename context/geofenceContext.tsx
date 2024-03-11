import { createContext, useEffect, useState } from "react";
import { useStateSelector, useUserSelector } from "./userContext";
import * as Location from "expo-location";
import axios from "axios";
import * as TaskManager from "expo-task-manager";
import { Alert } from "react-native";

const GeofenceContext = createContext();

export const GeoFenceProvider = ({ children }) => {
  const { location } = useStateSelector();
  const { user } = useUserSelector();
  const [geofencedData, setGeofencedData] = useState([]);

  const getGeofencedData = async () => {
    try {
      const response = await axios.get(
        `https://backend-6q2l.onrender.com/api/v1/geofence/track/${user?._id}`
      );
      console.log("Geofence ", response.data.data);
      setGeofencedData(response.data.data);
    } catch (err) {
      console.log("Error While Fetching Geofence Data");
    }
  };

  useEffect(() => {
    if (!location || !user) return;

    (async () => {
      console.log("Fetching geofenced data...");
      //   await getGeofencedData();
      //   console.log("Geofence data:", geofencedData);
      try {
        const response = await axios.get(
          `https://backend-6q2l.onrender.com/api/v1/geofence/track/${user?._id}`
        );
        console.log("Geofence ", response.data.data);
        setGeofencedData(response.data.data);

        const subscription = await Location.startGeofencingAsync(
          "Geofence Tracking",
          response.data.data
        );
        console.log("Geofencing subscription:", subscription);
        return () => {
          subscription.remove();
          Location.stopGeofencingAsync("Geofence Tracking");
        };
      } catch (err) {
        console.log("Error While Fetching Geofence Data");
      }
    })();
  }, [user]);

  TaskManager.defineTask(
    "Geofence Tracking",
    ({ data: { eventType, region }, error }) => {
      if (error) {
        console.log("Geofencing error:", error);
        return;
      }
      console.log("Geofencing event type:", eventType);
      console.log("Geofencing region:", region);
      if (eventType === Location.GeofencingEventType.Enter) {
        Alert.alert("You entered the region");
        console.log("You've entered region:", region);
      } else if (eventType === Location.GeofencingEventType.Exit) {
        console.log("You've left region:", region);
      }
    }
  );

  return (
    <GeofenceContext.Provider value={{}}>{children}</GeofenceContext.Provider>
  );
};
