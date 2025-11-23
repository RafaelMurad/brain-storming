import { NotFoundError } from '../middleware/errorHandler.js';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  name: string;
}

// In-memory storage (replace with database in production)
const users: Map<string, User> = new Map();

// Seed some initial data
const seedUsers = () => {
  const initialUsers: User[] = [
    {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      email: 'jane@example.com',
      name: 'Jane Smith',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  initialUsers.forEach((user) => users.set(user.id, user));
};

seedUsers();

// Service methods
export const userService = {
  async getAll(): Promise<User[]> {
    return Array.from(users.values());
  },

  async getById(id: string): Promise<User> {
    const user = users.get(id);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    return user;
  },

  async create(input: CreateUserInput): Promise<User> {
    const id = String(Date.now());
    const now = new Date();

    const user: User = {
      id,
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    users.set(id, user);
    return user;
  },

  async update(id: string, input: Partial<CreateUserInput>): Promise<User> {
    const existing = await this.getById(id);

    const updated: User = {
      ...existing,
      ...input,
      updatedAt: new Date(),
    };

    users.set(id, updated);
    return updated;
  },

  async delete(id: string): Promise<void> {
    const exists = users.has(id);
    if (!exists) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    users.delete(id);
  },
};
