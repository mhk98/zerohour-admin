import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Helper function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem("token"); // You can use sessionStorage or other storage methods as well
};

export const subCategoryItemApi = createApi({
  reducerPath: "subCategoryItemApi",
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
  tagTypes: ["subCategoryItem"],
  endpoints: (build) => ({
    createSubCategory: build.mutation({
      query: (data) => ({
        url: "/subCategoryItem/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["subCategoryItem"],
    }),

    deleteSubCategory: build.mutation({
      query: (id) => ({
        url: `/subCategoryItem/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["subCategoryItem"],
    }),

    updateSubCategory: build.mutation({
      query: ({ id, data }) => ({
        url: `/subCategoryItem/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["subCategoryItem"],
    }),

    getAllSubCategory: build.query({
      query: () => ({
        url: "subCategoryItem",
      }),
      providesTags: ["subCategoryItem"],
      refetchOnMountOrArgChange: true,
    }),

    getSubCategoryDataById: build.query({
      query: (id) => ({
        url: `/subCategoryItem/${id}`,
      }),
      providesTags: ["subCategoryItem"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

// Export hooks to use in your components
export const {
  useCreateSubCategoryMutation,
  useGetAllSubCategoryQuery,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetSubCategoryDataByIdQuery,
} = subCategoryItemApi;
