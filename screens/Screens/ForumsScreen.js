import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import CustomHeader from "../../components/Headers/CustomHeader";
import Theme from "../../src/Theme";
import CurveView from "../../components/utils/CurveView";
import useStore from "../../store";
import { doc, getDoc, onSnapshot } from "firebase/firestore"; // Import necessary Firestore functions and objects
import { dbFS } from "../../config/firebase";
import Space from "../../components/utils/Space";
import ForumCategoryCard from "../../components/Cards/ForumCategoryCard";
import assets from "../../assets/assets";
import ForumCategoryCardVertical from "../../components/Cards/FromCategoryCardVertical";
import Typo from "../../components/utils/Typo";
import RoundedSmallButton from "../../components/Buttons/RoundedSmallButton";

const cardData = [
  {
    id: 1,
    title: "WSL",
    subtitle: "Discuss professional surfing",
    buttonColor: "#FFD600", // Darker variant of color
    image: assets.wsl,
    color: "#FFF9C4", // Light background color
  },
  {
    id: 2,
    title: "Shape Tips",
    subtitle: "Discover fitness tips etc.",
    buttonColor: "#03ab2b", // Darker variant of color
    image: assets.shape,
    color: "#d1ffdc", // Light background color
  },
  {
    id: 3,
    title: "Local Spots",
    subtitle: "Find hidden gems around",
    buttonColor: "#ff5d24", // Darker variant of color
    image: assets.localspots,
    color: "#ffddd1", // Light background color (Sky Blue)
  },
  {
    id: 4,
    title: "Kookin Around",
    subtitle: "Explore cooking adventures",
    buttonColor: "#ff2b68", // Darker variant of color (Yellow Shade)
    image: assets.cookinaround,
    color: "#ffe3eb", // Light background color (Yellow Shade)
  },
  {
    id: 5,
    title: "Random Stuff",
    subtitle: "Discover a variety of topics",
    buttonColor: "#00796B", // Darker variant of color (Pink Shade)
    image: assets.randomstuff,
    color: "#E0F2F1", // Light background color (Pink Shade)
  },
];

function ForumsScreen({ navigation }) {
  const userData = useStore((state) => state.userData);
  const setUserData = useStore((state) => state.setUserData);
  const setAdBanners = useStore((state) => state.setAdBanners);
  const userID = useStore((state) => state.userID);
  const [isGridView, setIsGridView] = useState(true); // State to manage the toggle

  useEffect(() => {
    if (userID && !userData) {
      const userRef = doc(dbFS, "users", userID);

      const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setUserData(docSnapshot.data());
          console.log("First time user data retrieved", docSnapshot.data());
        }
      });

      return () => unsubscribe(); // Cleanup the subscription when the component unmounts
    }
  }, []);


  useEffect(() => {
    const loadAdBanner = async () => {
      try {
        const bannerRef = doc(dbFS, "adBanners", "adBanners");
        const bannerDoc = await getDoc(bannerRef);
        const bannerData = bannerDoc.data();
        setAdBanners(bannerData);
      } catch (error) {
        console.error("Error loading ad banner:", error);
      }
    };

    loadAdBanner();
  }, []);


  if (!userData) {
    return null;
  }

  function renderCards() {
    if (isGridView) {
      return (
        <View style={styles.gridContainer}>
          {cardData.map((card, index) => (
            <View style={{ width: "48%" }} key={index}>
              <ForumCategoryCardVertical
                key={card.id}
                buttonColor={card.buttonColor}
                title={card.title}
                subtitle={card.subtitle}
                image={card.image}
                data={card}
                color={card.color}
                handlePress={() =>
                  navigation.navigate("ForumDetails", {
                    item: card,
                  })
                }
              />
            </View>
          ))}
        </View>
      );
    } else {
      return cardData.map((card) => (
        <ForumCategoryCard
          key={card.id}
          buttonColor={card.buttonColor}
          title={card.title}
          subtitle={card.subtitle}
          image={card.image}
          data={card}
          color={card.color}
          handlePress={() =>
            navigation.navigate("ForumDetails", {
              item: card,
            })
          }
        />
      ));
    }
  }

  function handleToggleView() {
    setIsGridView((prev) => !prev); // Toggle the view
  }

  return (
    <View style={styles.container}>
      <CustomHeader
        image={userData.userImage ? userData.userImage : placeholder}
        label={`Greetings ${userData.userName}!`}
        rightIcon={isGridView ? "list" : "grid"} // Change icon based on the view mode
        rightIconPress={handleToggleView}
      />

      <Space space={5} />
      <CurveView style={{ paddingTop: 15, paddingHorizontal: 15 }}>
        <ImageBackground 
        source={require('../../assets/images/categories/postbg.png')}
        style={styles.add}>
        <View style={styles.info}>
        <Typo l bold>Looking to Post?</Typo>
        <Typo s grey>Get your convo started!</Typo>
        <Space space={5}/>
        <RoundedSmallButton
        color={"#007bff"}
        label={"Start a forum"}
        handlePress={()=>navigation.navigate("CreateForum")}
        />
        </View>
        </ImageBackground>
        <Space space={10} />
        {renderCards()}
      </CurveView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.secondaryColor,
  },
  card: {
    width: "100%",
    paddingHorizontal: 20,
  },
  promoCard: {
    height: 215,
    width: 160,
    borderRadius: 15,
    overflow: "hidden",
    marginLeft: 10,
  },
  titleBar: {
    marginTop: 10,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    width: "100%",
    marginTop: 10,
  },
  categoryItem: {
    height: "100%",
    width: "100%",
  },
  footer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  add: {
    width: "100%",
    borderRadius: 25,
    backgroundColor: "#d1fffc",
    height:125,
    overflow:'hidden'
  },
  info:{
    flex:1,
    alignItems:'flex-end',
    paddingHorizontal:20,
    justifyContent:'center'
  }
});

export default ForumsScreen;

const placeholder = "https://cdn-icons-png.flaticon.com/128/2202/2202112.png";
