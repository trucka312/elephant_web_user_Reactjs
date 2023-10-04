import { callApi } from "../apis";

const getAllBadges = (id) => {
  return callApi(`/store/v1/badges${id ? `?branch_id=${id}` : ""}`, "get");
};
export const badges = {
  getAllBadges,
};
