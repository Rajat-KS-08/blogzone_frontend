import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'http://localhost:5000';

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}/api/` }),
  endpoints: (builder) => ({
    getBlogs: builder.query<any[], void>({
      query: () => 'blogs',
    }),
  }),
});

export const { useGetBlogsQuery } = blogApi;
