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
        const colRef = collection(dbFS, postData.category);
    
        const formatAdPrice = (price) => {
          const parsedPrice = parseFloat(price);
          if (!isNaN(parsedPrice)) {
            // Check if price already has two decimal places
            const formattedPrice = parsedPrice.toFixed(2);
            return formattedPrice.toString(); // Convert back to string
          } else {
            // If price is not a valid number, return null or handle accordingly
            return null;
          }
        };
        
        // Create a listingData object with necessary data
        const listingData = {
          postedBy: userData.fullName,
          postedByUserID: userData.userID,
          adTitle: postData.adTitle,
          adDescription: postData.adDescription,
          brand: postData.brand,
          postedDate: serverTimestamp(),
          condition: postData.condition,
          adPrice: formatAdPrice(postData.adPrice),
          category:postData.category
        };

        const docRef = await addDoc(colRef, listingData);
    
        // Upload each image in the postData.images array
        const uploadPromises = postData.images.map(async (imageUri) => {
          return await uploadImage(imageUri,docRef.id);
        });
    
        // Wait for all image uploads to complete before proceeding
        const uploadedImageURLs = await Promise.all(uploadPromises);
    
        // Filter out any undefined values from the uploadedImageURLs array
        const filteredImageURLs = uploadedImageURLs.filter((url) => url !== undefined);
        console.warn(filteredImageURLs);
    
        // Create a reference to the newly added document using its ID
        const updatedDocRef = doc(dbFS, postData.category, docRef.id);
    
        // Update the Firestore document with the filtered image URLs
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
              postedBy={userData.fullName}
              adTitle={postData.adTitle}
              adDescription={postData.adDescription}
              mainTag={"PREVIEW"}
              images={postData.images}
              adPrice={postData.adPrice}
              category={postData.category}
              condition={postData.condition}
              brand={postData.brand}
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