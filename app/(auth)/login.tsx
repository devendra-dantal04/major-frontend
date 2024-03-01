import {
  // ToastAndroid,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { useUserSelector } from "@/context/userContext";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "@/context/socket";

interface ILoginData {
  email_address: string;
  password: string;
}

export default function Page() {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useUserSelector();
  const [userData, setUserData] = useState<ILoginData | null>({
    email_address: "",
    password: "",
  });

  useEffect(() => {
    if (isLoggedIn == false || user == null) {
      console.log("Not Logged In");
    } else {
      console.log("Logged In");
    }
  }, [isLoggedIn]);

  const handleSubmit = async () => {
    // TODO: check all the fields are not empty
    // TODO: Login the user
    try {
      const { data: response } = await axios.post(
        "https://backend-6q2l.onrender.com/api/v1/login",
        userData,
        {
          withCredentials: true,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.success) {
        console.log("HEllo", response.data);
        setUser(response.data);
        await AsyncStorage.setItem("user", JSON.stringify(response.data));
        socket.emit("SET_ACTIVE_USER", response.data._id);
        // ToastAndroid.show("Log In Successfully", ToastAndroid.SHORT);
      } else {
        // ToastAndroid.show(response.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      // ToastAndroid.show("Unable to Login the user", ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.container}>
          <View>
            <Text>Log In</Text>

            <Text>Enter your details to get LogIn to the application.</Text>
          </View>

          <View>
            <TextInput
              value={userData?.email_address}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, email_address: text }))
              }
              placeholder="Email Address"
              className="my-2 py-2 px-4 border-2 border-gray-400 rounded-lg"
            />
            <TextInput
              value={userData?.password}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, password: text }))
              }
              placeholder="Password"
              className="my-2 py-2 px-4 border-2 border-gray-400 rounded-lg"
            />
          </View>

          <TouchableOpacity onPress={() => handleSubmit()}>
            <Text>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
