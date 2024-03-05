import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import socket from "./socket";

interface IUser {
  _id?: string;
  username: string;
  email_address: string;
  fullname: string;
  phone_number: string;
  gender: string;
  emergency_contact: string[];
}

interface IUserContext {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

const userContext = createContext<IUserContext>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
});

interface ILocation {
  longitude: number;
  latitude: number;
}

interface IStateContext {
  location: ILocation;
  isSocketConnected: boolean;
}

const stateContext = createContext<IStateContext>({
  location: {
    longitude: 0,
    latitude: 0,
  },
  isSocketConnected: false,
});

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    (async () => {
      const currUser = await AsyncStorage.getItem("user");
      if (currUser === null) return setIsLoggedIn(false);
      // const { _id,  } = await JSON.parse(user);
      // if (!(user_id && emergency_contact && password))
      //   return setIsLoggedIn(false);
      setUser(await JSON.parse(currUser));
      // if (currUser) socket.emit("SET_ACTIVE_USER", currUser._id);
      setIsLoggedIn(true);
    })();
  }, [isLoggedIn]);

  const contextValue: IUserContext = {
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
  };

  return (
    <userContext.Provider value={contextValue}>{children}</userContext.Provider>
  );
};

export const StateContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, setUser } = useUserSelector();

  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (!(await AsyncStorage.getItem("user"))) return;
        const currUser = await AsyncStorage.getItem("user");
        const parsedUser = JSON.parse(currUser!);

        const connectedUser = {
          _id: parsedUser._id,
          username: parsedUser.username,
          email_address: parsedUser.email_address,
          fullname: parsedUser.fullname,
          phone_number: parsedUser.phone_number,
          gender: parsedUser.gender,
          emergency_contact: parsedUser?.emergency_contact,
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        };
        socket.emit("USER_CONNECTED", connectedUser);
        socket.emit("SET_ACTIVE_USER", connectedUser._id);
        setIsSocketConnected(true);
      } catch (error) {
        console.error("Error during socket connection:", error);
      }

      socket.on("connect_error", (err) => {
        console.log("LogErr", err.stack);
        console.log(err);
      });
      socket.on("disconnect", () => {
        setIsSocketConnected(false);
        console.log("disconnected");
      });
    })();

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, [user, location]);

  useEffect(() => {
    // if (!isSocketConnected) return;

    (async () => {
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 100,
        },
        ({ coords }) => {
          setLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });

          console.log("location updated");
        }
      );
      return () => subscription.remove();
    })();
  }, [isSocketConnected]);

  return (
    <stateContext.Provider value={{ location, isSocketConnected }}>
      {children}
    </stateContext.Provider>
  );
};

export const useUserSelector = () => useContext(userContext);
export const useStateSelector = () => useContext(stateContext);
