import React, { useEffect, useState } from "react";
import { StyleSheet, Platform, View, LogBox } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Theme from "../src/Theme";
import OnboardingScreen from "../screens/Onboarding/OnboardingScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useStore from "../store";
import AccountSetupScreen from "../screens/AccountSetup/AccountSetupScreen";
import Dashboard from "../screens/Screens/Dashboard";
import Profile from "../screens/Screens/Profile";
import PersonalInfoScreen from "../screens/common/PersonalInfoScreen";
import CreatePost from "../screens/Screens/CreatePost";
import SignupScreen from "../screens/Auth/SignupScreen";
import CategoryDetail from "../screens/Screens/CategoryDetail";
import ProductDetail from "../screens/Screens/ProductDetail";
import MyCart from "../screens/Screens/MyCart";
import HandleCreateListing from "../screens/Screens/HandleCreateListing";
import MyLikedItems from "../screens/Screens/MyLikedItems";
import ChattingScreen from "../screens/Screens/ChattingScreen";
import ConversationsScreen from "../screens/Screens/ConversationsScreen";
import MyAddressScreen from "../screens/common/MyAddressScreen";
import ForumsScreen from "../screens/Screens/ForumsScreen";
import ForumDetails from "../screens/Screens/ForumDetials";
import CreateForum from "../screens/Screens/CreateForum";
import ForumInside from "../screens/Screens/ForumInside";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

LogBox.ignoreAllLogs();

const activeIconColor = Theme.blueColor;
const inactiveIconColor = "#8c8c8c";

export default function MyStack({ navigation }) {
  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const setUserID = useStore((state) => state.setUserID);

  const [userEmail, setEmail] = useState(null);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  const checkLoggedIn = async () => {
    const isLoggedInString = await AsyncStorage.getItem("isLoggedIn");
    const storeUserId = await AsyncStorage.getItem("userID");
    const email = await AsyncStorage.getItem("email");

    if (isLoggedInString === "true") {
      setIsLoggedIn(true);
    }

    if (storeUserId !== null) {
      setUserID(storeUserId);
      console.log("UID :", storeUserId);
    }
    if (email !== null) {
      setEmail(email);
      console.log("Email", email);
    }
  };

  const checkAndFetchData = async () => {
    await checkLoggedIn();
    setIsLoadingComplete(true);
  };

  useEffect(() => {
    checkAndFetchData();
  }, []);

  if (!isLoadingComplete) {
    return null; // Return null if loading is not complete
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn === false ? (
            <Stack.Screen
              name="OnboardingScreen"
              component={OnboardingScreen}
            />
          ) : (
            <Stack.Screen
              name="AccountSetupScreen"
              component={AccountSetupScreen}
              initialParams={{ email: userEmail }}
            />
          )}
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="SignupScreen" component={SignupScreen} />      
          <Stack.Screen name="MainRoute" component={MainRoute} />
          <Stack.Screen
            name="PersonalInfoScreen"
            component={PersonalInfoScreen}
          />
          <Stack.Screen name="CategoryDetail" component={CategoryDetail} />
          <Stack.Screen name="CreatePost" component={CreatePost} />
          <Stack.Screen name="CreateForum" component={CreateForum} />
          <Stack.Screen name="ProductDetail" component={ProductDetail} />
          <Stack.Screen name="MyCart" component={MyCart} />
          <Stack.Screen
            name="HandleCreateListing"
            component={HandleCreateListing}
          />
          <Stack.Screen name="MyLikedItems" component={MyLikedItems} />
          <Stack.Screen name="ChattingScreen" component={ChattingScreen} />
          <Stack.Screen name="MyAddressScreen" component={MyAddressScreen} />
          <Stack.Screen name="ForumDetails" component={ForumDetails} />
          <Stack.Screen name="ForumInside" component={ForumInside} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

function MainRoute() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconSource;
          let iconColor;

          switch (route.name) {
            case "Dashboard":
              iconSource = "grid";
              break;
            case "ForumsScreen":
              iconSource = "home";
              break;
            case "Chat":
              iconSource = "message-circle";
              break;
            case "Profile":
              iconSource = "user";
              break;
          }

          if (focused) {
            iconColor = activeIconColor;
          } else {
            iconColor = inactiveIconColor;
          }

          return <Feather name={iconSource} size={24} color={iconColor} />;
        },
        tabBarStyle: [styles.tabbarstyle, styles.shadowProp],
        tabBarActiveTintColor: Theme.primaryColor,
        tabBarInactiveTintColor: "#1B0C38",
        headerShown: false,
        tabBarLabel: () => null,
      })}
    >
      <Tab.Screen name="ForumsScreen" component={ForumsScreen} />
      <Tab.Screen name="Dashboard" component={Dashboard} />
      {/* <Tab.Screen
        name="Plus"
        component={LoadingNavigate}
        options={{ tabBarIcon: ({ focused }) => <PlusIcon /> }}
      /> */}
      <Tab.Screen name="Chat" component={ConversationsScreen} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

function PlusIcon({ focused }) {
  return (
    <View style={styles.plusIconWrapper}>
      <Feather name="plus" size={27} color={"white"} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabbarstyle: {
    height: Platform.OS === "ios" ? 95 : 75, // set the height based on the platform
    borderTopWidth: 1, // add a border to the top of the tab bar
    borderTopColor: Theme.containerGrey,
    backgroundColor: "#FFFFFF", // set a background color for the tab bar
    paddingVertical: Platform.OS === "ios" ? 20 : 0, // add extra padding for iOS to account for the notch
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
  },
  plusIconWrapper: {
    backgroundColor: Theme.primaryColor,
    height: 70,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    bottom: 25,
  },
});
