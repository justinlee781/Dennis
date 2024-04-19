import React, { useState } from "react";
import { View,  StyleSheet } from "react-native";
import Theme from "../../src/Theme";
import HeaderTwoIcons from "../../components/Headers/HeaderTwoIcons";
import CurveView from "../../components/utils/CurveView";
import Space from "../../components/utils/Space";
import InputBox from "../../components/utils/InputBox";
import LineBar from "../../components/utils/LineBar";
import FullButton from "../../components/Buttons/FullButton";



function CreatePost({ navigation }) {
  const [adDescription, setadDescription] = useState(null);
  const [adTitle, setadTitle] = useState(null);


  return (
    <View style={styles.container}>
      <HeaderTwoIcons
        handleRightIconPress={() => navigation.navigate("MainRoute")}
        rightIconName={"x"}
        leftIcon={false}
        label={"Start a Discussion"}
        rightIcon={true}
      />
      <CurveView>

        <View style={styles.padding}>
          <InputBox
            leftIcon={"cube-outline"}
            label={"Forum Title"}
            placeholder={"Enter here"}
            value={adTitle}
            onChangeText={(t) => setadTitle(t)}
          />
          <Space space={15} />
          <InputBox
            label={"Forum Description"}
            placeholder={"Enter your description here"}
            value={adDescription}
            onChangeText={(t) => setadDescription(t)}
            multiline={true}
          />
          <Space space={15} />
        </View>
        <Space space={15} />
      </CurveView>
      <View style={{ padding: 20, backgroundColor: "white" }}>
        <FullButton
          color={Theme.primaryColor}
          label={"Create a Forum Post"}
        />
      </View>
    </View>
  );
}

export default CreatePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.secondaryColor,
  },
  padding: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  plus: {
    height: 88,
    width: 88,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.containerGrey,
    borderRadius: 15,
  },
  deleteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 50,
    padding: 5,
  },
});
