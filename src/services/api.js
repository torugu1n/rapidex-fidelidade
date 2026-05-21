// Camada de Abstração da API
// Permite alternar facilmente entre o Banco de Dados Mock e o Backend Real.

import { mockDb } from './mockDb';

const USE_REAL_BACKEND = true; // Habilitado para o deploy com backend real
const BACKEND_URL = window.location.origin.includes('localhost:5173') ? 'http://localhost:3001/api' : '/api';

// Helper para construir os cabeçalhos com o operador autenticado
function getHeaders(extraHeaders = {}) {
  const headers = { ...extraHeaders };
  try {
    const saved = localStorage.getItem('isp_auth_user');
    if (saved) {
      const user = JSON.parse(saved);
      if (user && user.name) {
        headers['x-operator-name'] = user.name;
      }
    }
  } catch (e) {
    console.error('Erro ao ler usuário para cabeçalhos:', e);
  }
  return headers;
}

export const api = {
  async getSettings() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/settings`, {
        headers: getHeaders()
      });
      return response.json();
    }
    return mockDb.getSettings();
  },

  async updateSettings(data) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/settings`, {
        method: 'PUT',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data),
      });
      return response.json();
    }
    return mockDb.updateSettings(data);
  },

  async resetDatabase() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/reset`, {
        method: 'POST',
        headers: getHeaders()
      });
      return response.json();
    }
    return mockDb.reset();
  },

  async getPlans() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/plans`, {
        headers: getHeaders()
      });
      return response.json();
    }
    return mockDb.getPlans();
  },

  async addPlan(plan) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/plans`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(plan),
      });
      return response.json();
    }
    return mockDb.addPlan(plan);
  },

  async getCustomers() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/customers`, {
        headers: getHeaders()
      });
      return response.json();
    }
    return mockDb.getCustomers();
  },

  async getCustomerById(id) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/customers/${id}`, {
        headers: getHeaders()
      });
      return response.json();
    }
    return mockDb.getCustomerById(id);
  },

  async addCustomer(customer) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/customers`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
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
        headers: getHeaders({ 'Content-Type': 'application/json' }),
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
        headers: getHeaders()
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
      const response = await fetch(`${BACKEND_URL}/referrals`, {
        headers: getHeaders()
      });
      return response.json();
    }
    return mockDb.getReferrals();
  },

  async addReferral(referral) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/referrals`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
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
        headers: getHeaders({ 'Content-Type': 'application/json' }),
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
        headers: getHeaders()
      });
      return response.ok;
    }
    return mockDb.deleteReferral(id);
  },

  async getRewards() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/rewards`, {
        headers: getHeaders()
      });
      return response.json();
    }
    return mockDb.getRewards();
  },

  async updateReward(id, data) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/rewards/${id}`, {
        method: 'PUT',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data),
      });
      return response.json();
    }
    return mockDb.updateReward(id, data);
  },

  async getDashboardStats() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/dashboard/stats`, {
        headers: getHeaders()
      });
      return response.json();
    }
    return mockDb.getDashboardStats();
  },

  async getUsers() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/users`, {
        headers: getHeaders()
      });
      return response.json();
    }
    return mockDb.getUsers();
  },

  async addUser(user) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/users`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
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
        headers: getHeaders()
      });
      return response.ok;
    }
    return mockDb.deleteUser(id);
  },

  async updateUser(id, data) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/users/${id}`, {
        method: 'PUT',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erro ao atualizar operador');
      }
      return response.json();
    }
    return mockDb.updateUser(id, data);
  },

  async login(email, password) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
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
      const response = await fetch(`${BACKEND_URL}/audit`, {
        headers: getHeaders()
      });
      return response.json();
    }
    return mockDb.getAuditLogs();
  },

  async clearAuditLogs() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/audit`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return response.ok;
    }
    return mockDb.clearAuditLogs();
  }
};
