// app/(root)/(tabs)/dashboard.tsx
import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { useApplications } from "../../api/fetchApplications";
import { PieChart, BarChart, LineChart } from "react-native-gifted-charts";
import { Application } from "../../types";

const { width } = Dimensions.get("window");

const Dashboard = () => {
  const { data: applications, isLoading, error } = useApplications("", []); // Fetch all applications

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500 text-lg">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg">Error: {(error as Error).message}</Text>
      </View>
    );
  }

  // Data processing for visualizations
  const statusData = processStatusData(applications || []);
  const typeData = processTypeData(applications || []);
  const dateData = processDateData(applications || []);
  const locationData = processLocationData(applications || []);

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <Text className="text-2xl font-bold text-center my-4 text-gray-800">Dashboard</Text>

      {/* Single-column Layout */}
      <View className="flex-col px-4">
        {/* Pie Chart: Status Distribution */}
        <View className="w-full bg-white rounded-lg shadow-md p-4 mb-4 items-center">
          <Text className="text-lg font-semibold mb-2 text-gray-800">Application Status</Text>
          <PieChart
            data={statusData}
            donut
            radius={width * 0.35} // Larger radius for full width
            innerRadius={width * 0.2}
            centerLabelComponent={() => (
              <Text className="text-2xl font-bold text-gray-800">{applications?.length || 0}</Text>
            )}
            textSize={12}
          />
          <View className="flex-row flex-wrap justify-center mt-2">
            {statusData.map((item, index) => (
              <Text key={index} className="text-sm mx-2 text-gray-600">
                <Text style={{ color: item.color }}>■</Text> {item.label}: {item.value}
              </Text>
            ))}
          </View>
        </View>

        {/* Bar Chart: Applications by Type */}
        <View className="w-full bg-white rounded-lg shadow-md p-4 mb-4 items-center">
          <Text className="text-lg font-semibold mb-2 text-gray-800">Applications by Type</Text>
          <BarChart
            data={typeData}
            width={width * 0.8} // Full width minus padding
            height={200}
            barWidth={50}
            spacing={30}
            noOfSections={5}
            yAxisLabelWidth={40}
            yAxisTextStyle={{ fontSize: 12 }}
            xAxisTextStyle={{ fontSize: 12 }}
            maxValue={Math.max(...typeData.map((d) => d.value)) + 1 || 10}
          />
          <View className="flex-row flex-wrap justify-center mt-2">
            {typeData.map((item, index) => (
              <Text key={index} className="text-sm mx-2 text-gray-600">
                <Text style={{ color: item.frontColor }}>■</Text> {item.label}: {item.value}
              </Text>
            ))}
          </View>
        </View>
        <View className="w-full bg-white rounded-lg shadow-md p-4 mb-4 items-center">
          <Text className="text-lg font-semibold mb-2 text-gray-800">Location Distribution</Text>
          <PieChart
            data={locationData}
            donut
            radius={width * 0.35} // Larger radius for full width
            innerRadius={width * 0.2}
            centerLabelComponent={() => (
              <Text className="text-2xl font-bold text-gray-800">{applications?.length || 0}</Text>
            )}
            textSize={12}
          />
          <View className="flex-row flex-wrap justify-center mt-2">
            {locationData.map((item, index) => (
              <Text key={index} className="text-sm mx-2 text-gray-600">
                <Text style={{ color: item.color }}>■</Text> {item.label}: {item.value}
              </Text>
            ))}
          </View>
        </View>
        {/* Line Chart: Applications Over Time */}
        <View className="w-full bg-white rounded-lg shadow-md p-4 mb-4 items-center">
          <Text className="text-lg font-semibold mb-2 text-gray-800">Applications Over Time</Text>
          <LineChart
            data={dateData}
            width={width * 0.8} // Full width minus padding
            height={200}
            spacing={60}
            noOfSections={5}
            yAxisLabelWidth={40}
            yAxisTextStyle={{ fontSize: 12 }}
            xAxisTextStyle={{ fontSize: 12 }}
            curved
            maxValue={Math.max(...dateData.map((d) => d.value)) + 1 || 10}
          />
          {/* <View className="flex-row flex-wrap justify-center mt-2">
            {dateData.map((item, index) => (
              <Text key={index} className="text-sm mx-2 text-gray-600">
                <Text style={{ color: item.color }}>■</Text> {item.label}: {item.value}
              </Text>
            ))}
          </View> */}
        </View>

        {/* Pie Chart: Location Distribution */}
      
      </View>
    </ScrollView>
  );
};

// Data Processing Functions
const processStatusData = (applications: Application[]) => {
  const statusCount = applications.reduce((acc, app) => {
    acc[app.Status] = (acc[app.Status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(statusCount).map(([status, value], index) => ({
    value,
    label: status,
    color: getColor(index),
  }));
};

const processTypeData = (applications: Application[]) => {
  const typeCount = applications.reduce((acc, app) => {
    acc[app.Type] = (acc[app.Type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(typeCount).map(([type, value], index) => ({
    value,
    label: type,
    frontColor: getColor(index),
  }));
};

const processDateData = (applications: Application[]) => {
  const dateCount = applications.reduce((acc, app) => {
    const date = app["Application Date"].split("/").slice(0, 2).join("/"); // MM/DD format
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(dateCount).map(([date, value], index) => ({
    value,
    label: date,
    color: getColor(0), // Single color for line
  }));
};

const processLocationData = (applications: Application[]) => {
  const locationCount = applications.reduce((acc, app) => {
    acc[app.Location] = (acc[app.Location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(locationCount).map(([location, value], index) => ({
    value,
    label: location,
    color: getColor(index),
  }));
};

const getColor = (index: number) => {
  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];
  return colors[index % colors.length];
};

export default Dashboard;