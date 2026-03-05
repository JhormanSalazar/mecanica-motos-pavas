import api from "../../../api/axios";

export async function changePassword(userId, actualPassword, newPassword) {
  return api.patch(`/users/${userId}/change-password`, { actualPassword, newPassword });
}

export default changePassword;
