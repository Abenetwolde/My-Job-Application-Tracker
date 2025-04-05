// app/(root)/(tabs)/editApplication.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, Pressable, KeyboardAvoidingView, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Application } from "../../types";
import { useUpdateApplication } from "../../api/fetchApplications";

export default function EditApplication() {
  const router = useRouter();
  const { item } = useLocalSearchParams();
  const parsedItem: Application = JSON.parse(item as string);
  const { mutate: updateApplication, isPending: isUpdating } = useUpdateApplication();

  // Form state for all fields
  const [companyName, setCompanyName] = useState(parsedItem["Company Name"]);
  const [jobTitle, setJobTitle] = useState(parsedItem["Job Title"]);
  const [type, setType] = useState(parsedItem.Type);
  const [location, setLocation] = useState(parsedItem.Location);
  const [from, setFrom] = useState(parsedItem.From);
  const [applicationDate, setApplicationDate] = useState<Date>(
    parsedItem["Application Date"]
      ? new Date(parsedItem["Application Date"])
      : new Date()
  );
  const [status, setStatus] = useState(parsedItem.Status);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const statuses = ["Approved", "Rejected", "Examined", "Pending"];

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios" ? false : showDatePicker); // Only close on iOS
    if (selectedDate && !isNaN(selectedDate.getTime())) {
      setApplicationDate(selectedDate);
    }
  };
  const showDatepicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: applicationDate||new Date(),
        onChange: handleDateChange,
        mode: "date",
        is24Hour: false,
      });
    } else {
      setShowDatePicker(true); // Show the inline picker on iOS
    }
  };

  const handleSubmit = () => {
    if (!companyName || !jobTitle || !type || !location || !from || !applicationDate) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const formattedDate = applicationDate?  applicationDate.toLocaleDateString() : null; // Format the date as needed

    const updatedApplication: Application = {
      ...parsedItem,
      "Company Name": companyName,
      "Job Title": jobTitle,
      Type: type,
      Location: location,
      From: from,
      // "Application Date": formattedDate||,
      Status: status,
    };

    updateApplication(updatedApplication, {
      onSuccess: () => {
        Alert.alert("Success", "Application updated successfully!");
        router.back();
      },
      onError: (error) => {
        Alert.alert("Error", `Failed to update application: ${error.message}`);
      },
    });
  };

  return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }} // Ensure it takes up the full screen
        >
    <View className="flex-1  bg-gray-100">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800">Edit Application</Text>
        <View className="w-6" /> {/* Spacer for alignment */}
      </View>
     

      {/* Form */}
           <ScrollView
                className="flex-1 "
                contentContainerStyle={{ paddingBottom: 170 }} // Add padding to the bottom
                keyboardShouldPersistTaps="handled" // Ensure taps work while keyboard is open
              >
      <View className="p-4 ">
        <View className="bg-white rounded-lg p-4 shadow-md">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Edit Application</Text>

          <View className="mb-3">
            <Text className="text-sm text-gray-500">Company Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mt-1 text-gray-700"
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="Enter company name"
            />
          </View>

          <View className="mb-3">
            <Text className="text-sm text-gray-500">Job Title</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mt-1 text-gray-700"
              value={jobTitle}
              onChangeText={setJobTitle}
              placeholder="Enter job title"
            />
          </View>

          <View className="mb-3">
            <Text className="text-sm text-gray-500">Type</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mt-1 text-gray-700"
              value={type}
              onChangeText={setType}
              placeholder="Enter type (e.g., Full-time)"
            />
          </View>

          <View className="mb-3">
            <Text className="text-sm text-gray-500">Location</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mt-1 text-gray-700"
              value={location}
              onChangeText={setLocation}
              placeholder="Enter location"
            />
          </View>

          <View className="mb-3">
            <Text className="text-sm text-gray-500">From</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mt-1 text-gray-700"
              value={from}
              onChangeText={setFrom}
              placeholder="Enter source (e.g., LinkedIn)"
            />
          </View>

          <View className="mb-3">
            <Text className="text-sm text-gray-500">Application Date</Text>
            <Pressable onPress={showDatepicker}>
              <View
                style={{
                  borderColor: "#333333",
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 8,
                  marginTop: 4,
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Text style={{ color: "#333333" }}>
                  {applicationDate?.toLocaleDateString() || "Select date"}
                </Text>
              </View>
            </Pressable>
            {showDatePicker && Platform.OS === "ios" && (
              <DateTimePicker
                testID="dateTimePicker"
                value={applicationDate||new Date()}
                mode="date"
                accentColor="#333333"
                textColor="#FFFFFF"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View className="mb-3">
            <Text className="text-sm text-gray-500">Status</Text>
            <View className="border border-gray-300 rounded-lg mt-1">
              <Picker
                selectedValue={status}
                onValueChange={(itemValue) => setStatus(itemValue)}
                style={{ height: 60 }}
              >
                {statuses.map((status) => (
                  <Picker.Item key={status} label={status} value={status} />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 8,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isUpdating ? "#D3D3D3" : "#333333",
            }}
            onPress={handleSubmit}
            disabled={isUpdating}
          >
            {isUpdating && <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />}
            <Text style={{ color: "#FFFFFF", textAlign: "center", fontWeight: "500" }}>
              {isUpdating ? "Updating..." : "Update Application"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>

    </KeyboardAvoidingView>
  );
}