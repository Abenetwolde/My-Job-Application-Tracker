import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: true, // Reanimated runs in strict mode by default
});
const Layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="book-ride"
        options={{
          headerShown: false,
        }}
      />
               <Stack.Screen
        name="details/[id]"
        options={{
          headerShown: false,
        }}
      />
 
    </Stack>
    </GestureHandlerRootView>
  );
};

export default Layout;
