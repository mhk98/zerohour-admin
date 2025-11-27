import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Helper function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem("token"); // You can use sessionStorage or other storage methods as well
};

export const CustomizeApi = createApi({
  reducerPath: "CustomizeApi",
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
  tagTypes: ["customize"],
  endpoints: (build) => ({
    createCustomize: build.mutation({
      query: (registerData) => ({
        url: "/customize/create",
        method: "POST",
        body: registerData,
      }),
      invalidatesTags: ["customize"],
    }),

    deleteCustomize: build.mutation({
      query: (id) => ({
        url: `/customize/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["customize"],
    }),

    updateCustomize: build.mutation({
      query: ({ id, data }) => ({
        url: `/customize/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["customize"],
    }),

    getAllCustomize: build.query({
      query: () => ({
        url: "customize",
      }),
      providesTags: ["customize"],
      refetchOnMountOrArgChange: true,
    }),

    getCustomizeDataById: build.query({
      query: (id) => ({
        url: `/customize/${id}`,
      }),
      providesTags: ["customize"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

// Export hooks to use in your components
export const {
  useCreateCustomizeMutation,
  useGetAllCustomizeQuery,
  useUpdateCustomizeMutation,
  useDeleteCustomizeMutation,
  useGetCustomizeDataByIdQuery,
} = CustomizeApi;
