import "react-native-gesture-handler";
import { ActivityIndicator, View } from "react-native";
import MainRoute from "./route/index";
import { useFonts } from "expo-font";
import CustomView from "./components/utils/CustomView";
import { StatusBar } from "expo-status-bar";

export default function App() {
  let [fontsLoaded] = useFonts({
    OutfitBold: require("./assets/fonts/Outfit-Bold.ttf"),
    OutfitMedium: require("./assets/fonts/Outfit-Medium.ttf"),
    OutfitLight: require("./assets/fonts/Outfit-Light.ttf"),
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
