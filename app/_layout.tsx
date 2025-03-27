

import { Stack } from 'expo-router';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Initialize QueryClient
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
<QueryClientProvider client={queryClient}>
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* <Stack.Screen
        name="details/[id]"
        options={{
          headerShown: false,
        }}
      /> */}
      {/* <Stack.Screen name="(auth)" options={{ headerShown: false }} /> */}
      <Stack.Screen name="(root)" options={{ headerShown: false }} /> 
      <Stack.Screen name="+not-found" />
    </Stack>
    </QueryClientProvider>
  );
}