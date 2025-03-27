// app/(root)/(tabs)/details/[id].tsx
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import { useApplications, useUpdateApplicationStatus } from "@/app/api/fetchApplications";

const ApplicationDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: applications, isLoading, error: fetchError } = useApplications();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateApplicationStatus();

  const application = applications?.find((app) => app.id === id);
  const [selectedStatus, setSelectedStatus] = useState(application?.Status || "Pending");

  const statuses = ["Approved", "Rejected", "Examined", "Pending"];

  const handleUpdateStatus = () => {
    if (!application) return;

    const rowIndex = parseInt(id as string, 10);
    updateStatus(
      { rowIndex, newStatus: selectedStatus },
      {
        onSuccess: () => {
          Alert.alert("Success", "Status updated successfully!");
        },
        onError: (error) => {
          Alert.alert("Error", `Failed to update status: ${error.message}`);
        },
      }
    );
  };

  if (isLoading) {
    return <Text className="text-center text-gray-500 mt-4">Loading...</Text>;
  }

  if (fetchError || !application) {
    return (
      <Text className="text-center text-red-500 mt-4">
        {fetchError ? `Error: ${(fetchError as Error).message}` : "Application not found"}
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
        <View className="w-6" />
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
            <View className="border border-gray-300 rounded-lg mt-1">
              <Picker
                selectedValue={selectedStatus}
                onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                style={{ height: 50 }}
              >
                {statuses.map((status) => (
                  <Picker.Item key={status} label={status} value={status} />
                ))}
              </Picker>
            </View>
          </View>
          <TouchableOpacity
            className={`mt-4 p-3 rounded-lg ${
              isUpdating ? "bg-gray-400" : "bg-blue-500"
            }`}
            onPress={handleUpdateStatus}
            disabled={isUpdating}
          >
            <Text className="text-white text-center font-medium">
              {isUpdating ? "Updating..." : "Update Status"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ApplicationDetail;