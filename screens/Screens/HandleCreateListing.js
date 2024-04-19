import React, { useEffect, useState } from "react";
import { 
    View,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import Theme from "../../src/Theme";
import HeaderTwoIcons from "../../components/Headers/HeaderTwoIcons";
import Space from "../../components/utils/Space";
import useStore from "../../store";
import FullButton from "../../components/Buttons/FullButton";
import {addDoc, collection, doc, serverTimestamp, updateDoc} from "firebase/firestore"
import { dbFS, storage } from "../../config/firebase";

import {  getDownloadURL, ref as refn, uploadBytesResumable } from 'firebase/storage';
import LoadingView from "../../components/utils/LoadingView";
import ListingCard from "../../components/Cards/ListingCard";
import CurveView from "../../components/utils/CurveView";


const metadata = {
    contentType: 'application/octet-stream'
  };

function HandleCreateListing({navigation,route}){

    const {postData} = route.params;
    const userData = useStore((state) => state.userData);
    const [loading,setLoading] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleCreateListing = async () => {
      try {
        setLoading(true);
        const colRef = collection(dbFS,"categories","categories", postData.category);
    
        const formatAdPrice = (price) => {
          const parsedPrice = parseFloat(price);
          if (!isNaN(parsedPrice)) {
            const formattedPrice = parsedPrice.toFixed(2);
            return formattedPrice.toString(); 
          } else {
            return null;
          }
        };
        

        const listingData = {
          postedBy: userData.userName,
          postedByUserID: userData.userID,
          adTitle: postData.adTitle,
          adDescription: postData.adDescription,
          postedDate: serverTimestamp(),
          adPrice: formatAdPrice(postData.adPrice),
          category:postData.category,
          dimensions:postData.dimensions
        };

        const docRef = await addDoc(colRef, listingData);
    

        const uploadPromises = postData.images.map(async (imageUri) => {
          return await uploadImage(imageUri,docRef.id);
        });
   
        const uploadedImageURLs = await Promise.all(uploadPromises);
    

        const filteredImageURLs = uploadedImageURLs.filter((url) => url !== undefined);
        console.warn(filteredImageURLs);
    
        const updatedDocRef = doc(dbFS, "categories","categories",postData.category, docRef.id);
 
        await updateDoc(updatedDocRef, {
          images: filteredImageURLs,
        });
    
        setLoading(false);
        Alert.alert("Post Created","Your Post has been successfully created.")
        navigation.navigate("MainRoute")
      } catch (error) {
        console.error("Error creating listing: ", error);
        setLoading(false);
      }
    };
    
      
    

    const uploadImage = async (imageUri, docID) => {
      try {
        const storageRef = refn(storage, "images/" + Date.now());
        const response = await fetch(imageUri);
        const blob = await response.blob();
    
        setUploadingImage(true);
        const uploadTask = uploadBytesResumable(storageRef, blob);
    
        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
              }
            },
            (error) => {
              setUploadingImage(false);
              console.log("Error during upload:", error);
              reject(error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                console.log("Uploaded image", downloadURL);
                resolve(downloadURL);
              } catch (error) {
                setUploadingImage(false);
                console.log("Error getting download URL:", error);
                reject(error);
              }
            }
          );
        });
      } catch (error) {
        setUploadingImage(false);
        console.log("Image upload error:", error);
        throw error;
      }
    };
    


    return (
      <View style={styles.container}>
        <HeaderTwoIcons leftIcon={true} label={"Confirm your Listing"} />
        <Space space={15} />
        <CurveView style={{ paddingHorizontal: 15, }}>
        <Space space={10} />
          <View
            style={{
              borderRadius: 15,
            }}
          >
            <ListingCard
              postedBy={userData.userName}
              adTitle={postData.adTitle}
              adDescription={postData.adDescription}
              mainTag={"PREVIEW"}
              images={postData.images}
              adPrice={postData.adPrice}
              category={postData.category}
              dimensions={postData.dimensions}
            />
          </View>
        </CurveView>
        <View style={{ paddingHorizontal: 15, paddingBottom: 35,backgroundColor:'white' }}>
          <FullButton
            handlePress={handleCreateListing}
            color={Theme.primaryColor}
            label={"Confirm & Create"}
          />
        </View>
        {loading ? <LoadingView /> : null}
      </View>
    );}
export default HandleCreateListing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.secondaryColor,
  },
});

