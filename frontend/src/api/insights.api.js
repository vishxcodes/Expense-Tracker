import API from "./axios";

export const getInsights = (month, year) =>
  API.get("/insights", {
    params: { month, year },
  });
