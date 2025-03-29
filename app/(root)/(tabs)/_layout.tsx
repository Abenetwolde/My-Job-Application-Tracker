// app/(root)/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { View } from "react-native";
import { icons } from "../../../constants";
import Icon from "react-native-vector-icons/Feather";

const TabIcon = ({
  name,
  focused,
}: {
  name: string;
  focused: boolean;
}) => (
  <View
    style={{
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 50,
      marginBottom: 20,
      backgroundColor: focused ? "white" : "transparent",
      width: 50,
      height: 50,
    }}
  >
    <Icon
      name={name}
      size={30}
      color={focused ? "bg-gray-800" : "white"}
      // style={{ tintColor: "white" }}
    />
  </View>
);

export default function Layout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#333333",
          borderRadius: 50,
          overflow: "hidden",
          paddingHorizontal: 5,
          paddingVertical: 0,
          marginHorizontal: 20,
          marginBottom: 20,
          height: 60,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          position: "absolute",
          bottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          title: "Rides",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon name="list" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon name="user" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="details/[id]"
        options={{
          headerShown: false,
          href: null, // Hide this route from the tab bar
        }}
      />
         <Tabs.Screen
        name="editApplication/[item]"
        options={{
          headerShown: false,
          href: null, // Hide this route from the tab bar
        }}
      />
      <Tabs.Screen
        name="myApplication"
        options={{
          headerShown: false,
          href: null, // Hide this route from the tab bar
        }}
      />
    </Tabs>
  );
}