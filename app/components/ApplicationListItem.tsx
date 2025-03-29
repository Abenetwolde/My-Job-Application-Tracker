// components/ApplicationListItem.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Application } from "../types";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/Feather";
import { useRouter } from "expo-router";

interface ApplicationListItemProps {
  item: Application;
  onDelete: (item: Application) => void; 
  isDeleting:boolean// Callback for deleting the item
}

export const ApplicationListItem: React.FC<ApplicationListItemProps> = ({
  item,
  onDelete,
  isDeleting=false, // Flag to indicate if the item is being deleted
}) => {
  const router = useRouter();

  // Function to handle the Edit action
  const handleEdit = () => {
    router.push({
      pathname: "/editApplication",
      params: { item: JSON.stringify(item) }, // Pass the item to the edit screen
    });
  };

  // Function to handle the Delete action
  const handleDelete = () => {
    if (!isDeleting) { // Prevent multiple delete attempts
      onDelete(item);
    }
  };

  // Render the right actions (Edit and Delete) with animation
  const RightActions = (prog: SharedValue<number>, drag: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + 170 }], // Adjust based on the total width of the actions
      };
    });

    return (
      <Reanimated.View style={[styles.rightActionsContainer, styleAnimation]}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Icon name="edit" size={30} color="orange" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        {isDeleting ? (
            <ActivityIndicator size="small" color="blue" />
          ) : (
            <>
              <Icon name="trash-2" size={30} color="red" />
              <Text style={styles.actionText}>Delete</Text>
            </>
          )}
       
        </TouchableOpacity>
      </Reanimated.View>
    );
  };

  return (
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        containerStyle={styles.swipeable}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={RightActions}
      >
        <View
          className={`flex-row justify-between items-center p-4 bg-white rounded-lg   mb-2`}
        >
          {/* Left Section: Company Name, Job Title, From */}
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800">
              {item["Company Name"]}
            </Text>
            <Text className="text-sm text-gray-500">{item["Job Title"]}</Text>
            <Text className="text-sm text-gray-500">{item["From"]}</Text>
          </View>

          {/* Right Section: Status and Date */}
          <View className="flex-col items-end">
            {/* Status with a gap */}
            <View
              className={`px-3 py-1 rounded-full mb-2 ${
                item.Status === "Pending"
                  ? "bg-gray-500"
                  : item.Status === "Approved"
                  ? "bg-green-500"
                  : item.Status === "Rejected"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            >
              <Text className="text-xs text-white font-medium">{item.Status}</Text>
            </View>

            {/* Date at the bottom-right */}
            <Text className="text-xs pt-3 text-gray-400">
              {item["Application Date"]}
            </Text>
          </View>
        </View>
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  swipeable: {
    padding: 0,
    margin: 0,
    borderRadius: 8,
    backgroundColor: "white",
    overflow: "hidden",
   shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,


    borderColor: "#E5E7EB", // Tailwind's gray-200
    borderWidth: 1,
     marginBottom: 8, // Match the mb-2 from Tailwind
  },
  rightActionsContainer: {
    backgroundColor: "white",
  borderLeftColor:"gray", // Tailwind's gray-200
borderTopLeftRadius: 8,
borderBottomLeftRadius: 8,
    borderLeftWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  editButton: {
    // backgroundColor: "#333333", // Your primary color
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    // padding: 5,
  },
  deleteButton: {
    // backgroundColor: "#FF3B30", // Red for delete
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    // padding: 5,
  },
  actionText: {
    color: "gray", // White text for actions
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
});