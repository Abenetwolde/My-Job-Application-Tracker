// api/auth.ts
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useState, useEffect } from "react";

// Configure WebBrowser for authentication
WebBrowser.maybeCompleteAuthSession();

// OAuth 2.0 configuration
const clientId = "1028216120660-pdv8n4ucno16ne9npjl5qfe9k1ssbn9b.apps.googleusercontent.com"; // Replace with your OAuth 2.0 Client ID
const redirectUri = AuthSession.makeRedirectUri({
  scheme: "myapp",
  path: "auth",
});
console.log("Redirect URI:", redirectUri);
const authUrl = "https://accounts.google.com/o/oauth2/v2/auth";
const tokenUrl = "https://oauth2.googleapis.com/token";
const scopes = ["https://www.googleapis.com/auth/spreadsheets"];

// Discovery document for token exchange
const discovery = {
  authorizationEndpoint: authUrl,
  tokenEndpoint: tokenUrl,
};

// Hook to handle OAuth 2.0 authentication
export const useGoogleAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      redirectUri,
      scopes,
      responseType: "code",
      extraParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
    discovery
  );

  useEffect(() => {
    console.log("Redirect URI:", redirectUri);
    console.log("Auth request:", request);
    console.log("Auth response:", response);

    if (response?.type === "success") {
      const { code } = response.params;
      console.log("Authorization code:", code);
      exchangeCodeForToken(code);
    } else if (response?.type === "error") {
      setError(response.error?.message || "Authentication failed");
      console.error("Auth error:", response.error);
    } else if (response?.type === "dismiss") {
      setError("Authentication dismissed by user");
      console.log("User dismissed the authentication");
    }
  }, [response]);

  const exchangeCodeForToken = async (code: string) => {
    try {
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId,
          redirectUri,
          code,
          extraParams: {
            client_secret: "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", // Replace with your OAuth 2.0 Client Secret
          },
        },
        discovery
      );
      setAccessToken(tokenResponse.accessToken);
      setError(null);
    } catch (err) {
      setError("Failed to exchange code for token");
      console.error("Error exchanging code for token:", err);
    }
  };

  const signIn = async () => {
    console.log("Signing in...");
    if (!request) {
        console.log("Signing in...1");
      setError("Authentication request not ready");
      return;
    }
    await promptAsync();
  };

  const signOut = () => {
    setAccessToken(null);
    setError(null);
  };

  return { accessToken, signIn, signOut, isAuthenticated: !!accessToken, error };
};