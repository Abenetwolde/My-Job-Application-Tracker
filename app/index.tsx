
import { Redirect } from "expo-router";
import "../global.css";
import { enableLayoutAnimations } from 'react-native-reanimated';
import { LogBox } from 'react-native';

// Add this in your app initialization
LogBox.ignoreLogs([
  'Reading from `value` during component render',
]);
enableLayoutAnimations(false); //
const Page = () => {
  const isSignedIn =true;
console.log("...........................................yyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",isSignedIn);
  if (isSignedIn) return <Redirect href="/(root)/(tabs)/home" />;

  return <Redirect href="/(root)/(tabs)/profile" />;
};

export default Page;