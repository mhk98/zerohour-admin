import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Helper function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem("token"); // You can use sessionStorage or other storage methods as well
};

export const requirementsApi = createApi({
  reducerPath: "requirementsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",

    // This will attach the token to every request that requires authorization
    prepareHeaders: (headers) => {
      const token = getAuthToken(); // Retrieve token from storage
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // Add token to headers if available
      }
      return headers;
    },
  }),
  tagTypes: ["requirements"],
  endpoints: (build) => ({
    createRequirements: build.mutation({
      query: (data) => ({
        url: "/requirements/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["requirements"],
    }),

    deleteRequirements: build.mutation({
      query: (id) => ({
        url: `/requirements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["requirements"],
    }),

    updateRequirements: build.mutation({
      query: ({ id, data }) => ({
        url: `/requirements/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["requirements"],
    }),

    getAllRequirements: build.query({
      query: () => ({
        url: "requirements",
      }),
      providesTags: ["requirements"],
      refetchOnMountOrArgChange: true,
    }),

    getRequirementsDataById: build.query({
      query: (id) => ({
        url: `/requirements/${id}`,
      }),
      providesTags: ["requirements"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

// Export hooks to use in your components
export const {
  useCreateRequirementsMutation,
  useGetAllRequirementsQuery,
  useUpdateRequirementsMutation,
  useDeleteRequirementsMutation,
  useGetRequirementsDataByIdQuery,
} = requirementsApi;
