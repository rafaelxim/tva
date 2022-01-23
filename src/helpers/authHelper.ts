import { Groups, UserDetailsResponse } from "../actions/types";

export const hasRole = (user: UserDetailsResponse, role: Groups): boolean => {
  const groupsArr = user.groups.map((g) => g.name);

  if (groupsArr.includes(role)) return true;

  return false;
};
