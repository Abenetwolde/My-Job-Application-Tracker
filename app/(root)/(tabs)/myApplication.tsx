// app/(root)/(tabs)/myApplication.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAddApplication } from "@/app/api/fetchApplications";

const MyApplication = () => {
  const router = useRouter();
  const { mutate: addApplication, isPending: isAdding } = useAddApplication();

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [from, setFrom] = useState("");
  const [applicationDate, setApplicationDate] = useState<Date | null>(null);
  const [status, setStatus] = useState("Pending");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const statuses = ["Approved", "Rejected", "Examined", "Pending"];

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios"); // Keep picker open on iOS until confirmed
    if (selectedDate) {
      setApplicationDate(selectedDate);
    }
  };

  const handleSubmit = () => {
    if (!companyName || !jobTitle || !type || !location || !from || !applicationDate) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const formattedDate = applicationDate.toISOString().split("T")[0]; // Format date as YYYY-MM-DD

    const newApplication = [
      companyName,
      jobTitle,
      type,
      location,
      from,
      formattedDate,
      status,
    ];

    addApplication(newApplication, {
      onSuccess: () => {
        Alert.alert("Success", "Application added successfully!");
        // Clear the form
        setCompanyName("");
        setJobTitle("");
        setType("");
        setLocation("");
        setFrom("");
        setApplicationDate(null);
        setStatus("Pending");
        router.back(); // Navigate back to the Home screen
      },
      onError: (error) => {
        Alert.alert("Error", `Failed to add application: ${error.message}`);
      },
    });
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800">Add Application</Text>
        <View className="w-6" />
      </View>

      {/* Form */}
      <ScrollView className="p-4">
        <View className="bg-white rounded-lg p-4 shadow-md">
          {/* Company Name */}
          <View className="mb-3">
            <Text className="text-sm text-gray-500">Company Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg mt-1 p-2 text-gray-700"
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="Enter company name"
            />
          </View>

          {/* Job Title */}
          <View className="mb-3">
            <Text className="text-sm text-gray-500">Job Title</Text>
            <TextInput
              className="border border-gray-300 rounded-lg mt-1 p-2 text-gray-700"
              value={jobTitle}
              onChangeText={setJobTitle}
              placeholder="Enter job title"
            />
          </View>

          {/* Type */}
          <View className="mb-3">
            <Text className="text-sm text-gray-500">Type</Text>
            <TextInput
              className="border border-gray-300 rounded-lg mt-1 p-2 text-gray-700"
              value={type}
              onChangeText={setType}
              placeholder="Enter type (e.g., Full-time)"
            />
          </View>

          {/* Location */}
          <View className="mb-3">
            <Text className="text-sm text-gray-500">Location</Text>
            <TextInput
              className="border border-gray-300 rounded-lg mt-1 p-2 text-gray-700"
              value={location}
              onChangeText={setLocation}
              placeholder="Enter location"
            />
          </View>

          {/* From */}
          <View className="mb-3">
            <Text className="text-sm text-gray-500">From</Text>
            <TextInput
              className="border border-gray-300 rounded-lg mt-1 p-2 text-gray-700"
              value={from}
              onChangeText={setFrom}
              placeholder="Enter source (e.g., LinkedIn)"
            />
          </View>

          {/* Application Date */}
          <View className="mb-3">
            <Text className="text-sm text-gray-500">Application Date</Text>
            <TouchableOpacity
              className="border border-gray-300 rounded-lg mt-1 p-2"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="text-gray-700">
                {applicationDate ? applicationDate.toISOString().split("T")[0] : "Select date"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={applicationDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={handleDateChange}
              />
            )}
          </View>

          {/* Status */}
          <View className="mb-3">
            <Text className="text-sm text-gray-500">Status</Text>
            <View className="border border-gray-300 rounded-lg mt-1">
              <Picker
                selectedValue={status}
                onValueChange={(itemValue) => setStatus(itemValue)}
                style={{ height: 44 }}
              >
                {statuses.map((status) => (
                  <Picker.Item key={status} label={status} value={status} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={`mt-4 p-3 rounded-lg flex-row justify-center items-center ${
              isAdding ? "bg-gray-400" : "bg-blue-500"
            }`}
            onPress={handleSubmit}
            disabled={isAdding}
          >
            {isAdding && <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />}
            <Text className="text-white text-center font-medium">
              {isAdding ? "Adding..." : "Add Application"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default MyApplication;