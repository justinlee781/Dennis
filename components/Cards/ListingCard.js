import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
} from "react-native";
import Theme from "../../src/Theme";
import { Feather } from "@expo/vector-icons";
import Typo from "../utils/Typo";
import Space from "../utils/Space";
import { ImageGallery } from "@georstat/react-native-image-gallery";
import Swiper from "react-native-swiper";
import RoundedSmallButtonStroke from "../Buttons/RoundedSmallButtonStroke";

function ListingCard({
  mainTag,
  images,
  adPrice,
  adTitle,
  adDescription,
  postedBy,
  postedByProfilePic,
  postedDate,
  category,
  dimensions,
  location
}) {
  const [showMore, setShowMore] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const openGallery = () => setIsOpen(true);
  const closeGallery = () => setIsOpen(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const formattedImages = images ? images.map((url) => ({ url })) : [];

  function formatTimestamp(timestamp) {
    const eventDate = timestamp.toDate();
    return eventDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }

  return (
    <View style={[styles.container, styles.shadowProp]}>
      <View style={styles.infoHolder}>
        <View style={Theme.align}>
          <View style={styles.circle}>
            <Image
              source={{
                uri: postedByProfilePic ? postedByProfilePic : placeholder,
              }}
              style={{ height: 40, width: 40, borderRadius: 100 }}
            />
          </View>
          <View style={{ flex: 1, paddingHorizontal: 12 }}>
            <Typo style={{textTransform:"capitalize"}} bold>{postedBy}</Typo>
            <Typo style={{ color: Theme.primaryColor }} s grey>
             Posting in {category}
            </Typo>
          </View>
          {mainTag ? (
            <View style={styles.tag}>
              <Typo s white>
                {mainTag}
              </Typo>
            </View>
          ) : mainTag === "PREVIEW" ? null : (
            <RoundedSmallButtonStroke
              icon={"message-square"}
              label={"Message"}
              color={Theme.primaryColor}
            />
          )}
        </View>
      </View>
      <View style={styles.contentHolder}>
        <Typo bold>{adTitle}</Typo>
        <Space space={2} />
        {/* Display only 2 lines of description */}
        <Typo light numberOfLines={showMore ? undefined : 2} grey>
          {adDescription}
        </Typo>

        {/* Toggle button for Read More / Read Less */}
        {adDescription && adDescription.length > 120 && (
          <TouchableOpacity onPress={toggleShowMore}>
            <Typo bold grey link>
              {showMore ? "Read Less" : "Read More"}
            </Typo>
          </TouchableOpacity>
        )}

        {images ? <Space space={6} /> : null}

        <View style={styles.imageWrapper}>
          {images ? (
            <Swiper
              style={{
                height: 200,
                borderRadius: 10,
              }}
              activeDotColor={"white"}
              autoplay={true}
              containerStyle={{ borderRadius: 10 }}
              contentContainerStyle={{ borderRadius: 10 }}
              paginationStyle={{ bottom: 10 }}
              autoplayTimeout={4}
            >
              {images.map((item, index) => {
                return (
                  <Pressable key={index} onPress={openGallery}>
                    <Image
                      key={index}
                      style={styles.houseimage}
                      source={{ uri: item }}
                    />
                  </Pressable>
                );
              })}
            </Swiper>
          ) : null}

          <ImageGallery
            close={closeGallery}
            isOpen={isOpen}
            images={formattedImages}
            renderHeaderComponent={() => (
              <SafeAreaView style={{ marginTop: 35 }}>
                <TouchableOpacity
                  onPress={closeGallery}
                  style={{
                    width: "100%",
                    alignItems: "flex-end",
                    paddingRight: 25,
                    marginTop: 10,
                  }}
                >
                  <Feather name="x" size={30} color="white" />
                </TouchableOpacity>
              </SafeAreaView>
            )}
          />

          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              flexWrap: "wrap",
              gap: 4,
            }}
          >
          <View style={styles.feature}>
            <Typo  style={{ color: Theme.primaryColor }}>
              Category
            </Typo>
            <Typo>{category}</Typo>
          </View>
          <View style={styles.feature}>
            <Typo  style={{ color: Theme.primaryColor }}>
             Dimensions
            </Typo>
            <Typo>{dimensions}</Typo>
          </View>
          <View style={styles.feature}>
            <Typo  style={{ color: Theme.primaryColor }}>
             Your Location
            </Typo>
            <Typo>{location}</Typo>
          </View>
        </View>

        
        </View>
        <Space space={15} />
        <View style={styles.aligner}>
          <View style={styles.alignx}>
            <Feather name="dollar-sign" size={20} color={Theme.primaryColor} />
            <View style={{ paddingLeft: 5 }}>
              <Typo l bold>
                ₹{" "}
                {adPrice &&
                  adPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}
              </Typo>
            </View>
          </View>

          {postedDate ? (
            <View style={[styles.alignx, { paddingLeft: 10 }]}>
              <Feather name="calendar" size={20} color={Theme.primaryColor} />
              <View style={{ paddingLeft: 5 }}>
                <Typo l light>
                  {formatTimestamp(postedDate)}
                </Typo>
              </View>
            </View>
          ) : null}
        </View>

      </View>
    </View>
  );
}
export default ListingCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
  },
  infoHolder: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Theme.containerGrey,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: Theme.borderColor,
  },
  contentHolder: {
    padding: 15,
    backgroundColor: Theme.containerGrey,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  circle: {
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  tag: {
    backgroundColor: Theme.primaryColor,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 8,
  },
  aligner: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopColor: Theme.borderColor,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  alignx: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
  },
  imageWrapper: {
    marginTop: 10,
  },
  houseimage: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
  },
  extraImage: {
    backgroundColor: "black",
    borderRadius: 20,
    overflow: "hidden",
  },
  feature: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Theme.borderColor,
    backgroundColor: "white",
    borderRadius: 10,
  },
});
const placeholder = "https://cdn-icons-png.flaticon.com/128/2202/2202112.png"