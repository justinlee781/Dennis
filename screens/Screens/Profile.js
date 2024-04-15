import React, { useState } from "react";
import { 
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Linking,
    Platform
} from "react-native";
import HeaderTwoIcons from "../../components/Headers/HeaderTwoIcons";
import Theme from "../../src/Theme";
import CurveView from "../../components/utils/CurveView";
import Space from "../../components/utils/Space";
import Typo from "../../components/utils/Typo";
import DetailCard from "../../components/utils/DetailCard";
import useStore from "../../store";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH, dbFS, storage } from "../../config/firebase";
import * as ImagePicker from 'expo-image-picker';
import { doc, updateDoc } from "firebase/firestore";

import {  getDownloadURL, ref as refn, uploadBytesResumable } from 'firebase/storage';


const metadata = {
    contentType: 'application/octet-stream'
  };

function SPProfile({navigation}){
    const userData = useStore((state) => state.userData);
    const userID = useStore((state) => state.userID);
    const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleLogout = () => {
        Alert.alert(
          "Logout",
          "Are you sure you want to logout?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", onPress: () => logout() }
          ],
          { cancelable: true }
        );
      };
    
      const logout = () => {
        // Perform any logout actions here, such as clearing user data from storage, etc.
        logoutFunction()
      };



      const logoutFunction = async () => {
        try {
          await AUTH.signOut();
          await AsyncStorage.setItem("isLoggedIn", "false");
          const isLoggedInString = await AsyncStorage.getItem('isLoggedIn');
        
         if(isLoggedInString === 'false'){
          setIsLoggedIn(false); 
          navigation.replace("OnboardingScreen");
         }
        } catch (error) {
          console.log(error);
        }
      };


      const handleSelectImage = async () => {
        try {
          const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!permissionResult.granted) {
            Alert.alert(
              'Permission Denied',
              'You need to grant permission to access the gallery. Do you want to open settings?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Open Settings',
                  onPress: () => openAppSettings(),
                },
              ]
            );
            return;
          }
      
          const imageResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
          });
      
          if (imageResult.canceled) {
            return;
          }
    
          const imguri = imageResult.assets[0]
    
          uploadImage(imguri);
        } catch (error) {
          console.log('Image selection error:', );
          alert('Failed to select image');error
        }
      };
    
    
    
    
      const uploadImage = async (imageUri) => {
        try {
    
          const storageRef = refn(storage, "images/" + Date.now());
          const response = await fetch(imageUri.uri);
          const blob = await response.blob();
      
      
          setUploadingImage(true);
          const uploadTask = uploadBytesResumable(storageRef, blob);
      
          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on('state_changed', (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          }, (error) => {
            setUploadingImage(false);
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                console.log("User doesn't have permission to access the object");
                break;
              case 'storage/canceled':
                console.log("User canceled the upload");
                break;
              case 'storage/unknown':
                console.log("Unknown error occurred, inspect error.serverResponse");
                break;
            }
            alert(error.message); // Display the error message to the user
          }, async () => {
            // Upload completed successfully, now we can get the download URL
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("uploaded image", downloadURL);
      
              const userDocRef = doc(dbFS, "users", userID);
              await updateDoc(userDocRef, {
                userImage: downloadURL,
              });
      
              setUploadingImage(false);
              Alert.alert("Done!", "Your image has been uploaded successfully");
      
            } catch (error) {
              setUploadingImage(false);
              console.log("Error getting download URL or updating user document:", error);
              alert(error.message); // Display the error message to the user
            }
          });
        } catch (error) {
          setUploadingImage(false);
          console.log("Image upload error:", error);
          alert(error.message); // Display the error message to the user
        }
      };




      const openAppSettings = () => {
        if (Platform.OS === 'ios') {
          Linking.openURL('app-settings:');
        } else if (Platform.OS === 'android') {
          Linking.openSettings();
        }
      };


  return (
    <View style={styles.container}>
      <HeaderTwoIcons leftIcon={true} label={"Account"} rightIcon={false} />
      <CurveView style={{paddingHorizontal:20}}>
        <View style={styles.body}>
          <View style={{ alignItems: "center" }}>
            {uploadingImage ? (
              <ActivityIndicator color={Theme.primaryColor} />
            ) : (
              <Image
                source={{
                  uri: userData.userImage ? userData.userImage : placeholder,
                }}
                style={styles.profile}
              />
            )}
            <Space space={15} />
            <Typo l >
              Hi,{userData.fullName}
            </Typo>
            <Space space={5} />
            <TouchableOpacity onPress={handleSelectImage}>
              <Typo style={{ color: Theme.primaryColor }} s>
                Change the photo
              </Typo>
            </TouchableOpacity>
          </View>

          <Space space={25} />

          <DetailCard handlPress={()=>navigation.navigate("PersonalInfoScreen")} icon="user" title={"Personal Info"} />
          <DetailCard handlPress={()=>navigation.navigate("MyLikedItems")} icon="heart" title={"My Liked Items"} />
          <DetailCard handlPress={()=>navigation.navigate("MyAddressScreen")} icon="home" title={"My Saved Addresses"} />

          <Space space={25} />

          <DetailCard
            handlPress={handleLogout}
            icon="log-out"
            title={"Logout"}
          />
        </View>
      </CurveView>
    </View>
  );
}
    
export default SPProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.secondaryColor,
  },
  card: {
    width: 175,
    height: 175,
    borderRadius: 20,
    overflow: "hidden"
  },
  wrapper:{
    flexDirection:'row',
    flexWrap:'wrap',
    gap:10
  },
  body:{
    flex:1,
    paddingTop:25
  },
  profile:{
    height:65,
    width:65,
    borderRadius:100,
    backgroundColor:'#e5e5e5'
  }
});


const placeholder = "https://cdn-icons-png.flaticon.com/128/236/236832.png"