import type { CreateUserResponse, User, UserFormData, UsersResponse } from "../types";


const BASE_URL = "/api";

const headers: HeadersInit = {
  "Content-Type": "application/json",
  "x-api-key": import.meta.env.VITE_REQRES_API_KEY ?? "",
};


export async function fetchUsers(page: number): Promise<UsersResponse> {
  const res = await fetch(`${BASE_URL}/users?page=${page}`, { headers });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function createUser(data: UserFormData): Promise<CreateUserResponse> {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}

export async function updateUser(id: number, data: UserFormData): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/users/${id}`, { method: "DELETE", headers });
  if (!res.ok) throw new Error("Failed to delete user");
}