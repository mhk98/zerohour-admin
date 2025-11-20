import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Helper function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem("token"); // You can use sessionStorage or other storage methods as well
};

export const bannerApi = createApi({
  reducerPath: "bannerApi",
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
  tagTypes: ["banner"],
  endpoints: (build) => ({
    createBanner: build.mutation({
      query: (registerData) => ({
        url: "/banner/create",
        method: "POST",
        body: registerData,
      }),
      invalidatesTags: ["banner"],
    }),

    deleteBanner: build.mutation({
      query: (id) => ({
        url: `/banner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["banner"],
    }),

    updateBanner: build.mutation({
      query: ({ id, data }) => ({
        url: `/banner/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["banner"],
    }),

    getAllBanner: build.query({
      query: () => ({
        url: "banner",
      }),
      providesTags: ["banner"],
      refetchOnMountOrArgChange: true,
    }),

    getBannerDataById: build.query({
      query: (id) => ({
        url: `/banner/${id}`,
      }),
      providesTags: ["banner"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

// Export hooks to use in your components
export const {
  useCreateBannerMutation,
  useGetAllBannerQuery,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useGetBannerDataByIdQuery,
} = bannerApi;
