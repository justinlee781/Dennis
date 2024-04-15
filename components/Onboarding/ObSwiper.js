import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, Dimensions } from 'react-native';

import Theme from '../../src/Theme';

const windowWidth = Dimensions.get('window').width;

function ObSwiper({data, onSlideChange }) {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);


  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.imageWrapper}>
        <Image style={styles.mainImg} source={item.image} />
      </View>
    </View>
  );

  const onFlatlistScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / windowWidth);
    setCurrentIndex(index);
    if (onSlideChange) {
      onSlideChange(index);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onFlatlistScroll}
      />
      <View style={styles.paginationContainer}>
        {data.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.paginationDot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

export default ObSwiper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width: windowWidth,
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImg: {
    height: '92%',
    width: '86%',
    borderRadius:15
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: Theme.primaryColor,
    borderRadius:100
  },
});