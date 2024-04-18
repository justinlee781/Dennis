import React, { useEffect } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import CustomHeader from "../../components/Headers/CustomHeader";
import Theme from "../../src/Theme";
import CurveView from "../../components/utils/CurveView";
import useStore from "../../store";
import { doc, onSnapshot } from "firebase/firestore"; // Import necessary Firestore functions and objects
import { dbFS } from "../../config/firebase";
import InputBox from "../../components/utils/InputBox";
import Space from "../../components/utils/Space";
import { categories } from "../../Data";
import CategoryCard from "../../components/Cards/CategoryCard";

function SPDashboard({ navigation }) {
  const userData = useStore((state) => state.userData);
  const setUserData = useStore((state) => state.setUserData);
  const userID = useStore((state) => state.userID);

  if (!userData) {
    return null;
  }

  return (
    <View style={styles.container}>
      <CustomHeader
        image={userData.userImage ? userData.userImage : placeholder}
        label={`Greetings ${userData.userName}!`}
      />

      <Space space={15} />
      <CurveView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categories}>
            {categories &&
              categories.map((category, index) => (
                <Pressable
                  key={index}
                  onPress={() =>
                    navigation.navigate("CategoryDetail", {
                      item: category,
                    })
                  }
                  style={{ borderRadius: 25 }}
                >
                  <CategoryCard
                    image={category.image}
                    label={category.label}
                    sublabel={category.sublabel}
                  />
                </Pressable>
              ))}
          </View>
        </ScrollView>
      </CurveView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.secondaryColor,
  },
  categories: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginTop: 10,
    gap: 10,
  },
});

export default SPDashboard;

const placeholder =
  "https://cdn-icons-png.flaticon.com/128/2202/2202112.png";
