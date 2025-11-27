import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Helper function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem("token"); // You can use sessionStorage or other storage methods as well
};

export const FeedbackApi = createApi({
  reducerPath: "FeedbackApi",
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
  tagTypes: ["feedback"],
  endpoints: (build) => ({
    createFeedback: build.mutation({
      query: (registerData) => ({
        url: "/feedback/create",
        method: "POST",
        body: registerData,
      }),
      invalidatesTags: ["feedback"],
    }),

    deleteFeedback: build.mutation({
      query: (id) => ({
        url: `/feedback/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["feedback"],
    }),

    updateFeedback: build.mutation({
      query: ({ id, data }) => ({
        url: `/feedback/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["feedback"],
    }),

    getAllFeedback: build.query({
      query: () => ({
        url: "feedback",
      }),
      providesTags: ["feedback"],
      refetchOnMountOrArgChange: true,
    }),

    getFeedbackDataById: build.query({
      query: (id) => ({
        url: `/feedback/${id}`,
      }),
      providesTags: ["feedback"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

// Export hooks to use in your components
export const {
  useCreateFeedbackMutation,
  useGetAllFeedbackQuery,
  useUpdateFeedbackMutation,
  useDeleteFeedbackMutation,
  useGetFeedbackDataByIdQuery,
} = FeedbackApi;
