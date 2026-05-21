// Camada de Abstração da API
// Permite alternar facilmente entre o Banco de Dados Mock e o Backend Real.

import { mockDb } from './mockDb';

const USE_REAL_BACKEND = true; // Habilitado para o deploy com backend real
const BACKEND_URL = window.location.origin.includes('localhost:5173') ? 'http://localhost:3001/api' : '/api';

export const api = {
  async getSettings() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/settings`);
      return response.json();
    }
    return mockDb.getSettings();
  },

  async updateSettings(data) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    }
    return mockDb.updateSettings(data);
  },

  async resetDatabase() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/reset`, { method: 'POST' });
      return response.json();
    }
    return mockDb.reset();
  },

  async getPlans() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/plans`);
      return response.json();
    }
    return mockDb.getPlans();
  },

  async addPlan(plan) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan),
      });
      return response.json();
    }
    return mockDb.addPlan(plan);
  },

  async getCustomers() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/customers`);
      return response.json();
    }
    return mockDb.getCustomers();
  },

  async getCustomerById(id) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/customers/${id}`);
      return response.json();
    }
    return mockDb.getCustomerById(id);
  },

  async addCustomer(customer) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
      });
      return response.json();
    }
    return mockDb.addCustomer(customer);
  },

  async updateCustomer(id, data) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    }
    return mockDb.updateCustomer(id, data);
  },

  async deleteCustomer(id) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/customers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erro ao excluir cliente');
      }
      return true;
    }
    return mockDb.deleteCustomer(id);
  },

  async getReferrals() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/referrals`);
      return response.json();
    }
    return mockDb.getReferrals();
  },

  async addReferral(referral) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/referrals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(referral),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erro ao registrar indicação');
      }
      return response.json();
    }
    return mockDb.addReferral(referral);
  },

  async updateReferral(id, data) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/referrals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    }
    return mockDb.updateReferral(id, data);
  },

  async deleteReferral(id) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/referrals/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    }
    return mockDb.deleteReferral(id);
  },

  async getRewards() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/rewards`);
      return response.json();
    }
    return mockDb.getRewards();
  },

  async updateReward(id, data) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/rewards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    }
    return mockDb.updateReward(id, data);
  },

  async getDashboardStats() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/dashboard/stats`);
      return response.json();
    }
    return mockDb.getDashboardStats();
  },

  async getUsers() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/users`);
      return response.json();
    }
    return mockDb.getUsers();
  },

  async addUser(user) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erro ao criar usuário');
      }
      return response.json();
    }
    return mockDb.addUser(user);
  },

  async deleteUser(id) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/users/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    }
    return mockDb.deleteUser(id);
  },

  async login(email, password) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erro na autenticação');
      }
      return response.json();
    }
    return mockDb.authenticateUser(email, password);
  },

  async getAuditLogs() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/audit`);
      return response.json();
    }
    return mockDb.getAuditLogs();
  },

  async clearAuditLogs() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/audit`, { method: 'DELETE' });
      return response.ok;
    }
    return mockDb.clearAuditLogs();
  }
};
