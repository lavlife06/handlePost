import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Post from "../screens/Post";
import Home from "../screens/Home";
import Header from "../shared/Header";
// import { createAppContainer } from "react-navigation";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

const PostStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={({ navigation, route }) => ({
            headerTitle: (props) => (
              <Header {...props} navigation={navigation} title="Home" />
            ),
          })}
          component={Home}
        />
        <Stack.Screen
          name="Post"
          options={({ navigation, route }) => ({
            headerTitle: (props) => (
              <Header
                {...props}
                navigation={navigation}
                title="Post"
                type="Post"
              />
            ),
          })}
          component={Post}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// const PostStack = createAppContainer(PostStackFunc);

export default PostStack;
