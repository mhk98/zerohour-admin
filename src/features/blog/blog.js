import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Helper function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem("token"); // You can use sessionStorage or other storage methods as well
};

export const BlogApi = createApi({
  reducerPath: "BlogApi",
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
  tagTypes: ["blog"],
  endpoints: (build) => ({
    createBlog: build.mutation({
      query: (registerData) => ({
        url: "/blog/create",
        method: "POST",
        body: registerData,
      }),
      invalidatesTags: ["blog"],
    }),

    deleteBlog: build.mutation({
      query: (id) => ({
        url: `/blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blog"],
    }),

    updateBlog: build.mutation({
      query: ({ id, data }) => ({
        url: `/blog/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["blog"],
    }),

    getAllBlog: build.query({
      query: () => ({
        url: "blog",
      }),
      providesTags: ["blog"],
      refetchOnMountOrArgChange: true,
    }),

    getBlogDataById: build.query({
      query: (id) => ({
        url: `/blog/${id}`,
      }),
      providesTags: ["blog"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

// Export hooks to use in your components
export const {
  useCreateBlogMutation,
  useGetAllBlogQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetBlogDataByIdQuery,
} = BlogApi;
