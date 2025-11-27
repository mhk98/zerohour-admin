import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Helper function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem("token"); // You can use sessionStorage or other storage methods as well
};

export const aboutUsApi = createApi({
  reducerPath: "aboutUsApi",
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
  tagTypes: ["aboutUs"],
  endpoints: (build) => ({
    createAboutUs: build.mutation({
      query: (registerData) => ({
        url: "/aboutUs/create",
        method: "POST",
        body: registerData,
      }),
      invalidatesTags: ["aboutUs"],
    }),

    deleteAboutUs: build.mutation({
      query: (id) => ({
        url: `/aboutUs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["aboutUs"],
    }),

    updateAboutUs: build.mutation({
      query: ({ id, data }) => ({
        url: `/aboutUs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["aboutUs"],
    }),

    getAllAboutUs: build.query({
      query: () => ({
        url: "aboutUs",
      }),
      providesTags: ["aboutUs"],
      refetchOnMountOrArgChange: true,
    }),

    getAboutUsDataById: build.query({
      query: (id) => ({
        url: `/aboutUs/${id}`,
      }),
      providesTags: ["aboutUs"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

// Export hooks to use in your components
export const {
  useCreateAboutUsMutation,
  useGetAllAboutUsQuery,
  useUpdateAboutUsMutation,
  useDeleteAboutUsMutation,
  useGetAboutUsDataByIdQuery,
} = aboutUsApi;
