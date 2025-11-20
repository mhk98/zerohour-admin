import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Helper function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem("token"); // You can use sessionStorage or other storage methods as well
};

export const featureApi = createApi({
  reducerPath: "featureApi",
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
  tagTypes: ["feature"],
  endpoints: (build) => ({
    createFeature: build.mutation({
      query: (registerData) => ({
        url: "/feature/create",
        method: "POST",
        body: registerData,
      }),
      invalidatesTags: ["feature"],
    }),

    deleteFeature: build.mutation({
      query: (id) => ({
        url: `/feature/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["feature"],
    }),

    updateFeature: build.mutation({
      query: ({ id, data }) => ({
        url: `/feature/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["feature"],
    }),

    getAllFeature: build.query({
      query: () => ({
        url: "feature",
      }),
      providesTags: ["feature"],
      refetchOnMountOrArgChange: true,
    }),

    getFeatureDataById: build.query({
      query: (id) => ({
        url: `/feature/${id}`,
      }),
      providesTags: ["feature"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

// Export hooks to use in your components
export const {
  useCreateFeatureMutation,
  useGetAllFeatureQuery,
  useUpdateFeatureMutation,
  useDeleteFeatureMutation,
  useGetFeatureDataByIdQuery,
} = featureApi;
