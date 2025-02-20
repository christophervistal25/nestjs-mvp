// mvp-app/src/mocks/services/mock-user.service.ts
import { Injectable } from '@nestjs/common';

export interface MockUser {
  id: string;
  email: string;
  name: string;
  tenant_id: string;
  role: string;
  is_active: boolean;
}

@Injectable()
export class MockUserService {
  private users: Map<string, MockUser> = new Map();

  constructor() {
    // Initialize some mock data
    this.users.set('user1', {
      id: 'user1',
      email: 'user1@example.com',
      name: 'Test User 1',
      tenant_id: 'tenant1',
      role: 'user',
      is_active: true,
    });

    this.users.set('user2', {
      id: 'user2',
      email: 'user2@example.com',
      name: 'Test User 2',
      tenant_id: 'tenant1',
      role: 'admin',
      is_active: true,
    });
  }

  async findById(id: string): Promise<MockUser | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<MockUser | null> {
    return (
      Array.from(this.users.values()).find((user) => user.email === email) ||
      null
    );
  }

  async findByTenant(tenantId: string): Promise<MockUser[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.tenant_id === tenantId,
    );
  }
}
