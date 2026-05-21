// Serviço de Banco de Dados Mock no LocalStorage
// Fornece persistência de dados para demonstração local.

const STORAGE_KEYS = {
  CUSTOMERS: 'isp_fidelidade_customers',
  REFERRALS: 'isp_fidelidade_referrals',
  REWARDS: 'isp_fidelidade_rewards',
  PLANS: 'isp_fidelidade_plans',
  SETTINGS: 'isp_fidelidade_settings',
  USERS: 'isp_fidelidade_users',
  AUDIT: 'isp_fidelidade_audit',
};

// Dados de Semente Iniciais (Seed Data)
const INITIAL_PLANS = [
  { id: 'p1', name: '100 Mega Fibra', price: 79.90 },
  { id: 'p2', name: '300 Mega Fibra', price: 99.90 },
  { id: 'p3', name: '500 Mega Fibra', price: 119.90 },
  { id: 'p4', name: '1 Giga Ultra Fibra', price: 149.90 },
];

const INITIAL_CUSTOMERS = [
  { id: 'c1', name: 'Carlos Alberto Silva', phone: '(86) 99843-2198', cpf: '123.456.789-00', status: 'ATIVO', planId: 'p3', city: 'Teresina', neighborhood: 'Jóquei', createdAt: '2026-01-10T14:30:00.000Z' },
  { id: 'c2', name: 'Ana Beatriz Souza', phone: '(86) 98122-4532', cpf: '987.654.321-11', status: 'ATIVO', planId: 'p2', city: 'Teresina', neighborhood: 'Fátima', createdAt: '2026-01-15T09:15:00.000Z' },
  { id: 'c3', name: 'Marcos Vinícius Oliveira', phone: '(86) 99244-8877', cpf: '456.789.123-22', status: 'ATIVO', planId: 'p4', city: 'Teresina', neighborhood: 'Centro', createdAt: '2026-02-02T10:00:00.000Z' },
  { id: 'c4', name: 'Mariana Costa Ramos', phone: '(86) 98877-6655', cpf: '321.654.987-33', status: 'ATIVO', planId: 'p2', city: 'Teresina', neighborhood: 'Horto', createdAt: '2026-02-20T16:45:00.000Z' },
  { id: 'c5', name: 'Felipe Santos Oliveira', phone: '(86) 99311-2233', cpf: '159.753.486-44', status: 'INATIVO', planId: 'p1', city: 'Teresina', neighborhood: 'Dirceu', createdAt: '2026-02-22T11:20:00.000Z' },
  { id: 'c6', name: 'Juliana Mendes Lima', phone: '(86) 98144-5566', cpf: '852.963.741-55', status: 'ATIVO', planId: 'p3', city: 'Teresina', neighborhood: 'Ininga', createdAt: '2026-03-01T08:30:00.000Z' },
  { id: 'c7', name: 'Roberto Rocha Santos', phone: '(86) 99988-1122', cpf: '369.258.147-66', status: 'ATIVO', planId: 'p2', city: 'Teresina', neighborhood: 'Morada do Sol', createdAt: '2026-03-05T14:10:00.000Z' },
  { id: 'c8', name: 'Patrícia Alves Carvalho', phone: '(86) 98844-3322', cpf: '741.852.963-77', status: 'ATIVO', planId: 'p3', city: 'Teresina', neighborhood: 'Ilhotas', createdAt: '2026-03-12T17:50:00.000Z' },
  { id: 'c9', name: 'Lucas Ferreira Lima', phone: '(86) 97122-3344', cpf: '123.789.456-88', status: 'ATIVO', planId: 'p4', city: 'Teresina', neighborhood: 'Mocambinho', createdAt: '2026-03-20T10:00:00.000Z' },
  { id: 'c10', name: 'Amanda Melo Pereira', phone: '(86) 99345-6789', cpf: '951.357.852-99', status: 'ATIVO', planId: 'p1', city: 'Teresina', neighborhood: 'Vermelha', createdAt: '2026-04-02T15:20:00.000Z' },
  { id: 'c11', name: 'Gustavo Barbosa', phone: '(86) 99876-5432', cpf: '654.321.987-12', status: 'ATIVO', planId: 'p3', city: 'Teresina', neighborhood: 'Planalto Uruguai', createdAt: '2026-04-10T11:00:00.000Z' },
  { id: 'c12', name: 'Camila Rodrigues', phone: '(86) 98111-9988', cpf: '147.258.369-25', status: 'ATIVO', planId: 'p2', city: 'Teresina', neighborhood: 'São Cristóvão', createdAt: '2026-04-18T13:40:00.000Z' }
];

