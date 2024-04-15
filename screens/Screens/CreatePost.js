import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import Theme from "../../src/Theme";
import HeaderTwoIcons from "../../components/Headers/HeaderTwoIcons";
import CurveView from "../../components/utils/CurveView";
import Dropdown from "../../components/utils/Dropdown";
import Space from "../../components/utils/Space";
import InputBox from "../../components/utils/InputBox";
import { Feather, AntDesign } from "@expo/vector-icons";
import Typo from "../../components/utils/Typo";
import * as ImagePicker from "expo-image-picker";
import LineBar from "../../components/utils/LineBar";
import FullButton from "../../components/Buttons/FullButton";

const catData = [
  "Mobile Phone",
  "Laptop",
  "Smart Watch",
  "Tablet",
  "Computer",
  "Hardware",
];

const brandData = {
  "Mobile Phone": [
    "Apple (iPhone)",
    "Samsung (Galaxy)",
    "Google (Pixel)",
    "OnePlus",
    "Huawei",
    "Xiaomi",
    "Motorola",
    "Sony",
    "LG",
  ],
  Laptop: [
    "Apple (MacBook)",
    "Dell",
    "HP (Hewlett-Packard)",
    "Lenovo",
    "Asus",
    "Acer",
    "Microsoft (Surface)",
    "MSI",
    "Razer",
  ],
  "Smart Watch": [
    "Apple (Apple Watch)",
    "Samsung (Galaxy Watch)",
    "Fitbit",
    "Garmin",
    "Huawei",
    "Fossil",
    "Amazfit",
    "TicWatch",
    "Xiaomi (Mi Band)",
  ],
  Tablet: [
    "Apple (iPad)",
    "Samsung (Galaxy Tab)",
    "Amazon (Kindle Fire)",
    "Microsoft (Surface)",
    "Huawei",
    "Lenovo",
    "Asus",
    "Google (Pixel Slate)",
    "Xiaomi",
  ],
  Computer: [
    "Apple (iMac, Mac Pro)",
    "Dell",
    "HP (Hewlett-Packard)",
    "Lenovo",
    "Asus",
    "Acer",
    "Microsoft (Surface)",
    "MSI",
    "Razer",
  ],
  Hardware: [
    "Intel",
    "AMD",
    "Nvidia",
    "ASUS (motherboards, graphics cards, etc.)",
    "Corsair (RAM, power supplies, etc.)",
    "Seagate (hard drives, SSDs)",
    "Western Digital (hard drives, SSDs)",
    "Samsung (SSDs, memory)",
    "Logitech (peripherals, accessories)",
  ],
};

const conditionData = [
  "Recently Bought (New)",
  "1 - 6 Months Old",
  "6 - 12 Months Old",
  "Quiet Old",
];

