import React from "react";
import { ActivityIndicator, View, Text } from "react-native";
import styles from "../../screens/styles/A10Style";
import * as constants from "../../logic/constants";

const A10Footer = props => {
  const { isFetching, data, error, connecting } = props;
  if (!connecting) {
    return (
      <View style={{ paddingVertical: 10 }}>
        <Text style={styles.emptyText}>{constants.CONNECTION_FAIL}</Text>
      </View>
    );
  } else if (isFetching) {
    return (
      <ActivityIndicator
        size={"large"}
        style={{ color: "#000", marginVertical: 10 }}
      />
    );
  } else if (!isFetching && data && data.length === 0) {
    return (
      <View style={{ paddingVertical: 10 }}>
        <Text style={styles.emptyText}>Cuốn sách này chưa có nội dung đọc</Text>
      </View>
    );
  } else if (error) {
    return (
      <View style={{ paddingVertical: 10 }}>
        <Text style={styles.emptyText}>Có lỗi xảy ra</Text>
      </View>
    );
  } else {
    return null;
  }
};

export default A10Footer;
