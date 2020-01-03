import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import FastImage from "react-native-fast-image";
import styles from "../screens/styles/A03Style";
import * as Utils from "../logic/utils";

const A03Item = props => {
  const { data, onPress } = props;
  const {
    name: title,
    cover: bookCover,
    author: authorName
  } = data;

 
  const percentRead =  0;
  const flexRead = 1
  const flexLeft = 1
 
  return (
    <View style={styles.itemWrapper}>
      <TouchableOpacity style={styles.itemTouch} onPress={onPress}>
        <View style={styles.contentWrap}>
          <View style={styles.imgWrap}>
            <FastImage
              style={styles.mainImage}
              source={{
                uri: bookCover || ""
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>

          <Text
            ellipsizeMode={"tail"}
            numberOfLines={3}
            style={styles.bookName}
          >
            {title} - {authorName}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default A03Item;
