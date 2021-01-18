import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Header = ({ navigation, title }) => {
  return (
    <View style={styles.header}>
      <Text>{title}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    alignItems: "center",
  },
});
