import React from "react";
import { View, Text, Button } from "react-native";
import { useUserSelector } from "@/context/userContext";
import { SafeAreaView } from "react-native-safe-area-context";

const Page = () => {
  const { isLoggedIn, user, setIsLoggedIn, setUser } = useUserSelector();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <SafeAreaView>
      <View>
        <Text>User Profile</Text>
        {isLoggedIn ? (
          <View>
            <Text>Welcome, {user && user?.username}</Text>
            <Button title="Logout" onPress={handleLogout} />
          </View>
        ) : (
          <View>
            <Text>Please log in</Text>
            <Button title="LogIn" onPress={handleLogin} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Page;
