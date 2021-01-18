import React, { useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
// import ImagePicker from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";

const Home = ({ navigation }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getAllImages = async () => {
      try {
        const res = await axios.get("http://13.233.119.146:5000/all_images");
        setPosts(res.data);
        // const data = res.json().location
      } catch (e) {
        console.log(e);
      }
    };
    getAllImages();
  }, []);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const savePost = async (imageInfo, imageItself) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        postdata: imageInfo,
      },
    };

    let localUri = imageItself;
    let filename = localUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();

    // Assume "photo" is the name of the form field the server expects
    formData.append("photo", {
      uri: localUri,
      name: filename,
      type,
    });
    const body = formData;

    try {
      const res = await axios.post(
        "http://13.233.119.146:5000/handlePost",
        body,
        config
      );
    } catch (e) {
      console.log(e);
      alert("Sorry your post was not saved try again");
      // Delete the post if their is any error in saving post
      let thePosts = posts.filter(
        (post) => post.imageUrl != posts[posts.length - 1].imageUrl
      );
      setPosts([...thePosts]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ margin: 3, backgroundColor: "gray" }}
        data={posts}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ textAlign: "center" }}
            onPress={() => navigation.navigate("Post", item)}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={{
                height: 340,
                width: 340,
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: 1,
                borderRadius: 5,
              }}
            />
            <View
              style={{
                height: 40,
                width: 340,
                borderBottomRightRadius: 5,
                borderBottomLeftRadius: 5,
                marginLeft: "auto",
                marginRight: "auto",
                backgroundColor: "white",
                marginBottom: 10,
              }}
            >
              <Text style={{ textAlign: "center", paddingTop: 7 }}>
                {item.postDescription}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Button
        onPress={() => {
          setModalOpen(true);
        }}
        title="Create Post"
      />
      <Modal visible={modalOpen} animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <AntDesign
              style={{
                fontSize: 30,
                marginRight: 15,
                marginLeft: "auto",
                marginTop: 15,
                marginBottom: 15,
              }}
              name="closecircle"
              size={24}
              color="black"
              onPress={() => {
                setText("");
                setImage(null);
                setModalOpen(false);
              }}
            />

            <View style={styles.imageContainer}>
              {image && (
                <>
                  <Image
                    source={{ uri: image }}
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
                    <TextInput
                      style={{
                        height: 40,
                        borderColor: "gray",
                        borderWidth: 1,
                      }}
                      placeholder="Describe image here"
                      onChangeText={(text) => setText(text)}
                      value={text}
                    />
                  </View>
                </>
              )}
            </View>
            <View style={{ padding: 20 }}>
              <Button onPress={pickImage} title="Upload/Choose image" />
              <Button
                style={{ marginTop: 10 }}
                onPress={() => {
                  if (!image) {
                    alert("Can't save because you haven't provided any Image");
                    setText("");
                    setImage(null);
                    setModalOpen(false);
                  } else {
                    savePost(text, image);
                    setPosts((prevPosts) => [
                      { postDescription: text, imageUrl: image },
                      ...prevPosts,
                    ]);
                    navigation.navigate("Post", {
                      postDescription: text,
                      imageUrl: image,
                    });
                    setText("");
                    setImage(null);
                    setModalOpen(false);
                  }
                }}
                title="Save"
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
