export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'employee';
  createdAt?: Date;
  updatedAt?: Date;
}