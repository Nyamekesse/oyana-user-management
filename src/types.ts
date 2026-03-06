export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
}

export interface UsersResponse {
  data: User[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
}

export interface CreateUserResponse {
  id: string;
  createdAt: string;
}