import React, { useEffect } from "react";
import { View, StyleSheet, Pressable, ScrollView, FlatList } from "react-native";
import CustomHeader from "../../components/Headers/CustomHeader";
import Theme from "../../src/Theme";
import CurveView from "../../components/utils/CurveView";
import useStore from "../../store";
import Space from "../../components/utils/Space";
import { categories } from "../../Data";
import CategoryCard from "../../components/Cards/CategoryCard";

function SPDashboard({ navigation }) {
  const userData = useStore((state) => state.userData);

  if (!userData) {
    return null;
  }

  const renderCategoryItem = ({ item }) => (
      <CategoryCard
        image={item.image}
        label={item.label}
        sublabel={item.sublabel}
        handlePress={()=>navigation.navigate("CategoryDetail", {
          item: item,
        })}
      />
  );

  return (
    <View style={styles.container}>
      <CustomHeader
        image={userData.userImage ? userData.userImage : placeholder}
        label={`Greetings ${userData.userName}!`}
        rightIcon={"plus"}
        rightIconPress={() => navigation.navigate("CreatePost")}
      />

      <Space space={15} />

      <CurveView>
        <FlatList
          data={categories}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderCategoryItem}
          numColumns={2}
          contentContainerStyle={styles.categoryList}
        />
      </CurveView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.secondaryColor,
  },
  categoryList: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    width:'100%',
    flex:1
  },
});

export default SPDashboard;

const placeholder =
  "https://cdn-icons-png.flaticon.com/128/2202/2202112.png";