const INITIAL_REFERRALS = [
  // Carlos indicou Mariana, Felipe e Patrícia
  { id: 'r1', referrerId: 'c1', refereeId: 'c4', status: 'INSTALADO', notes: 'Instalado com sucesso no dia seguinte. Recomenda-se acompanhar.', createdAt: '2026-02-18T10:00:00.000Z' },
  { id: 'r2', referrerId: 'c1', refereeId: 'c5', status: 'CANCELADO', notes: 'Cliente desistiu antes da instalação devido a pendência no endereço.', createdAt: '2026-02-21T09:30:00.000Z' },
  { id: 'r3', referrerId: 'c1', refereeId: 'c8', status: 'INSTALADO', notes: 'Assinou plano de 300 Mega. Muito satisfeito com a indicação.', createdAt: '2026-03-10T11:00:00.000Z' },

  // Ana indicou Juliana e Roberto
  { id: 'r4', referrerId: 'c2', refereeId: 'c6', status: 'INSTALADO', notes: 'Fechou o plano de 500 Mega. Recompensa liberada.', createdAt: '2026-02-28T15:00:00.000Z' },
  { id: 'r5', referrerId: 'c2', refereeId: 'c7', status: 'INSTALADO', notes: 'Indicação convertida em 3 dias.', createdAt: '2026-03-03T16:20:00.000Z' },

  // Patrícia indicou Lucas
  { id: 'r6', referrerId: 'c8', refereeId: 'c9', status: 'INSTALADO', notes: 'Cliente de Niterói. Instalação rápida.', createdAt: '2026-03-18T14:00:00.000Z' },

  // Marcos indicou Amanda
  { id: 'r7', referrerId: 'c3', refereeId: 'c10', status: 'PENDENTE', notes: 'Instalação agendada para sexta-feira de manhã.', createdAt: '2026-04-01T09:00:00.000Z' },

  // Camila indicada por Gustavo
  { id: 'r8', referrerId: 'c11', refereeId: 'c12', status: 'PENDENTE', notes: 'Aguardando aprovação de viabilidade técnica no Aterrado.', createdAt: '2026-04-15T10:30:00.000Z' }
];

const INITIAL_REWARDS = [
  // Recompensa para r1 (Carlos por Mariana) - Entregue
  { id: 'w1', referralId: 'r1', type: 'Desconto de R$ 50,00 na Fatura', value: 50.00, status: 'ENTREGUE', deliveredAt: '2026-03-01T10:00:00.000Z', createdAt: '2026-02-18T10:00:00.000Z' },

  // Recompensa para r3 (Carlos por Patrícia) - Pendente
  { id: 'w2', referralId: 'r3', type: 'Desconto de R$ 50,00 na Fatura', value: 50.00, status: 'PENDENTE', deliveredAt: null, createdAt: '2026-03-10T11:00:00.000Z' },

  // Recompensa para r4 (Ana por Juliana) - Entregue
  { id: 'w3', referralId: 'r4', type: 'Pix de R$ 50,00', value: 50.00, status: 'ENTREGUE', deliveredAt: '2026-03-05T12:00:00.000Z', createdAt: '2026-02-28T15:00:00.000Z' },

  // Recompensa para r5 (Ana por Roberto) - Entregue
  { id: 'w4', referralId: 'r5', type: 'Pix de R$ 50,00', value: 50.00, status: 'ENTREGUE', deliveredAt: '2026-03-10T09:00:00.000Z', createdAt: '2026-03-03T16:20:00.000Z' },

  // Recompensa para r6 (Patrícia por Lucas) - Pendente
  { id: 'w5', referralId: 'r6', type: 'Desconto de R$ 50,00 na Fatura', value: 50.00, status: 'PENDENTE', deliveredAt: null, createdAt: '2026-03-18T14:00:00.000Z' }
];

