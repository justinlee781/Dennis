import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import Theme from "../../src/Theme";
import HeaderTwoIcons from "../../components/Headers/HeaderTwoIcons";
import CurveView from "../../components/utils/CurveView";
import Space from "../../components/utils/Space";
import InputBox from "../../components/utils/InputBox";
import LineBar from "../../components/utils/LineBar";
import FullButton from "../../components/Buttons/FullButton";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { dbFS } from "../../config/firebase";
import useStore from "../../store";
import Dropdown from "../../components/utils/Dropdown";
import LoadingView from "../../components/utils/LoadingView";

function CreatePost({ navigation }) {
  const [adDescription, setadDescription] = useState(null);
  const [adTitle, setadTitle] = useState(null);
  const [forumCategory, setfct] = useState(null);
  const [loading, setLoading] = useState(false);
  const userData = useStore((state) => state.userData);

  const handleCreateForum = async () => {
    if (!forumCategory) {
      Alert.alert("Forum Category Required");
      return;
    }
    if (!adTitle) {
      Alert.alert("Title Required");
      return;
    }
    if (!adDescription) {
      Alert.alert("Description Required");
      return;
    }
    setLoading(true);
    try {
      const forumData = {
        title: adTitle,
        description: adDescription,
        createdBy: userData,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(dbFS, "forums", "forums", forumCategory),
        forumData
      );
      setLoading(false);
      console.log("Forum post created with ID: ", docRef.id);
      Alert.alert("Forum Created!", "Your Forum has been created!");
      navigation.goBack();
    } catch (error) {
      console.error("Error creating forum post: ", error);
      Alert.alert("Error creating forum post. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

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
          <Dropdown
            defaultButtonText={"Select Forum Category"}
            data={[
              "WSL",
              "Shape Tips",
              "Local Spots",
              "Kookin Around",
              "Random Stuff",
            ]}
            setSelectedItem={(item) => setfct(item)}
          />
          <Space space={15} />
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
          handlePress={() => handleCreateForum()}
          label={"Create a Forum Post"}
        />
      </View>
      {loading ? <LoadingView /> : null}
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
});
