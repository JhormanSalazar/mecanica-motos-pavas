import api from "../../../api/axios";

export async function fetchUsersApi() {
  const { data } = await api.get("/users");
  return data;
}

export async function createUserApi(payload) {
  await api.post("/users", payload);
}

export async function updateUserApi(id, payload) {
  await api.put(`/users/${id}`, payload);
}

export async function deleteUserApi(id) {
  await api.delete(`/users/${id}`);
}