const INITIAL_SETTINGS = {
  defaultRewardType: 'Desconto de R$ 50,00 na Fatura',
  defaultRewardValue: 50.00,
  latencyMs: 300,
  mockDelayEnabled: true,
  adminName: 'Administrador Rapidex',
  adminEmail: 'admin@rapidex.com.br',
  referralsPerReward: 3,
  rewardTypes: [
    'Pix',
    'Mês Grátis',
    'Crédito na Conta',
    'Desconto de R$ 50,00 na Fatura'
  ]
};

const INITIAL_USERS = [
  {
    id: 'u1',
    email: 'admin.rapidex',
    password: 'Rapidex@2026#',
    name: 'Administrador Rapidex',
    role: 'ADMIN',
    createdAt: new Date().toISOString()
  },
  {
    id: 'u2',
    email: 'rogerio.castro',
    password: 'Hbusa@2009',
    name: 'Rogério Castro',
    role: 'ATENDENTE',
    createdAt: new Date().toISOString()
  }
];

// Funções Auxiliares de Armazenamento
const readFromStorage = (key, defaultValue) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const writeToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const initDb = (force = false) => {
  // Se houver dados antigos salvos no LocalStorage (ex: Volta Redonda), força a atualização para Teresina-PI
  let needsMigration = false;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (stored) {
      const customers = JSON.parse(stored);
      if (customers.length > 0 && customers.some(c => c.city !== 'Teresina')) {
        needsMigration = true;
      }
    }
  } catch (e) {
    needsMigration = true;
  }

  if (force || needsMigration || !localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    writeToStorage(STORAGE_KEYS.PLANS, INITIAL_PLANS);
    writeToStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    writeToStorage(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
    writeToStorage(STORAGE_KEYS.REWARDS, INITIAL_REWARDS);
    writeToStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    writeToStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  } else if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    writeToStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  }
};

// Helper para simular latência de rede se habilitado
const delay = () => {
  const settings = readFromStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  if (settings.mockDelayEnabled && settings.latencyMs > 0) {
    return new Promise(resolve => setTimeout(resolve, settings.latencyMs));
  }
  return Promise.resolve();
};

