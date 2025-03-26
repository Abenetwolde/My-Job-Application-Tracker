// components/FilterModal.tsx
import React from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import Icon from "react-native-vector-icons/Feather";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedStatuses: string[];
  onSelectStatus: (status: string) => void;
}

const statuses = ["Approved", "Rejected", "Examined", "Pending"];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  selectedStatuses,
  onSelectStatus,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/50" onPress={onClose}>
        <View className="absolute top-20 right-4 bg-white rounded-lg shadow-lg p-4 w-48">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Filter by Status
          </Text>
          {statuses.map((status) => (
            <TouchableOpacity
              key={status}
              className="flex-row items-center py-2"
              onPress={() => onSelectStatus(status)}
            >
              <View
                className={`w-5 h-5 mr-2 rounded border ${
                  selectedStatuses.includes(status)
                    ? "bg-gray-500 border-blue-500"
                    : "border-gray-300"
                }`}
              >
                {selectedStatuses.includes(status) && (
                  <Icon name="check" size={14} color="white" style={{ margin: 2 }} />
                )}
              </View>
              <Text className="text-gray-700">{status}</Text>
            </TouchableOpacity>
          ))}
          {/* <TouchableOpacity
            className="mt-4 p-2 bg-blue-500 rounded-lg"
            onPress={onClose}
          >
            <Text className="text-white text-center font-medium">Apply</Text>
          </TouchableOpacity> */}
        </View>
      </Pressable>
    </Modal>
  );
};