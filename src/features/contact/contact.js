import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Helper function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem("token"); // You can use sessionStorage or other storage methods as well
};

export const contactApi = createApi({
  reducerPath: "contactApi",
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
  tagTypes: ["contact"],
  endpoints: (build) => ({
    createContact: build.mutation({
      query: (registerData) => ({
        url: "/contact/create",
        method: "POST",
        body: registerData,
      }),
      invalidatesTags: ["contact"],
    }),

    deleteContact: build.mutation({
      query: (id) => ({
        url: `/contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["contact"],
    }),

    updateContact: build.mutation({
      query: ({ id, data }) => ({
        url: `/contact/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["contact"],
    }),

    getAllContact: build.query({
      query: () => ({
        url: "contact",
      }),
      providesTags: ["contact"],
      refetchOnMountOrArgChange: true,
    }),

    getContactDataById: build.query({
      query: (id) => ({
        url: `/contact/${id}`,
      }),
      providesTags: ["contact"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

// Export hooks to use in your components
export const {
  useCreateContactMutation,
  useGetAllContactQuery,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useGetContactDataByIdQuery,
} = contactApi;
