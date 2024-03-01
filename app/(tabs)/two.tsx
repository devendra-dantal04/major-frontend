import { StyleSheet, TouchableOpacity } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import socket from "@/context/socket";

export default function TabTwoScreen() {
  function initiateSOS() {
    socket.emit("INITIATE_SOS");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
      <Link href={"/(auth)/register"}>Go to Register</Link>
      <Link href={"/(auth)/login"}>Go to Login</Link>
      <Link href={"/(auth)/basic"}>Go to Basic</Link>
      <Link href={"/modal"}>Open Modal</Link>
      <TouchableOpacity onPress={() => initiateSOS()}>
        <Text> Call SOS </Text>
      </TouchableOpacity>
    </View>
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
