import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Helper function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem("token"); // You can use sessionStorage or other storage methods as well
};

export const RequirementApi = createApi({
  reducerPath: "RequirementApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://zerohour-backend.onrender.com/api/v1/",

    // This will attach the token to every request that requires authorization
    prepareHeaders: (headers) => {
      const token = getAuthToken(); // Retrieve token from storage
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // Add token to headers if available
      }
      return headers;
    },
  }),
  tagTypes: ["requirement"],
  endpoints: (build) => ({
    createRequirement: build.mutation({
      query: (data) => ({
        url: "/requirement/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["requirement"],
    }),

    deleteRequirement: build.mutation({
      query: (id) => ({
        url: `/requirement/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Requirement"],
    }),

    updateRequirement: build.mutation({
      query: ({ id, data }) => ({
        url: `/requirement/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["requirement"],
    }),

    getAllRequirement: build.query({
      query: () => ({
        url: "requirement",
      }),
      providesTags: ["requirement"],
      refetchOnMountOrArgChange: true,
    }),

    getRequirementDataById: build.query({
      query: (id) => ({
        url: `/requirement/${id}`,
      }),
      providesTags: ["requirement"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

// Export hooks to use in your components
export const {
  useCreateRequirementMutation,
  useGetAllRequirementQuery,
  useUpdateRequirementMutation,
  useDeleteRequirementMutation,
  useGetRequirementDataByIdQuery,
} = RequirementApi;