function CreatePost({ navigation }) {
  const [hasPhotos, setHasPhotos] = useState(false);
  const [images, setImages] = useState([]);
  const [adDescription, setadDescription] = useState(null);
  const [dimensions, setDimensions] = useState(null);
  const [adTitle, setadTitle] = useState(null);
  const [adPrice, setadPrice] = useState(null);
  const [brand, setbrand] = useState(null);
  const [condition, setconditon] = useState(null);
  const [category, setcategory] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      if (result.assets.length > 3) {
        Alert.alert("Max 3 Photos", "You can select a maximum of 3 photos.");
        return;
      }

      setImages([...images, ...result.assets.map((asset) => asset.uri)]);
      setHasPhotos(true);
    }
  };

  const deleteImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    if (newImages.length === 0) {
      setHasPhotos(false);
    }
  };

  const handleCreateListing = () => {
    // Check if all required fields are filled
    if (!category) {
      Alert.alert(
        "Select Category",
        "Please select a Category to continue, the Category cannot be empty"
      );
      return;
    }

    if (!condition) {
      Alert.alert(
        "Select Condition",
        "Please select a condition to continue, the condition cannot be empty"
      );
      return;
    }

    if (!brand) {
      Alert.alert(
        "Select Brand",
        "Please select a brand to continue, the brand cannot be empty"
      );
      return;
    }

    if (!adTitle || !adDescription || !adPrice || !dimensions) {
      Alert.alert(
        "Incomplete Information",
        "Please fill in all the details for the listing."
      );
      return;
    }

    if (adTitle.split(" ").length < 5) {
      Alert.alert(
        "Ad Title Too Short",
        "Please enter an ad title with at least 5 words."
      );
      return;
    }

    if (adDescription.split(" ").length < 10) {
      Alert.alert(
        "Description Too Short",
        "Please enter a description with at least 10 words."
      );
      return;
    }

    // Check if price is a valid number
    const priceNumber = parseFloat(adPrice);
    if (isNaN(priceNumber)) {
      Alert.alert(
        "Invalid Price",
        "Please enter a valid numeric value for the price."
      );
      return;
    }

    if (!hasPhotos) {
      Alert.alert(
        "Select at least one image",
        "Please upload at least one image for the advertisement."
      );
      return;
    }

    // Create an array with all data
    const postData = {
      category,
      condition,
      brand,
      adTitle,
      adDescription,
      adPrice: priceNumber, // Convert price to a valid number
      images,
    };

    // Pass the array as a route param to the next screen
    navigation.navigate("HandleCreateListing", {
      postData,
    });
  };
  return (
    <View style={styles.container}>
      <HeaderTwoIcons
        handleRightIconPress={() => navigation.navigate("MainRoute")}
        rightIconName={"x"}
        leftIcon={false}
        label={"Create a Listing"}
        rightIcon={true}
      />
      <CurveView>
        <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
          <Dropdown
            label={"Select Category"}
            data={catData}
            setSelectedItem={setcategory}
          />
          {category ? <Space space={15} /> : null}
          {category ? (
            <Dropdown
              label={"Select Brand"}
              data={brandData[category]}
              setSelectedItem={setbrand}
            />
          ) : null}
          {category ? <Space space={15} /> : null}
          {category ? (
            <Dropdown
              label={"Select Condition"}
              data={conditionData}
              setSelectedItem={setconditon}
            />
          ) : null}
        </View>
        <Space space={15} />
        <LineBar margin={5} />

        <View style={styles.padding}>
          <InputBox
            leftIcon={"cube-outline"}
            label={"Ad Title"}
            placeholder={"Enter here"}
            value={adTitle}
            onChangeText={(t) => setadTitle(t)}
          />
          <Space space={15} />
          <InputBox
            leftIcon={"resize"}
            label={"Product Dimensions"}
            placeholder={"Eg : 27x28x21"}
            value={dimensions}
            onChangeText={(t) => setDimensions(t)}
          />
          <Space space={15} />
          <InputBox
            keyboardType={"numeric"}
            leftIcon={"pricetag-outline"}
            label={"Price"}
            placeholder={"Value"}
            value={adPrice}
            onChangeText={(t) => setadPrice(t)}
          />
          <Space space={15} />
          <InputBox
            label={"Ad Description"}
            placeholder={"Enter your description here"}
            value={adDescription}
            onChangeText={(t) => setadDescription(t)}
            multiline={true}
          />
          <Space space={15} />
          <Typo>Upload Images (Max 3)</Typo>
          <Space space={5} />
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
            {images.map((uri, index) => (
              <View key={index} style={{ position: "relative" }}>
                <Image source={{ uri }} style={styles.plus} />
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => deleteImage(index)}
                >
                  <AntDesign name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 3 ? (
              <TouchableOpacity onPress={pickImage} style={styles.plus}>
                <Feather name="plus" size={25} color={Theme.primaryColor} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <Space space={15} />
      </CurveView>
      <View style={{ padding: 20, backgroundColor: "white" }}>
        <FullButton
          handlePress={handleCreateListing}
          color={Theme.primaryColor}
          label={"Create a Listing"}
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
