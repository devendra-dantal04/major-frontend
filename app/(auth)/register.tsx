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

interface IRegisterData {
  username: string;
  email_address: string;
  fullname: string;
  phone_number: string;
  password: string;
  gender: string;
  emergency_contact1: string;
  emergency_contact2: string;
}

export default function Page() {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useUserSelector();
  const [userData, setUserData] = useState<IRegisterData | null>({
    username: "",
    email_address: "",
    fullname: "",
    phone_number: "",
    password: "",
    gender: "male",
    emergency_contact1: "",
    emergency_contact2: "",
  });

  useEffect(() => {
    if (isLoggedIn == false) {
      console.log("Not Logged In");
    } else {
      console.log("Logged In");
    }
  }, [isLoggedIn]);

  const handleSubmit = async () => {
    // TODO: check all the fields are not empty
    // TODO: Register the user
    try {
      const { data: response } = await axios.post(
        "https://backend-6q2l.onrender.com/api/v1/register",
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
        setUser(response.data);
        await AsyncStorage.setItem("user", JSON.stringify(response.data));
        // ToastAndroid.show("Sign Up Successfully", ToastAndroid.SHORT);
      } else {
        // ToastAndroid.show(response.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      // ToastAndroid.show("Unable to register the user", ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.container}>
          <View>
            <Text>Sign Up</Text>

            <Text>
              Enter your details to get register with the application.
            </Text>
          </View>

          <View>
            <TextInput
              value={userData?.username}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, username: text }))
              }
              placeholder="Username"
              className="my-2 py-2 px-4 border-2 border-gray-400 rounded-lg"
            />
            <TextInput
              value={userData?.email_address}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, email_address: text }))
              }
              placeholder="Email Address"
              className="my-2 py-2 px-4 border-2 border-gray-400 rounded-lg"
            />
            <TextInput
              value={userData?.fullname}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, fullname: text }))
              }
              placeholder="Fullname"
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

          <View>
            <Text>Contact Details</Text>
            <TextInput
              value={userData?.phone_number}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, phone_number: text }))
              }
              placeholder="Phone Number"
              className="my-2 py-2 px-4 border-2 border-gray-400 rounded-lg"
            />
            <TextInput
              value={userData?.emergency_contact1}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, emergency_contact1: text }))
              }
              placeholder="Emergency Contact 1"
              className="my-2 py-2 px-4 border-2 border-gray-400 rounded-lg"
            />
            <TextInput
              value={userData?.emergency_contact2}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, emergency_contact2: text }))
              }
              placeholder="Emergency Contact 2"
              className="my-2 py-2 px-4 border-2 border-gray-400 rounded-lg"
            />
          </View>

          <TouchableOpacity onPress={() => handleSubmit()}>
            <Text>Sign Up</Text>
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
