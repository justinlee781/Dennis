import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ImageBackground,
} from "react-native";
import Theme from "../../src/Theme";
import HeaderTwoIcons from "../../components/Headers/HeaderTwoIcons";
import CurveView from "../../components/utils/CurveView";
import ProductCard from "../../components/Cards/ProductCard";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { dbFS } from "../../config/firebase";
import Typo from "../../components/utils/Typo";
import LottieView from "lottie-react-native";
import FullButton from "../../components/Buttons/FullButton";
import InputBox from "../../components/utils/InputBox";
import Space from "../../components/utils/Space";

const firebg = require("../../assets/images/detailbg/firebg.jpg");
const islandbg = require("../../assets/images/detailbg/islandbg.jpg");
const jsbg = require("../../assets/images/detailbg/jsbg.jpg");
const otherbg = require("../../assets/images/detailbg/otherbg.jpg");
const surfboardbg = require("../../assets/images/detailbg/surfboardbg.jpg");

function CategoryDetail({ navigation, route }) {
  const { item } = route.params;
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(dbFS, "categories", "categories", item.collectionReference),
      (querySnapshot) => {
        const fetchedDocuments = querySnapshot.docs
          .filter((doc) => !doc.data().sold) // Filter out documents where "sold" is true
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        setDocuments(fetchedDocuments);
        console.log(fetchedDocuments);
        setLoading(false);
      }
    );

    // Return cleanup function to unsubscribe when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size={"large"} color={Theme.primaryColor} />
      </View>
    );
  }

  const getImageSource = (label) => {
    switch (label) {
      case "Firewire":
        return firebg;
      case "JS Industries":
        return jsbg;
      case "Channel Islands":
        return islandbg;
      case "Lost Surfboards":
        return surfboardbg;
      case "Other":
        return otherbg;
      default:
        return firebg;
    }
  };

  return (
    <ImageBackground
    source={getImageSource(item.label)}
      style={styles.container}
    >
      <HeaderTwoIcons
        rightIconName={"filter"}
        leftIcon={true}
        label={`${item.label}`}
        rightIcon={true}
      />
      <View style={{ paddingHorizontal: 15, paddingBottom: 10 }}>
        <InputBox leftIcon={"search"} placeholder={"Search"} />
      </View>
      <CurveView>
        <View style={styles.cardsContainer}>
          {documents.length > 0 ? (
            documents.map((doc, index) => (
              <View key={index} style={styles.cardWrapper}>
                <ProductCard
                  price={doc.adPrice}
                  img={doc.images[0]}
                  title={doc.adTitle}
                  postDate={doc.postedDate}
                  brand={doc.brand}
                  handleImagePress={() =>
                    navigation.replace("ProductDetail", { item: doc })
                  }
                />
              </View>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <LottieView
                source={require("../../assets/empty.json")}
                style={styles.emptyStateAnimation}
                autoPlay
              />
              <Typo xl>Woopsie! Nothing here!</Typo>
              <Typo grey style={styles.emptyStateText}>
                Seems like there are no listings yet. Try exploring some other
                category.
              </Typo>
              <Space space={25} />
              <FullButton
                handlePress={() => navigation.goBack()}
                color={Theme.primaryColor}
                label={"Explore More Categories"}
              />
            </View>
          )}
        </View>
      </CurveView>
    </ImageBackground>
  );
}

export default CategoryDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 5,
    marginBottom: 10,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#f8f8f8",
    marginRight: 5,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  selectedTag: {
    backgroundColor: Theme.primaryColor,
    borderWidth: 0,
  },
  cardsContainer: {
    paddingHorizontal: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  cardWrapper: {
    width: "48%",
    borderRadius: 12,
    marginTop: 5,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  emptyStateAnimation: {
    height: 220,
    width: 160,
  },
  emptyStateText: {
    textAlign: "center",
  },
});
