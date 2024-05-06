import "react-native-gesture-handler";
import { ActivityIndicator, View } from "react-native";
import MainRoute from "./route/index";
import { useFonts } from "expo-font";
import CustomView from "./components/utils/CustomView";
import { StatusBar } from "expo-status-bar";
import * as Updates from 'expo-updates';
import { useEffect } from "react";

export default function App() {


  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }

 useEffect(()=>{
  onFetchUpdateAsync
 },[])


  let [fontsLoaded] = useFonts({
    OutfitBold: require("./assets/fonts/Outfit-Bold.ttf"),
    OutfitMedium: require("./assets/fonts/Outfit-Medium.ttf"),
    OutfitLight: require("./assets/fonts/Outfit-Light.ttf"),
    Pacifico: require("./assets/fonts/Pacifico-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={"black"} size={"large"} />
      </View>
    );
  } else {
    return (
  
        <CustomView>
          <StatusBar style="auto" />
          <MainRoute />
        </CustomView>
    );
  }
}
