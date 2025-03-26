// components/ApplicationListItem.tsx
import React from "react";
import { View, Text } from "react-native";
import { Application } from "../types";

interface ApplicationListItemProps {
  item: Application;
}

export const ApplicationListItem: React.FC<ApplicationListItemProps> = ({
  item,
}) => {
  return (
    <View
      className={`flex-row justify-between items-center p-4 bg-white rounded-lg border border-gray-200 mb-2 shadow-sm`}
    >
      <View>
        <Text className="text-lg font-semibold text-gray-800">
          {item["Company Name"]}
        </Text>
        <Text className="text-sm text-gray-500">{item["Job Title"]}</Text>
        <Text className="text-xs text-gray-400">{item["Application Date"]}</Text>
      </View>
      <View
        className={`px-3 py-1 rounded-full ${
          item.Status === "Pending"
            ? "bg-gray-500"
            : item.Status === "Accepted"
            ? "bg-green-500"
            : item.Status === "Rejected"
            ? "bg-red-500"
            : "bg-yellow-500"
        }`}
      >
        <Text className="text-xs text-white font-medium">{item.Status}</Text>
      </View>
    </View>
  );
};