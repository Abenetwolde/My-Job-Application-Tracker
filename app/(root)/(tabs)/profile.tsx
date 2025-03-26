
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const Profile = () => {
   const [data, setData] = useState<string[][]>([]);
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     const fetchData = async () => {
       try {
         const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets/1752f5mkUjRWeAvPpldHwRmPIq_pwwbH2TxzXr2hM1Vc/values/Sheet1!A1:D10?key=AIzaSyB4Z8J97dJme_bKo4GWN8Bx8Kc5HmuxdYg');
         const result:any = await response.json();
         const filteredData = result.values.filter(row => row[2] === 'Remote'); // Assuming the job type is in the third column
         setData(filteredData);
         setLoading(false);
       } catch (error) {
         console.error('Error fetching data:', error);
         setLoading(false);
       }
     };
 
     fetchData();
   }, []);
  return (
  <View className="flex-1 items-center justify-center bg-white">
          <Text className="text-blue-500 mb-4">Open up App.tsx to start working on your app!</Text>
          {loading ? (
            <Text>Loading data...</Text>
          ) : (
            data.map((row, rowIndex) => (
              <View key={rowIndex} className="flex-row mb-2">
                {row.map((cell, cellIndex) => (
                  <Text key={cellIndex} className=" text-red-300 mr-2">{cell}</Text>
                ))}
              </View>
            ))
          )}
          <StatusBar style="auto" />
        </View>
  );
};

export default Profile;
