// api/fetchApplications.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";
import { Application } from "../types";

const apicoIntegrationId: string = "gR1n1M"; // Replace with your Apico integration ID
const spreadSheetId: string = "1752f5mkUjRWeAvPpldHwRmPIq_pwwbH2TxzXr2hM1Vc"; // Your Google Sheet ID
const sheetName: string = "Sheet1"; // Your sheet name
const sheetId: number = 1196872439; 
const apiBaseUrl = `https://api.apico.dev/v1/${apicoIntegrationId}/${spreadSheetId}`;// Replace with your sheet/page gid (not sheet name)
const apicoApi = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    Authorization:  'Bearer a7fe1c886f1d79f3078dfb739b86a624957477822f02bfac5f770db6534e8cbd',
    "Content-Type": "application/json",
  },
});


export interface SpreadSheetResponse {
  values: string[][];
}

// Function to fetch data from Google Sheets via Apico
const fetchGoogleSheetData = async (): Promise<Application[]> => {
  const response = await axios.get<SpreadSheetResponse>(
    `${apiBaseUrl}/values/${sheetName}`
  );

  const [headers, ...rows] = response.data.values || [];

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
    ).reverse();;

  return data;
};
// Function to append a new application to the Google Sheet
const addApplication = async (data: (string | number | boolean)[]) => {
  const options: AxiosRequestConfig = {
    method: "POST",
    url: `/values/${sheetName}:append`,
    params: {
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      includeValuesInResponse: true,
    },
    data: {
      values: [data],
    },
  };

  const response = await apicoApi(options);
  return response.data;
};
// Function to update the status of a specific row
const updateApplicationStatus = async ({
  rowIndex,
  newStatus,
}: {
  rowIndex: number;
  newStatus: string;
}) => {
  // Fetch the current row data
  const response = await apicoApi.get<SpreadSheetResponse>(
    `${apiBaseUrl}/values/${sheetName}!A${rowIndex + 2}:Z${rowIndex + 2}`
  );

  const rowData = response.data.values[0];
  const headers = (await apicoApi.get<SpreadSheetResponse>(`${apiBaseUrl}/values/${sheetName}!A1:Z1`)).data.values[0];
  const statusColumnIndex = headers.indexOf("Status"); // Find the "Status" column index

  if (statusColumnIndex === -1) {
    throw new Error("Status column not found in the spreadsheet");
  }

  // Update the status in the row data
  rowData[statusColumnIndex] = newStatus;

  // Update the entire row
  const options: AxiosRequestConfig = {
    method: "PUT",
    url: `${apiBaseUrl}/values/${sheetName}!A${rowIndex + 2}`,
    params: {
      valueInputOption: "USER_ENTERED",
      includeValuesInResponse: true,
    },
    data: {
      values: [rowData],
    },
  };

  const updateResponse = await apicoApi(options);
  return updateResponse.data;
};

// Custom hook to fetch and filter applications
export const useApplications = (searchQuery: string = "", selectedStatuses: string[] = []) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["googleSheetData"],
    queryFn: fetchGoogleSheetData,
  });

  const filteredData = data?.filter((application) => {
    const matchesSearch =
    application["Company Name"].toLowerCase().includes(searchQuery.toLowerCase()) ||
    application["Job Title"].toLowerCase().includes(searchQuery.toLowerCase());

  const matchesStatus =
    selectedStatuses.length === 0 || selectedStatuses.includes(application.Status);

  return matchesSearch && matchesStatus
  });

  return {
    data: filteredData || [],
    isLoading,
    error,
  };
};

// Custom hook to update application status
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApplicationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["googleSheetData"] });
    },
    onError: (error) => {
      console.error("Error updating status:", error);
    },
  });
};
// Custom hook to add a new application
export const useAddApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["googleSheetData"] });
    },
    onError: (error) => {
      console.error("Error adding application:", error);
    },
  });
};