const recalculateReferrerRewards = (referrerId) => {
  if (!referrerId) return;
  const referrals = readFromStorage(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
  const settings = readFromStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  const threshold = settings.referralsPerReward || 3;

  const installed = referrals
    .filter(r => r.referrerId === referrerId && r.status === 'INSTALADO')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const triggerIds = new Set(
    installed.filter((r, idx) => (idx + 1) % threshold === 0).map(r => r.id)
  );

  const referrerReferralIds = new Set(
    referrals.filter(r => r.referrerId === referrerId).map(r => r.id)
  );

  let rewards = readFromStorage(STORAGE_KEYS.REWARDS, INITIAL_REWARDS);
  let changed = false;

  // 1. Remove rewards that shouldn't be there (only if they are PENDENTE)
  const initialCount = rewards.length;
  rewards = rewards.filter(w => {
    if (referrerReferralIds.has(w.referralId)) {
      if (!triggerIds.has(w.referralId) && w.status === 'PENDENTE') {
        changed = true;
        return false;
      }
    }
    return true;
  });

  // 2. Add rewards that should be there but aren't
  triggerIds.forEach(refId => {
    const exists = rewards.some(w => w.referralId === refId);
    if (!exists) {
      const newReward = {
        id: 'w_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        referralId: refId,
        type: settings.defaultRewardType || 'Desconto de R$ 50,00 na Fatura',
        value: settings.defaultRewardValue || 50.00,
        status: 'PENDENTE',
        deliveredAt: null,
        createdAt: new Date().toISOString()
      };
      rewards.push(newReward);
      changed = true;
    }
  });

  if (changed || rewards.length !== initialCount) {
    writeToStorage(STORAGE_KEYS.REWARDS, rewards);
  }
};

// Helper: Registra uma entrada no log de auditoria
const addAuditLog = (action, description, operatorName = null) => {
  let resolvedOperator = operatorName;
  if (!resolvedOperator) {
    try {
      const savedUser = localStorage.getItem('isp_auth_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.name) {
          resolvedOperator = parsed.name;
        }
      }
    } catch (e) {
      // Ignora erro
    }
  }
  if (!resolvedOperator) {
    resolvedOperator = 'Sistema';
  }

  const logs = readFromStorage(STORAGE_KEYS.AUDIT, []);
  logs.unshift({
    id: 'log_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    action,
    description,
    operatorName: resolvedOperator,
    createdAt: new Date().toISOString()
  });
  // Mantém apenas os últimos 500 registros
  writeToStorage(STORAGE_KEYS.AUDIT, logs.slice(0, 500));
};

// Inicializa no primeiro carregamento do módulo
initDb();

