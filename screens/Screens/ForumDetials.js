import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import HeaderTwoIcons from "../../components/Headers/HeaderTwoIcons";
import CurveView from "../../components/utils/CurveView";
import Theme from "../../src/Theme";
import LottieView from "lottie-react-native";
import ForumCard from "../../components/Cards/ForumCard";
import { collection, getDocs } from "firebase/firestore";
import { dbFS } from "../../config/firebase";
import Typo from "../../components/utils/Typo";

function ForumDetails({ route,navigation }) {
  const { item } = route.params;
  const [forumData, setForumData] = useState([]);
  const [loading, setLoading] = useState(true);

  const cardColor = item.color;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const forumRef = collection(dbFS, "forums","forums",item.title);
        const querySnapshot = await getDocs(forumRef);
        const data = [];
        querySnapshot.forEach((doc) => {
          // Assuming each document contains fields: title, description, postDate, image, color
          const forumItem = {
            id: doc.id,
            ...doc.data(),
          };
          data.push(forumItem);
        });
        setForumData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching forum data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to ensure useEffect only runs once

  return (
    <View style={[styles.container, { backgroundColor: cardColor }]}>
      <HeaderTwoIcons
        rightIconName={"plus"}
        leftIcon={true}
        label={`${item.title}`}
        handleRightIconPress={()=>navigation.navigate("CreateForum")}
      />
   <CurveView style={{ paddingHorizontal: 5 }}>
        {loading ? (
          <ActivityIndicator size="large" color={Theme.primaryColor} />
        ) : (
          <>
            {forumData.length === 0 ? (
              <View style={styles.emptyStateContainer}>
              <LottieView
                source={require("../../assets/empty.json")}
                style={styles.emptyStateAnimation}
                autoPlay
              />
              <Typo xl>No Forums! Nothing here!</Typo>
              <Typo grey style={styles.emptyStateText}>
                Seems like there are no Forums yet.
              </Typo>
            </View>
            ) : (
              <FlatList
                data={forumData}
                keyExtractor={(gg) => gg.id}
                numColumns={2}
                renderItem={({ item }) => (
                  <ForumCard
                    title={item.title}
                    description={item.description}
                    postDate={item.postDate}
                    image={item.image}
                    cardColor={cardColor}
                    handlePress={()=>navigation.navigate("ForumInside",{
                      item,
                      cardColor,
                      forumDetails:route.params.item,
                    })}
                  />
                )}
              />
            )}
          </>
        )}
      </CurveView>
    </View>
  );
}

export default ForumDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.secondaryColor,
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
