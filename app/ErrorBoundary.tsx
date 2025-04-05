import React from "react";
import { View, Text } from "react-native";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error:any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Something went wrong: {this.state.error?.toString()}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;