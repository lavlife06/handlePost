import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

const Post = ({ navigation, route }) => {
  const { postDescription, imageUrl } = route.params;
  return (
    <View style={{ flex: 1 }}>
      <Image
        source={{ uri: imageUrl }}
        style={{
          height: 400,
          width: "90%",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 1,
          borderRadius: 5,
        }}
      />
      <View
        style={{
          height: 40,
          width: "90%",
          borderRadius: 5,
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: "white",
          marginBottom: 10,
        }}
      >
        <Text style={{ textAlign: "center" }}>{postDescription}</Text>
      </View>
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({});
