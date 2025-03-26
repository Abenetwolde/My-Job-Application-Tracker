// app/(root)/(tabs)/details/[id].tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import { useApplications } from "../../api/fetchApplications";

const ApplicationDetail = () => {
  const { id } = useLocalSearchParams(); // Get the id from the URL
  const router = useRouter();
  const { data: applications, isLoading, error } = useApplications();

  // Find the application with the matching id
  const application = applications?.find((app) => app.id === id);

  if (isLoading) {
    return <Text className="text-center text-gray-500 mt-4">Loading...</Text>;
  }

  if (error || !application) {
    return (
      <Text className="text-center text-red-500 mt-4">
        {error ? `Error: ${(error as Error).message}` : "Application not found"}
      </Text>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800">Application Details</Text>
        <View className="w-6" /> {/* Spacer for alignment */}
      </View>

      {/* Details */}
      <ScrollView className="p-4">
        <View className="bg-white rounded-lg p-4 shadow-md">
          <Text className="text-xl font-semibold text-gray-800 mb-2">
            {application["Company Name"]}
          </Text>
          <View className="mb-3">
            <Text className="text-sm text-gray-500">Job Title</Text>
            <Text className="text-base text-gray-700">{application["Job Title"]}</Text>
          </View>
          <View className="mb-3">
            <Text className="text-sm text-gray-500">Type</Text>
            <Text className="text-base text-gray-700">{application.Type}</Text>
          </View>
          <View className="mb-3">
            <Text className="text-sm text-gray-500">Location</Text>
            <Text className="text-base text-gray-700">{application.Location}</Text>
          </View>
          <View className="mb-3">
            <Text className="text-sm text-gray-500">From</Text>
            <Text className="text-base text-gray-700">{application.From}</Text>
          </View>
          <View className="mb-3">
            <Text className="text-sm text-gray-500">Application Date</Text>
            <Text className="text-base text-gray-700">{application["Application Date"]}</Text>
          </View>
          <View className="mb-3">
            <Text className="text-sm text-gray-500">Status</Text>
            <View
              className={`inline-block px-3 py-1 rounded-full ${
                application.Status === "Pending"
                  ? "bg-gray-500"
                  : application.Status === "Approved"
                  ? "bg-green-500"
                  : application.Status === "Rejected"
                  ? "bg-red-500"
                  : application.Status === "Examined"
                  ? "bg-yellow-500"
                  : "bg-gray-500"
              }`}
            >
              <Text className="text-xs text-white font-medium">{application.Status}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ApplicationDetail;