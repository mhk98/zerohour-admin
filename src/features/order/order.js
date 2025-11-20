import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Helper function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem("token"); // You can use sessionStorage or other storage methods as well
};

export const OrderApi = createApi({
  reducerPath: "OrderApi",
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
  tagTypes: ["order"],
  endpoints: (build) => ({
    createOrder: build.mutation({
      query: (registerData) => ({
        url: "/order/create",
        method: "POST",
        body: registerData,
      }),
      invalidatesTags: ["order"],
    }),

    deleteOrder: build.mutation({
      query: (id) => ({
        url: `/order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["order"],
    }),

    updateOrder: build.mutation({
      query: ({ id, data }) => ({
        url: `/order/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["order"],
    }),

    getAllOrder: build.query({
      query: () => ({
        url: "order",
      }),
      providesTags: ["order"],
      refetchOnMountOrArgChange: true,
    }),

    getOrderDataById: build.query({
      query: (id) => ({
        url: `/order/${id}`,
      }),
      providesTags: ["order"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

// Export hooks to use in your components
export const {
  useCreateOrderMutation,
  useGetAllOrderQuery,
  useGetOrderDataByIdQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = OrderApi;
