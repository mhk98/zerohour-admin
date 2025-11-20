import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Helper function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem("token"); // You can use sessionStorage or other storage methods as well
};

export const categoryApi = createApi({
  reducerPath: "categoryApi",
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
  tagTypes: ["category"],
  endpoints: (build) => ({
    createCategory: build.mutation({
      query: (data) => ({
        url: "/category/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),

    deleteCategory: build.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),

    updateCategory: build.mutation({
      query: ({ id, data }) => ({
        url: `/category/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),

    getAllCategory: build.query({
      query: () => ({
        url: "/category",
      }),
      providesTags: ["category"],
      refetchOnMountOrArgChange: true,
    }),

    getCategoryDataById: build.query({
      query: (id) => ({
        url: `/category/${id}`,
      }),
      providesTags: ["category"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

// Export hooks to use in your components
export const {
  useCreateCategoryMutation,
  useGetAllCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryDataByIdQuery,
} = categoryApi;