export const mockDb = {
  // RESET DATABASE
  async reset() {
    await delay();
    initDb(true);
    addAuditLog('DATABASE_RESET', 'Banco de dados redefinido para o estado inicial');
    return true;
  },

  // CONFIGURAÇÕES
  async getSettings() {
    await delay();
    const settings = readFromStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    if (!settings.rewardTypes) {
      settings.rewardTypes = INITIAL_SETTINGS.rewardTypes;
      writeToStorage(STORAGE_KEYS.SETTINGS, settings);
    }
    return settings;
  },

  async updateSettings(data) {
    await delay();
    const current = readFromStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    const { operatorName, ...settingsData } = data;
    const updated = { ...current, ...settingsData };
    writeToStorage(STORAGE_KEYS.SETTINGS, updated);
    addAuditLog('SETTINGS_UPDATED', 'Configurações do sistema atualizadas', operatorName || 'Sistema');
    return updated;
  },

  // PLANOS
  async getPlans() {
    await delay();
    return readFromStorage(STORAGE_KEYS.PLANS, INITIAL_PLANS);
  },

  async addPlan(plan) {
    await delay();
    const plans = readFromStorage(STORAGE_KEYS.PLANS, INITIAL_PLANS);
    const newPlan = { ...plan, id: 'p_' + Date.now() };
    plans.push(newPlan);
    writeToStorage(STORAGE_KEYS.PLANS, plans);
    addAuditLog('PLAN_CREATED', `Plano "${newPlan.name}" (R$ ${newPlan.price.toFixed(2)}/mês) adicionado ao catálogo`);
    return newPlan;
  },

  // CLIENTES
  async getCustomers() {
    await delay();
    const customers = readFromStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    const plans = readFromStorage(STORAGE_KEYS.PLANS, INITIAL_PLANS);
    const referrals = readFromStorage(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
    const settings = readFromStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    const threshold = settings.referralsPerReward || 3;

    // Retorna clientes populados com dados do plano e progresso de indicações
    return customers.map(c => {
      const installedCount = referrals.filter(r => r.referrerId === c.id && r.status === 'INSTALADO').length;
      const progressInCycle = installedCount % threshold;
      return {
        ...c,
        plan: plans.find(p => p.id === c.planId) || null,
        installedReferrals: installedCount,
        progressInCycle,
        referralsPerReward: threshold
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getCustomerById(id) {
    await delay();
    const customers = readFromStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    const plans = readFromStorage(STORAGE_KEYS.PLANS, INITIAL_PLANS);
    const customer = customers.find(c => c.id === id);
    if (!customer) return null;

    const referrals = readFromStorage(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
    const rewards = readFromStorage(STORAGE_KEYS.REWARDS, INITIAL_REWARDS);

    // Indicações feitas pelo cliente
    const made = referrals
      .filter(r => r.referrerId === id)
      .map(r => {
        const refereeObj = customers.find(c => c.id === r.refereeId);
        const rewardObj = rewards.find(w => w.referralId === r.id);
        return {
          ...r,
          referee: refereeObj || { name: 'Desconhecido' },
          reward: rewardObj || null
        };
      });

    // Indicação recebida (quem indicou este cliente)
    const received = referrals.find(r => r.refereeId === id);
    let referrer = null;
    if (received) {
      const referrerObj = customers.find(c => c.id === received.referrerId);
      referrer = referrerObj ? { id: referrerObj.id, name: referrerObj.name } : null;
    }

    // Recompensas acumuladas pelo cliente (geradas pelas indicações de status INSTALADO)
    const clientRewards = rewards.filter(w => {
      const ref = referrals.find(r => r.id === w.referralId);
      return ref && ref.referrerId === id;
    }).map(w => {
      const ref = referrals.find(r => r.id === w.referralId);
      const refereeObj = ref ? customers.find(c => c.id === ref.refereeId) : null;
      return {
        ...w,
        refereeName: refereeObj ? refereeObj.name : 'Indicado Desconhecido'
      };
    });

    const settings = readFromStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    const threshold = settings.referralsPerReward || 3;
    const installedCount = made.filter(r => r.status === 'INSTALADO').length;
    const progressInCycle = installedCount % threshold;
    const rewardsEarned = Math.floor(installedCount / threshold);

    return {
      ...customer,
      plan: plans.find(p => p.id === customer.planId) || null,
      referralsMade: made,
      referredBy: referrer,
      rewards: clientRewards,
      installedReferrals: installedCount,
      progressInCycle,
      referralsPerReward: threshold,
      rewardsEarned
    };
  },

  async addCustomer(customerData) {
    await delay();
    const customers = readFromStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    const newCustomer = {
      ...customerData,
      id: 'c_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    customers.push(newCustomer);
    writeToStorage(STORAGE_KEYS.CUSTOMERS, customers);
    addAuditLog('CUSTOMER_CREATED', `Cliente "${newCustomer.name}" cadastrado (${newCustomer.neighborhood}, ${newCustomer.city || 'Teresina'})`);
    return newCustomer;
  },

  async updateCustomer(id, data) {
    await delay();
    const customers = readFromStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Cliente não encontrado');

    const updated = { ...customers[index], ...data };
    customers[index] = updated;
    writeToStorage(STORAGE_KEYS.CUSTOMERS, customers);
    return updated;
  },

  async deleteCustomer(id) {
    await delay();
    const customers = readFromStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    const referrals = readFromStorage(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);

    // Verifica se possui alguma indicação vinculada
    const hasReferrals = referrals.some(r => r.referrerId === id || r.refereeId === id);
    if (hasReferrals) {
      throw new Error('Não é possível excluir um cliente que possui indicações registradas.');
    }

    const customer = customers.find(c => c.id === id);
    const filtered = customers.filter(c => c.id !== id);
    writeToStorage(STORAGE_KEYS.CUSTOMERS, filtered);
    if (customer) addAuditLog('CUSTOMER_DELETED', `Cliente "${customer.name}" removido do sistema`);
    return true;
  },

  // INDICAÇÕES
  async getReferrals() {
    await delay();
    const referrals = readFromStorage(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
    const customers = readFromStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    const rewards = readFromStorage(STORAGE_KEYS.REWARDS, INITIAL_REWARDS);

    return referrals.map(r => {
      const referrer = customers.find(c => c.id === r.referrerId);
      const referee = customers.find(c => c.id === r.refereeId);
      const reward = rewards.find(w => w.referralId === r.id);

      return {
        ...r,
        referrerName: referrer ? referrer.name : 'Ex-cliente',
        referrerPhone: referrer ? referrer.phone : '',
        refereeName: referee ? referee.name : 'Ex-cliente',
        refereePhone: referee ? referee.phone : '',
        refereeCity: referee ? referee.city : '',
        refereeNeighborhood: referee ? referee.neighborhood : '',
        reward: reward || null
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async addReferral(referralData) {
    await delay();
    const referrals = readFromStorage(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);

    // Validação: Não pode indicar a si mesmo
    if (referralData.referrerId === referralData.refereeId) {
      throw new Error('Um cliente não pode indicar a si mesmo.');
    }

    // Validação: Cliente já indicado anteriormente
    const alreadyReferred = referrals.some(r => r.refereeId === referralData.refereeId);
    if (alreadyReferred) {
      throw new Error('Este cliente já possui uma indicação registrada no sistema.');
    }

    const newReferral = {
      ...referralData,
      id: 'r_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    referrals.push(newReferral);
    writeToStorage(STORAGE_KEYS.REFERRALS, referrals);

    // Audit
    const customers = readFromStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    const referrerObj = customers.find(c => c.id === newReferral.referrerId);
    const refereeObj  = customers.find(c => c.id === newReferral.refereeId);
    addAuditLog('REFERRAL_CREATED', `Indicação criada: "${referrerObj?.name || 'Cliente'}" indicou "${refereeObj?.name || 'Cliente'}"`);

    // Regra automática: recalcula recompensas acumuladas
    recalculateReferrerRewards(newReferral.referrerId);

    return newReferral;
  },

  async updateReferral(id, data) {
    await delay();
    const referrals = readFromStorage(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
    const index = referrals.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Indicação não encontrada');

    const previousStatus = referrals[index].status;
    const updated = { ...referrals[index], ...data };
    referrals[index] = updated;
    writeToStorage(STORAGE_KEYS.REFERRALS, referrals);

    // Audit
    if (data.status && data.status !== previousStatus) {
      const customers = readFromStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
      const refereeObj = customers.find(c => c.id === updated.refereeId);
      addAuditLog('REFERRAL_STATUS_CHANGED', `Status da indicação de "${refereeObj?.name || 'Cliente'}" alterado: ${previousStatus} → ${data.status}`);
    }

    // Regra automática: recalcula recompensas acumuladas
    recalculateReferrerRewards(updated.referrerId);

    return updated;
  },

  async deleteReferral(id) {
    await delay();
    const referrals = readFromStorage(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
    const referralToDelete = referrals.find(r => r.id === id);
    if (!referralToDelete) return true;

    const filteredReferrals = referrals.filter(r => r.id !== id);
    writeToStorage(STORAGE_KEYS.REFERRALS, filteredReferrals);

    // Recalcula recompensas para o indicador
    recalculateReferrerRewards(referralToDelete.referrerId);

    const customers = readFromStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    const referrerObj = customers.find(c => c.id === referralToDelete.referrerId);
    const refereeObj = customers.find(c => c.id === referralToDelete.refereeId);
    addAuditLog('REFERRAL_DELETED', `Indicação excluída: "${referrerObj?.name || 'Cliente'}" indicou "${refereeObj?.name || 'Cliente'}"`);

    return true;
  },

  // RECOMPENSAS
  async getRewards() {
    await delay();
    const rewards = readFromStorage(STORAGE_KEYS.REWARDS, INITIAL_REWARDS);
    const referrals = readFromStorage(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
    const customers = readFromStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);

    return rewards.map(w => {
      const referral = referrals.find(r => r.id === w.referralId);
      const referrer = referral ? customers.find(c => c.id === referral.referrerId) : null;
      const referee = referral ? customers.find(c => c.id === referral.refereeId) : null;

      return {
        ...w,
        referrerName: referrer ? referrer.name : 'Ex-cliente',
        referrerPhone: referrer ? referrer.phone : '',
        refereeName: referee ? referee.name : 'Ex-cliente',
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async updateReward(id, data) {
    await delay();
    const rewards = readFromStorage(STORAGE_KEYS.REWARDS, INITIAL_REWARDS);
    const index = rewards.findIndex(w => w.id === id);
    if (index === -1) throw new Error('Recompensa não encontrada');

    const updated = {
      ...rewards[index],
      ...data,
      deliveredAt: data.status === 'ENTREGUE' ? new Date().toISOString() : null
    };
    rewards[index] = updated;
    writeToStorage(STORAGE_KEYS.REWARDS, rewards);
    if (data.status === 'ENTREGUE') {
      const referrals = readFromStorage(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
      const customers = readFromStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
      const referral = referrals.find(r => r.id === updated.referralId);
      const referrer = referral ? customers.find(c => c.id === referral.referrerId) : null;
      addAuditLog('REWARD_DELIVERED', `Recompensa R$ ${updated.value.toFixed(2)} entregue para "${referrer?.name || 'Cliente'}" (${updated.type})`);
    }
    return updated;
  },

  // DATA ANALYTICS & DASHBOARD STATS
  async getDashboardStats() {
    await delay();
    const customers = readFromStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    const referrals = readFromStorage(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
    const rewards = readFromStorage(STORAGE_KEYS.REWARDS, INITIAL_REWARDS);

    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'ATIVO').length;
    const totalReferrals = referrals.length;

    const installedReferrals = referrals.filter(r => r.status === 'INSTALADO').length;
    const pendingReferrals = referrals.filter(r => r.status === 'PENDENTE').length;
    const cancelledReferrals = referrals.filter(r => r.status === 'CANCELADO').length;

    const conversionRate = totalReferrals > 0
      ? Math.round((installedReferrals / totalReferrals) * 100)
      : 0;

    const pendingRewardsCount = rewards.filter(w => w.status === 'PENDENTE').length;
    const deliveredRewardsCount = rewards.filter(w => w.status === 'ENTREGUE').length;

    const totalRewardsValue = rewards.reduce((sum, w) => sum + w.value, 0);
    const deliveredRewardsValue = rewards
      .filter(w => w.status === 'ENTREGUE')
      .reduce((sum, w) => sum + w.value, 0);
    const pendingRewardsValue = rewards
      .filter(w => w.status === 'PENDENTE')
      .reduce((sum, w) => sum + w.value, 0);

    // Clientes que mais indicaram (Ranking Geral)
    const referralCounts = {};
    referrals.forEach(r => {
      referralCounts[r.referrerId] = (referralCounts[r.referrerId] || 0) + 1;
    });

    const conversionCounts = {};
    referrals.filter(r => r.status === 'INSTALADO').forEach(r => {
      conversionCounts[r.referrerId] = (conversionCounts[r.referrerId] || 0) + 1;
    });

    const ranking = Object.keys(referralCounts).map(id => {
      const customer = customers.find(c => c.id === id);
      const rewardSum = rewards
        .filter(w => {
          const ref = referrals.find(r => r.id === w.referralId);
          return ref && ref.referrerId === id && w.status === 'ENTREGUE';
        })
        .reduce((sum, w) => sum + w.value, 0);

      return {
        customerId: id,
        customerName: customer ? customer.name : 'Ex-cliente',
        customerPhone: customer ? customer.phone : '',
        totalReferrals: referralCounts[id],
        convertedReferrals: conversionCounts[id] || 0,
        rewardsPaid: rewardSum
      };
    }).sort((a, b) => b.totalReferrals - a.totalReferrals || b.convertedReferrals - a.convertedReferrals).slice(0, 5);

    // Últimas indicações registradas (limite 5)
    const recentReferrals = referrals.map(r => {
      const referrer = customers.find(c => c.id === r.referrerId);
      const referee = customers.find(c => c.id === r.refereeId);
      return {
        id: r.id,
        referrerName: referrer ? referrer.name : 'Ex-cliente',
        refereeName: referee ? referee.name : 'Ex-cliente',
        status: r.status,
        createdAt: r.createdAt
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    // Distribuição de Indicações por Mês (últimos 6 meses)
    // Criamos meses simulados com base nas datas de cadastro
    const monthlyData = {};
    const monthsName = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    // Gerar últimos 5 meses até o mês atual (Maio/2026 no sistema)
    // Iniciamos com valores zerados
    for (let i = 0; i < 6; i++) {
      const d = new Date('2026-05-20');
      d.setMonth(d.getMonth() - i);
      const key = `${monthsName[d.getMonth()]}/26`;
      monthlyData[key] = { month: key, indicações: 0, conversões: 0 };
    }

    referrals.forEach(r => {
      const date = new Date(r.createdAt);
      const key = `${monthsName[date.getMonth()]}/26`;
      if (monthlyData[key]) {
        monthlyData[key].indicações += 1;
        if (r.status === 'INSTALADO') {
          monthlyData[key].conversões += 1;
        }
      }
    });

    const chartData = Object.values(monthlyData).reverse();

    return {
      totalCustomers,
      activeCustomers,
      totalReferrals,
      installedReferrals,
      pendingReferrals,
      cancelledReferrals,
      conversionRate,
      pendingRewardsCount,
      deliveredRewardsCount,
      totalRewardsValue,
      deliveredRewardsValue,
      pendingRewardsValue,
      ranking,
      recentReferrals,
      chartData
    };
  },

  // USUÁRIOS
  async getUsers() {
    await delay();
    return readFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  async addUser(userData) {
    await delay();
    const users = readFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    const exists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (exists) {
      throw new Error('Já existe um usuário cadastrado com este login/e-mail.');
    }
    const newUser = {
      ...userData,
      id: 'u_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    writeToStorage(STORAGE_KEYS.USERS, users);
    addAuditLog('USER_CREATED', `Operador "${newUser.name}" (${newUser.email}) adicionado à equipe com perfil ${newUser.role}`);
    return newUser;
  },

  async deleteUser(id) {
    await delay();
    const users = readFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    const userToDelete = users.find(u => u.id === id);
    const filtered = users.filter(u => u.id !== id);
    writeToStorage(STORAGE_KEYS.USERS, filtered);
    if (userToDelete) addAuditLog('USER_DELETED', `Operador "${userToDelete.name}" (${userToDelete.email}) removido da equipe`);
    return true;
  },

  async updateUser(id, userData) {
    await delay();
    const users = readFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('Operador não encontrado.');
    }
    
    if (userData.email) {
      const emailExists = users.some(u => u.id !== id && u.email.toLowerCase() === userData.email.toLowerCase());
      if (emailExists) {
        throw new Error('Já existe um operador cadastrado com este e-mail/login.');
      }
    }
    
    const updatedUser = { ...users[userIndex] };
    if (userData.name) updatedUser.name = userData.name;
    if (userData.email) updatedUser.email = userData.email;
    if (userData.role) updatedUser.role = userData.role;
    if (userData.password && userData.password.trim() !== '') {
      updatedUser.password = userData.password;
    }
    
    users[userIndex] = updatedUser;
    writeToStorage(STORAGE_KEYS.USERS, users);
    addAuditLog('USER_UPDATED', `Operador "${updatedUser.name}" (${updatedUser.email}) atualizado. Cargo: ${updatedUser.role}`);
    
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    };
  },


  async authenticateUser(email, password) {
    await delay();
    const users = readFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      throw new Error('Usuário ou senha incorretos.');
    }
    addAuditLog('USER_LOGIN', `Operador "${user.name}" realizou login no sistema`, user.name);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  },

  // AUDITORIA
  async getAuditLogs() {
    await delay();
    return readFromStorage(STORAGE_KEYS.AUDIT, []);
  },

  async clearAuditLogs() {
    await delay();
    writeToStorage(STORAGE_KEYS.AUDIT, []);
    return true;
  }
};
