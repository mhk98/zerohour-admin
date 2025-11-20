import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Helper function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem("token"); // You can use sessionStorage or other storage methods as well
};

export const subCategoryHeadingApi = createApi({
  reducerPath: "subCategoryHeadingApi",
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
  tagTypes: ["subCategory"],
  endpoints: (build) => ({
    createSubCategoryHeading: build.mutation({
      query: (data) => ({
        url: "/subCategory/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["subCategory"],
    }),

    deleteSubCategoryHeading: build.mutation({
      query: (id) => ({
        url: `/subCategory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["subCategory"],
    }),

    updateSubCategoryHeading: build.mutation({
      query: ({ id, data }) => ({
        url: `/subCategory/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["subCategory"],
    }),

    getAllSubCategoryHeadings: build.query({
      query: () => ({
        url: "subCategory",
      }),
      providesTags: ["subCategory"],
      refetchOnMountOrArgChange: true,
    }),

    getSubCategoryHeadingDataById: build.query({
      query: (id) => ({
        url: `/subCategory/${id}`,
      }),
      providesTags: ["subCategory"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

// Export hooks to use in your components
export const {
  useCreateSubCategoryHeadingMutation,
  useGetAllSubCategoryHeadingsQuery,
  useUpdateSubCategoryHeadingMutation,
  useDeleteSubCategoryHeadingMutation,
  useGetSubCategoryHeadingDataByIdQuery,
} = subCategoryHeadingApi;
