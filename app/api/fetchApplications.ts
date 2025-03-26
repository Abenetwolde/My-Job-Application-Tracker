// api/fetchApplications.ts
import { useQuery } from "@tanstack/react-query";
import { Application } from "../types";

// Function to fetch data from Google Sheets
const fetchGoogleSheetData = async (): Promise<Application[]> => {
  const spreadsheetId = "1752f5mkUjRWeAvPpldHwRmPIq_pwwbH2TxzXr2hM1Vc";
  const apiKey = "AIzaSyB4Z8J97dJme_bKo4GWN8Bx8Kc5HmuxdYg";
  const range = "Sheet1!A:Z";

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data from Google Sheets");
  }

  const result = await response.json();

  const [headers, ...rows] = result.values || [];

  if (!headers || !rows.length) {
    return [];
  }

  const data = rows
    .map((row: string[], index: number) => {
      const rowObject: { [key: string]: string } = {};
      headers.forEach((header: string, i: number) => {
        rowObject[header] = row[i] || "";
      });
      return {
        id: index.toString(),
        ...rowObject,
      } as Application;
    })
    .filter((row: Application) =>
      Object.values(row).some((value) => value.trim() !== "")
    );

  return data;
};

// Custom hook to fetch applications using TanStack Query
// Custom hook to fetch and filter applications
export const useApplications = (searchQuery = "", selectedStatuses :any= []) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["googleSheetData"],
        queryFn: fetchGoogleSheetData,
    });

    // Filter the data based on search query and selected statuses
    const filteredData = data?.filter((application) => {
        const companyName = application["Company Name"]?.toLowerCase() || ""; // Check for undefined
        const jobTitle = application["Job Title"]?.toLowerCase() || ""; // Check for undefined

        const matchesSearch =
            companyName.includes(searchQuery.toLowerCase()) ||
            jobTitle.includes(searchQuery.toLowerCase());

        const matchesStatus:any =
            selectedStatuses.length === 0 ||selectedStatuses.includes(application.Status);
        return matchesSearch && matchesStatus;
    });

    return {
        data: filteredData || [],
        isLoading,
        error,
    };
};
