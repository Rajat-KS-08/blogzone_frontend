import { blogApi } from "../services/blogApi";

export default {
  [blogApi.reducerPath]: blogApi.reducer,
};
