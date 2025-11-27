import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Helper function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem("token"); // You can use sessionStorage or other storage methods as well
};

export const NewsApi = createApi({
  reducerPath: "NewsApi",
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
  tagTypes: ["news"],
  endpoints: (build) => ({
    createNews: build.mutation({
      query: (registerData) => ({
        url: "/news/create",
        method: "POST",
        body: registerData,
      }),
      invalidatesTags: ["news"],
    }),

    deleteNews: build.mutation({
      query: (id) => ({
        url: `/news/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["news"],
    }),

    updateNews: build.mutation({
      query: ({ id, data }) => ({
        url: `/news/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["news"],
    }),

    getAllNews: build.query({
      query: ({title}) => ({
        url: "news",
        params: { title },
      }),
      providesTags: ["news"],
      refetchOnMountOrArgChange: true,
    }),

    getNewsDataById: build.query({
      query: (id) => ({
        url: `/news/${id}`,
      }),
      providesTags: ["news"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

// Export hooks to use in your components
export const {
  useCreateNewsMutation,
  useDeleteNewsMutation,
  useUpdateNewsMutation,
  useGetAllNewsQuery,
  useGetNewsDataByIdQuery,
} = NewsApi;
