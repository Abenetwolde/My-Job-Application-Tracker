
import { Redirect } from "expo-router";
import "../global.css";
const Page = () => {
  const isSignedIn =true;
console.log("...........................................yyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",isSignedIn);
  if (isSignedIn) return <Redirect href="/(root)/(tabs)/home" />;

  return <Redirect href="/(root)/(tabs)/profile" />;
};

export default Page;