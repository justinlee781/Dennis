import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import HeaderTwoIcons from "../../components/Headers/HeaderTwoIcons";
import CurveView from "../../components/utils/CurveView";
import Theme from "../../src/Theme";
import Space from "../../components/utils/Space";
import ForumCard from "../../components/Cards/ForumCard";

function ForumDetails({ route }) {
  const { item } = route.params;

  const cardColor = item.color

  // Assuming you have forumData array with objects containing forum details
  const forumData = [
    {
      title: "Forum 1",
      description: "Description 1",
      postDate: "April 15, 2024",
      image:
        "https://plus.unsplash.com/premium_photo-1674667007034-abfeeba4127b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3VyZmluZ3xlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      title: "Forum 2",
      description: "Description 2",
      postDate: "April 16, 2024",
      image:
        "https://plus.unsplash.com/premium_photo-1672509995777-ede97d83c304?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3VyZmluZ3xlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      title: "Forum 2",
      description: "Description 2",
      postDate: "April 16, 2024",
      image:
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VyZmluZ3xlbnwwfHwwfHx8MA%3D%3D",
    },
    // Add more forum data as needed
  ];

  return (
    <View style={[styles.container,{
      backgroundColor:cardColor
    }]}>
      <HeaderTwoIcons
        rightIconName={"filter"}
        leftIcon={true}
        label={`${item.title}`}
      />
      <CurveView style={{ paddingHorizontal: 5 }}>

        <FlatList
          data={forumData}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <ForumCard
              title={item.title}
              description={item.description}
              postDate={item.postDate}
              image={item.image}
              cardColor={cardColor}
            />
          )}
        />
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

});
