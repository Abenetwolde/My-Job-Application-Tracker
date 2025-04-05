// app/(root)/(tabs)/home.tsx
import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Pressable, Modal } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
// import { useApplications } from "@/app/api/fetchApplications";
import { useApplications, useDeleteApplication } from "@/app/api/fetchApplications";
import { ApplicationListItem } from "../../components/ApplicationListItem";
import { FilterModal } from "../../components/FilterModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ErrorBoundary from "@/app/ErrorBoundary";

const Home = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const { mutate: deleteApplication, isPending: isDeleting } = useDeleteApplication();
  const { data: applications, isLoading, error: fetchError } = useApplications(
    searchQuery,
    selectedStatuses
  );

  const handleSelectStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedStatuses([]);
  };


  const handleDelete = (item: any) => {
    deleteApplication(item, {
      onSuccess: () => {
        console.log("Application deleted successfully");
      },
      onError: (error:any) => {
        console.error("Failed to delete application:", error.message);
      },
    });
  };
  const handleItemPress = (id: string) => {
    router.push(`/details/${id}`);
  };
  const handleFilterPress = () => {
    console.log("Filter button pressed"); // Debug log
    setFilterVisible(true);
  };
  return (
    <ErrorBoundary>

    <View className="flex-1 mb-30 bg-gray-100">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 bg-white">
        <Text className="text-2xl font-bold text-gray-800">
          All Applications
        </Text>
        <TouchableOpacity>
          <Icon name="settings" size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      {/* Search Bar, Filter, and Reset */}
      <View className="px-4 my-5">
        <View className="flex-row items-center">
          <Pressable
            className={`flex-row flex-1 items-center bg-white rounded-lg p-2 shadow-md border ${
              searchFocused ? "border-blue-500" : "border-gray-200"
            }`}
            onPressIn={() => setSearchFocused(true)}
            onPressOut={() => setSearchFocused(false)}
          >
            <Icon
              name="search"
              size={20}
              color={searchFocused ? "#3B82F6" : "#9CA3AF"}
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Company name"
              className="flex-1 text-gray-700"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </Pressable>
          <TouchableOpacity
            className="ml-2 p-4 bg-white rounded-lg shadow-md border border-gray-200 relative"
            onPress={handleFilterPress}
          >
            <Icon name="filter" size={24} color="#4B5563" />
            {selectedStatuses.length > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center">
                <Text className="text-white text-xs">{selectedStatuses.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        {(searchQuery || selectedStatuses.length > 0) && (
          <TouchableOpacity
            className="flex-row items-center mt-2 self-start"
            onPress={handleReset}
          >
            <Icon name="x-circle" size={20} color="#EF4444" />
            <Text className="ml-1 text-red-500">Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Modal */}
      {/* {filterVisible && (
          <FilterModal
            visible={filterVisible}
            onClose={() => {
              console.log("Closing modal"); // Debug log
              setFilterVisible(false);
            }}
            selectedStatuses={selectedStatuses||[]}
            onSelectStatus={handleSelectStatus||(() => {})}
          />
        )} */}
        {filterVisible && (
          <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center">
            <FilterModal
              visible={filterVisible}
              onClose={() => {
                console.log("Closing modal"); // Debug log
                setFilterVisible(false);
              }}
              selectedStatuses={selectedStatuses}
              onSelectStatus={handleSelectStatus}
            />
          </View>
        )}



      {/* Applications Count and Add Button */}
      <View className="flex-row justify-between items-center px-4 mb-3">
        <Text className="text-sm text-gray-500">
          {applications?.length || 0} applications found
        </Text>
        <TouchableOpacity
          className="px-4 py-2 bg-gray-800 rounded-lg border border-blue-600 shadow-md"
          onPress={() => router.push("/myApplication")}
        >
          <Text className="text-white font-medium">
            <Icon name="plus" size={16} color="white" /> Add
          </Text>
        </TouchableOpacity>
      </View>

      {/* Applications List */}
      {isLoading ? (
        <Text className="text-center text-gray-500 mt-4">Loading...</Text>
      ) : fetchError ? (
        <Text className="text-center text-red-500 mt-4">
          Error: {(fetchError as Error).message}
        </Text>
      ) : (

        <FlatList
        key={`${selectedStatuses.join(',')}-${searchQuery}`}
          data={applications}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemPress(item?.id)} >
         <ApplicationListItem item={item} onDelete={handleDelete} isDeleting={isDeleting} isModalVisible={filterVisible}/>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item?.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
        />
    
          )
          }
      
    </View>
    </ErrorBoundary>

  );
};

export default Home;