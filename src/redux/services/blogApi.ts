import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:5000";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}/api/blogs` }),
  tagTypes: ["Blogs"], // ✅ enables automatic cache invalidation
  endpoints: (builder) => ({
    // ✅ GET all blogs
    getBlogs: builder.query<any[], void>({
      query: () => "getBlogs",
      providesTags: ["Blogs"], // ✅ mark this query as providing "Blogs" data
    }),

    // ✅ CREATE new blog post
    createBlog: builder.mutation<any, Partial<any>>({
      query: (newBlog) => ({
        url: "createBlog", // Backend endpoint: POST /api/blogs/createBlog
        method: "POST",
        body: newBlog,
        invalidatesTags: ["Blogs"], // ✅ triggers re-fetch of getBlogs
      }),
    }),

    // ✅ LIKE or DISLIKE a blog
    hitLikeOrDislikeBlog: builder.mutation<
      any,
      { blogId: string; userId: string; type: "like" | "dislike" }
    >({
      query: ({ blogId, userId, type }) => ({
        url: `hitLikeOrDislike/${blogId}`, // ✅ Updated route
        method: "POST",
        body: { userId, type },
      }),
      invalidatesTags: ["Blogs"], // ✅ re-fetch blogs when like/dislike changes
    }),
  }),
});

export const { useGetBlogsQuery, useCreateBlogMutation, useHitLikeOrDislikeBlogMutation } = blogApi;
