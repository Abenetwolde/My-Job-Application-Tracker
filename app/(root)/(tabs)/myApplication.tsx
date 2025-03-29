import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
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
    setShowDatePicker(false); // Close the picker on iOS after selection
    if (selectedDate) {
      setApplicationDate(selectedDate);
    }
  };

  const showDatepicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: applicationDate || new Date(),
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

    // const formattedDate = applicationDate.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    const formattedDate = formatDateToMMDDYYYY(applicationDate);
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
  const formatDateToMMDDYYYY = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
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
          <Text className="text-2xl font-bold text-gray-800">Add Application</Text>
          <View className="w-6" />
        </View>

        {/* Form */}
        <ScrollView
          className="flex-1 p-4"
          contentContainerStyle={{ paddingBottom: 170 }} // Add padding to the bottom
          keyboardShouldPersistTaps="handled" // Ensure taps work while keyboard is open
        >
          <View className="bg-white rounded-lg p-4 shadow-md">
            <Text className="text-lg font-semibold text-gray-800 mb-2">New Application</Text>

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
                    // borderColor: "#333333",
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 8,
                    marginTop: 4,
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <Text>
                  {applicationDate ? formatDateToMMDDYYYY(applicationDate) : "Select date"}
                  </Text>
                </View>
              </Pressable>
              {showDatePicker && Platform.OS === "ios" && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={applicationDate || new Date()}
                  mode="date"
                  accentColor="#333333"
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
                  style={{ height: 54 }}
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
                backgroundColor: isAdding ? "#D3D3D3" : "#333333",
              }}
              onPress={handleSubmit}
              disabled={isAdding}
            >
              {isAdding && <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />}
              <Text style={{ color: "#FFFFFF", textAlign: "center", fontWeight: "500" }}>
                {isAdding ? "Adding..." : "Add Application"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MyApplication;