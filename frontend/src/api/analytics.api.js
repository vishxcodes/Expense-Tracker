import API from "./axios";

export const getMonthlySummary = (month, year) =>
  API.get("/analytics/monthly-summary", {
    params: { month, year },
  });

export const getCategoryBreakdown = (month, year) =>
  API.get("/analytics/category-breakdown", {
    params: { month, year },
  });

export const getMonthComparison = (month, year) =>
  API.get("/analytics/month-comparison", {
    params: { month, year },
  });
