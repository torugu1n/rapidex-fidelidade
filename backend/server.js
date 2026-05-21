// Servidor Backend Express - ISP Fidelidade
// Integração direta com PostgreSQL via Prisma ORM

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Helper para Registrar Logs de Auditoria
async function addAuditLog(req, action, description) {
  try {
    const operatorName = req ? (req.headers['x-operator-name'] || 'Sistema') : 'Sistema';
    await prisma.auditLog.create({
      data: {
        action,
        description,
        operatorName
      }
    });
  } catch (error) {
    console.error('Erro ao salvar log de auditoria:', error);
  }
}

// Configurações Globais Padrão (Simuladas no banco)
let defaultSettings = {
  defaultRewardType: 'Desconto de R$ 50,00 na Fatura',
  defaultRewardValue: 50.00,
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

// ==================== ROTAS DE CONFIGURAÇÃO & RESET ====================

app.get('/api/settings', (req, res) => {
  res.json({ ...defaultSettings, mockDelayEnabled: false, latencyMs: 0 });
});

app.put('/api/settings', async (req, res) => {
  defaultSettings = {
    ...defaultSettings,
    adminName: req.body.adminName || defaultSettings.adminName,
    adminEmail: req.body.adminEmail || defaultSettings.adminEmail,
    defaultRewardType: req.body.defaultRewardType || defaultSettings.defaultRewardType,
    defaultRewardValue: parseFloat(req.body.defaultRewardValue) || defaultSettings.defaultRewardValue,
    referralsPerReward: parseInt(req.body.referralsPerReward) || defaultSettings.referralsPerReward,
    rewardTypes: req.body.rewardTypes || defaultSettings.rewardTypes
  };
  await addAuditLog(req, 'SETTINGS_UPDATE', 'Configurações gerais atualizadas');
  res.json({ ...defaultSettings, mockDelayEnabled: false, latencyMs: 0 });
});

// Função para popular/semear o Banco de Dados com todos os dados padrão (Mock)
async function seedDatabase() {
  // Limpar tabelas existentes
  await prisma.reward.deleteMany({});
  await prisma.referral.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.plan.deleteMany({});
  await prisma.user.deleteMany({});
  
  // Semente do Administrador Padrão e Atendente Padrão
  await prisma.user.create({
    data: {
      email: 'admin.rapidex',
      passwordHash: 'Rapidex@2026#',
      name: 'Administrador Rapidex',
      role: 'ADMIN'
    }
  });

  await prisma.user.create({
    data: {
      email: 'rogerio.castro',
      passwordHash: 'Hbusa@2009',
      name: 'Rogério Castro',
      role: 'ATENDENTE'
    }
  });

  // Semente dos Planos
  const p1 = await prisma.plan.create({ data: { id: 'p1', name: '100 Mega Fibra', price: 79.90 } });
  const p2 = await prisma.plan.create({ data: { id: 'p2', name: '300 Mega Fibra', price: 99.90 } });
  const p3 = await prisma.plan.create({ data: { id: 'p3', name: '500 Mega Fibra', price: 119.90 } });
  const p4 = await prisma.plan.create({ data: { id: 'p4', name: '1 Giga Ultra Fibra', price: 149.90 } });

  // Semente dos Clientes
  const c1 = await prisma.customer.create({ data: { id: 'c1', name: 'Carlos Alberto Silva', phone: '(86) 99843-2198', cpf: '123.456.789-00', planId: p3.id, city: 'Teresina', neighborhood: 'Jóquei' } });
  const c2 = await prisma.customer.create({ data: { id: 'c2', name: 'Ana Beatriz Souza', phone: '(86) 98122-4532', cpf: '987.654.321-11', planId: p2.id, city: 'Teresina', neighborhood: 'Fátima' } });
  const c3 = await prisma.customer.create({ data: { id: 'c3', name: 'Marcos Vinícius Oliveira', phone: '(86) 99244-8877', cpf: '456.789.123-22', planId: p4.id, city: 'Teresina', neighborhood: 'Centro' } });
  const c4 = await prisma.customer.create({ data: { id: 'c4', name: 'Mariana Costa Ramos', phone: '(86) 98877-6655', cpf: '321.654.987-33', planId: p2.id, city: 'Teresina', neighborhood: 'Horto' } });
  const c5 = await prisma.customer.create({ data: { id: 'c5', name: 'Felipe Santos Oliveira', phone: '(86) 99311-2233', cpf: '159.753.486-44', planId: p1.id, status: 'INATIVO', city: 'Teresina', neighborhood: 'Dirceu' } });
  const c6 = await prisma.customer.create({ data: { id: 'c6', name: 'Juliana Mendes Lima', phone: '(86) 98144-5566', cpf: '852.963.741-55', planId: p3.id, city: 'Teresina', neighborhood: 'Ininga' } });
  const c7 = await prisma.customer.create({ data: { id: 'c7', name: 'Roberto Rocha Santos', phone: '(86) 99988-1122', cpf: '369.258.147-66', planId: p2.id, city: 'Teresina', neighborhood: 'Morada do Sol' } });
  const c8 = await prisma.customer.create({ data: { id: 'c8', name: 'Patrícia Alves Carvalho', phone: '(86) 98844-3322', cpf: '741.852.963-77', planId: p3.id, city: 'Teresina', neighborhood: 'Ilhotas' } });
  const c9 = await prisma.customer.create({ data: { id: 'c9', name: 'Lucas Ferreira Lima', phone: '(86) 97122-3344', cpf: '123.789.456-88', planId: p4.id, city: 'Teresina', neighborhood: 'Mocambinho' } });
  const c10 = await prisma.customer.create({ data: { id: 'c10', name: 'Amanda Melo Pereira', phone: '(86) 99345-6789', cpf: '951.357.852-99', planId: p1.id, city: 'Teresina', neighborhood: 'Vermelha' } });

  // Semente das Indicações
  const r1 = await prisma.referral.create({ data: { id: 'r1', referrerId: c1.id, refereeId: c4.id, status: 'INSTALADO' } });
  const r2 = await prisma.referral.create({ data: { id: 'r2', referrerId: c1.id, refereeId: c5.id, status: 'CANCELADO' } });
  const r3 = await prisma.referral.create({ data: { id: 'r3', referrerId: c1.id, refereeId: c8.id, status: 'INSTALADO' } });
  const r4 = await prisma.referral.create({ data: { id: 'r4', referrerId: c2.id, refereeId: c6.id, status: 'INSTALADO' } });
  const r5 = await prisma.referral.create({ data: { id: 'r5', referrerId: c2.id, refereeId: c7.id, status: 'INSTALADO' } });
  const r6 = await prisma.referral.create({ data: { id: 'r6', referrerId: c8.id, refereeId: c9.id, status: 'INSTALADO' } });
  const r7 = await prisma.referral.create({ data: { id: 'r7', referrerId: c3.id, refereeId: c10.id, status: 'PENDENTE' } });

  // Semente de Recompensas
  await prisma.reward.create({ data: { referralId: r1.id, type: 'Desconto de R$ 50,00 na Fatura', value: 50.00, status: 'ENTREGUE', deliveredAt: new Date() } });
  await prisma.reward.create({ data: { referralId: r3.id, type: 'Desconto de R$ 50,00 na Fatura', value: 50.00, status: 'PENDENTE' } });
  await prisma.reward.create({ data: { referralId: r4.id, type: 'Pix de R$ 50,00', value: 50.00, status: 'ENTREGUE', deliveredAt: new Date() } });
  await prisma.reward.create({ data: { referralId: r5.id, type: 'Pix de R$ 50,00', value: 50.00, status: 'ENTREGUE', deliveredAt: new Date() } });
  await prisma.reward.create({ data: { referralId: r6.id, type: 'Desconto de R$ 50,00 na Fatura', value: 50.00, status: 'PENDENTE' } });
}

// Rota de semeadura (Seed) do Banco de Dados
app.post('/api/reset', async (req, res) => {
  try {
    await seedDatabase();
    await addAuditLog(req, 'SYSTEM_RESET', 'Banco de dados redefinido e semeado com dados padrão');
    res.json({ message: 'Banco de dados redefinido e povoado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao resetar o banco de dados.' });
  }
});

// ==================== ROTAS DE PLANOS ====================

app.get('/api/plans', async (req, res) => {
  try {
    const plans = await prisma.plan.findMany({ orderBy: { price: 'asc' } });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar planos.' });
  }
});

app.post('/api/plans', async (req, res) => {
  try {
    const { name, price } = req.body;
    const plan = await prisma.plan.create({
      data: { name, price: parseFloat(price) }
    });
    await addAuditLog(req, 'PLAN_CREATE', `Plano ${name} adicionado com valor R$ ${parseFloat(price).toFixed(2)}`);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar plano.' });
  }
});

// ==================== ROTAS DE CLIENTES ====================

app.get('/api/customers', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: { plan: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clientes.' });
  }
});

app.get('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        plan: true,
      }
    });

    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Buscar indicações feitas por este cliente
    const referralsMade = await prisma.referral.findMany({
      where: { referrerId: id },
      include: {
        referee: true,
        reward: true
      }
    });

    // Buscar quem indicou este cliente
    const referredByReferral = await prisma.referral.findFirst({
      where: { refereeId: id },
      include: { referrer: true }
    });

    const referredByObj = referredByReferral 
      ? { id: referredByReferral.referrer.id, name: referredByReferral.referrer.name } 
      : null;

    // Buscar recompensas geradas por indicações deste cliente
    const rewards = await prisma.reward.findMany({
      where: {
        referral: { referrerId: id }
      },
      include: {
        referral: {
          include: { referee: true }
        }
      }
    });

    const populatedRewards = rewards.map(w => ({
      id: w.id,
      referralId: w.referralId,
      type: w.type,
      value: w.value,
      status: w.status,
      deliveredAt: w.deliveredAt,
      createdAt: w.createdAt,
      refereeName: w.referral.referee.name
    }));

    res.json({
      ...customer,
      referralsMade,
      referredBy: referredByObj,
      rewards: populatedRewards
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar detalhes do cliente.' });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { name, phone, cpf, planId, city, neighborhood, status } = req.body;
    const customer = await prisma.customer.create({
      data: { name, phone, cpf, planId, city, neighborhood, status }
    });
    await addAuditLog(req, 'CUSTOMER_CREATE', `Cliente ${name} cadastrado`);
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar cliente.' });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, cpf, planId, city, neighborhood, status, notes } = req.body;
    const customer = await prisma.customer.update({
      where: { id },
      data: { name, phone, cpf, planId, city, neighborhood, status, notes }
    });
    await addAuditLog(req, 'CUSTOMER_UPDATE', `Dados do cliente ${name} atualizados`);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar cliente.' });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    // Verificar se o cliente possui indicações registradas
    const referralsCount = await prisma.referral.count({
      where: {
        OR: [
          { referrerId: id },
          { refereeId: id }
        ]
      }
    });

    if (referralsCount > 0) {
      return res.status(400).json({ 
        message: 'Não é possível excluir um cliente que possui indicações vinculadas.' 
      });
    }

    await prisma.customer.delete({ where: { id } });
    await addAuditLog(req, 'CUSTOMER_DELETE', `Cliente ${customer.name} excluído`);
    res.json({ message: 'Cliente excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar cliente.' });
  }
});

// ==================== ROTAS DE INDICAÇÕES ====================

app.get('/api/referrals', async (req, res) => {
  try {
    const referrals = await prisma.referral.findMany({
      include: {
        referrer: true,
        referee: true,
        reward: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = referrals.map(r => ({
      id: r.id,
      referrerId: r.referrerId,
      referrerName: r.referrer.name,
      referrerPhone: r.referrer.phone,
      refereeId: r.refereeId,
      refereeName: r.referee.name,
      refereePhone: r.referee.phone,
      refereeCity: r.referee.city,
      refereeNeighborhood: r.referee.neighborhood,
      status: r.status,
      notes: r.notes,
      createdAt: r.createdAt,
      reward: r.reward ? {
        id: r.reward.id,
        value: r.reward.value,
        status: r.reward.status
      } : null
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar indicações.' });
  }
});

async function recalculateRealReferrerRewards(referrerId) {
  if (!referrerId) return;
  const threshold = defaultSettings.referralsPerReward || 3;

  // 1. Obter todas as indicações INSTALADAS deste padrinho, ordenadas por criação
  const installed = await prisma.referral.findMany({
    where: { referrerId, status: 'INSTALADO' },
    orderBy: { createdAt: 'asc' }
  });

  const triggerIds = new Set(
    installed.filter((r, idx) => (idx + 1) % threshold === 0).map(r => r.id)
  );

  // 2. Obter todas as indicações deste padrinho
  const allReferrals = await prisma.referral.findMany({
    where: { referrerId }
  });
  const referrerReferralIds = allReferrals.map(r => r.id);

  // 3. Obter prêmios atuais vinculados a essas indicações
  const rewards = await prisma.reward.findMany({
    where: { referralId: { in: referrerReferralIds } }
  });

  // 4. Remover prêmios PENDENTES que não batem mais com os gatilhos múltiplos de X
  for (const reward of rewards) {
    if (!triggerIds.has(reward.referralId) && reward.status === 'PENDENTE') {
      await prisma.reward.delete({
        where: { id: reward.id }
      });
    }
  }

  // 5. Adicionar prêmios que deveriam estar lá mas não estão
  for (const refId of triggerIds) {
    const exists = rewards.some(w => w.referralId === refId);
    if (!exists) {
      await prisma.reward.create({
        data: {
          referralId: refId,
          type: defaultSettings.defaultRewardType || 'Desconto de R$ 50,00 na Fatura',
          value: defaultSettings.defaultRewardValue || 50.00,
          status: 'PENDENTE'
        }
      });
    }
  }
}

app.post('/api/referrals', async (req, res) => {
  try {
    const { referrerId, refereeId, status, notes } = req.body;

    if (referrerId === refereeId) {
      return res.status(400).json({ message: 'Um cliente não pode indicar a si mesmo.' });
    }

    // Verificar se indicado já possui uma indicação
    const alreadyReferred = await prisma.referral.findFirst({
      where: { refereeId }
    });

    if (alreadyReferred) {
      return res.status(400).json({ message: 'Este cliente já possui uma indicação registrada.' });
    }

    const referrer = await prisma.customer.findUnique({ where: { id: referrerId } });
    const referee = await prisma.customer.findUnique({ where: { id: refereeId } });

    const referral = await prisma.referral.create({
      data: { referrerId, refereeId, status, notes }
    });

    // Recalcular recompensas acumuladas
    await recalculateRealReferrerRewards(referrerId);

    const referrerName = referrer ? referrer.name : 'Desconhecido';
    const refereeName = referee ? referee.name : 'Desconhecido';
    await addAuditLog(req, 'REFERRAL_CREATE', `Indicação registrada de ${referrerName} para ${refereeName}`);

    res.json(referral);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar indicação.' });
  }
});

app.put('/api/referrals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const previousReferral = await prisma.referral.findUnique({
      where: { id },
      include: { referrer: true, referee: true }
    });

    if (!previousReferral) {
      return res.status(404).json({ error: 'Indicação não encontrada.' });
    }

    const referral = await prisma.referral.update({
      where: { id },
      data: { status, notes }
    });

    // Recalcular recompensas acumuladas
    await recalculateRealReferrerRewards(referral.referrerId);

    const referrerName = previousReferral.referrer ? previousReferral.referrer.name : 'Desconhecido';
    const refereeName = previousReferral.referee ? previousReferral.referee.name : 'Desconhecido';
    await addAuditLog(req, 'REFERRAL_UPDATE', `Indicação de ${referrerName} para ${refereeName} atualizada para o status ${status}`);

    res.json(referral);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar indicação.' });
  }
});

app.delete('/api/referrals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const referral = await prisma.referral.findUnique({
      where: { id },
      include: { referrer: true, referee: true }
    });
    if (!referral) {
      return res.status(404).json({ error: 'Indicação não encontrada.' });
    }

    // Deleta prêmio associado pendente antes de deletar a indicação
    await prisma.reward.deleteMany({ where: { referralId: id, status: 'PENDENTE' } });
    await prisma.referral.delete({ where: { id } });

    // Recalcular recompensas acumuladas
    await recalculateRealReferrerRewards(referral.referrerId);

    const referrerName = referral.referrer ? referral.referrer.name : 'Desconhecido';
    const refereeName = referral.referee ? referral.referee.name : 'Desconhecido';
    await addAuditLog(req, 'REFERRAL_DELETE', `Indicação de ${referrerName} para ${refereeName} excluída`);

    res.json({ message: 'Indicação removida com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir indicação.' });
  }
});

// ==================== ROTAS DE RECOMPENSAS ====================

app.get('/api/rewards', async (req, res) => {
  try {
    const rewards = await prisma.reward.findMany({
      include: {
        referral: {
          include: {
            referrer: true,
            referee: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = rewards.map(w => ({
      id: w.id,
      referralId: w.referralId,
      type: w.type,
      value: w.value,
      status: w.status,
      deliveredAt: w.deliveredAt,
      createdAt: w.createdAt,
      referrerId: w.referral.referrerId,
      referrerName: w.referral.referrer.name,
      referrerPhone: w.referral.referrer.phone,
      refereeName: w.referral.referee.name
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar recompensas.' });
  }
});

app.put('/api/rewards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const reward = await prisma.reward.update({
      where: { id },
      data: {
        status,
        deliveredAt: status === 'ENTREGUE' ? new Date() : null
      },
      include: {
        referral: {
          include: { referrer: true, referee: true }
        }
      }
    });

    const referrerName = reward.referral.referrer ? reward.referral.referrer.name : 'Desconhecido';
    const refereeName = reward.referral.referee ? reward.referral.referee.name : 'Desconhecido';
    const desc = status === 'ENTREGUE'
      ? `Recompensa de R$ ${reward.value.toFixed(2)} (${reward.type}) entregue a ${referrerName} (referente a indicação de ${refereeName})`
      : `Recompensa de R$ ${reward.value.toFixed(2)} (${reward.type}) alterada para o status ${status}`;
    await addAuditLog(req, 'REWARD_UPDATE', desc);

    res.json(reward);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao entregar recompensa.' });
  }
});

// ==================== ROTA DE MÉTRICAS / DASHBOARD ====================

app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const totalCustomers = await prisma.customer.count({});
    const activeCustomers = await prisma.customer.count({ where: { status: 'ATIVO' } });
    const totalReferrals = await prisma.referral.count({});
    const installedReferrals = await prisma.referral.count({ where: { status: 'INSTALADO' } });
    const pendingReferrals = await prisma.referral.count({ where: { status: 'PENDENTE' } });
    
    const conversionRate = totalReferrals > 0 
      ? Math.round((installedReferrals / totalReferrals) * 100)
      : 0;

    const rewards = await prisma.reward.findMany({});
    const pendingRewardsCount = rewards.filter(w => w.status === 'PENDENTE').length;
    const deliveredRewardsCount = rewards.filter(w => w.status === 'ENTREGUE').length;

    const totalRewardsValue = rewards.reduce((sum, w) => sum + w.value, 0);
    const deliveredRewardsValue = rewards.filter(w => w.status === 'ENTREGUE').reduce((sum, w) => sum + w.value, 0);
    const pendingRewardsValue = rewards.filter(w => w.status === 'PENDENTE').reduce((sum, w) => sum + w.value, 0);

    // Clientes que mais indicaram (Ranking Geral)
    const customers = await prisma.customer.findMany({
      include: {
        referralsMade: {
          include: { reward: true }
        }
      }
    });

    const ranking = customers.map(c => {
      const totalRefs = c.referralsMade.length;
      const convertedRefs = c.referralsMade.filter(r => r.status === 'INSTALADO').length;
      const rewardsPaid = c.referralsMade
        .filter(r => r.reward && r.reward.status === 'ENTREGUE')
        .reduce((sum, r) => sum + r.reward.value, 0);

      return {
        customerId: c.id,
        customerName: c.name,
        customerPhone: c.phone,
        totalReferrals: totalRefs,
        convertedReferrals: convertedRefs,
        rewardsPaid
      };
    })
    .filter(item => item.totalReferrals > 0)
    .sort((a, b) => b.totalReferrals - a.totalReferrals || b.convertedReferrals - a.convertedReferrals)
    .slice(0, 5);

    // Últimas 5 indicações
    const recentReferralsRaw = await prisma.referral.findMany({
      include: {
        referrer: true,
        referee: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const recentReferrals = recentReferralsRaw.map(r => ({
      id: r.id,
      referrerName: r.referrer.name,
      refereeName: r.referee.name,
      status: r.status,
      createdAt: r.createdAt
    }));

    // Dados de gráfico mockados estruturados nos meses corretos
    const chartData = [
      { month: 'Jan/26', indicações: 4, conversões: 2 },
      { month: 'Fev/26', indicações: 5, conversões: 3 },
      { month: 'Mar/26', indicações: 7, conversões: 5 },
      { month: 'Abr/26', indicações: totalReferrals, conversões: installedReferrals }, // Reflete dados atuais
    ];

    res.json({
      adminName: defaultSettings.adminName,
      adminEmail: defaultSettings.adminEmail,
      totalCustomers,
      activeCustomers,
      totalReferrals,
      installedReferrals,
      pendingReferrals,
      conversionRate,
      pendingRewardsCount,
      deliveredRewardsCount,
      totalRewardsValue,
      deliveredRewardsValue,
      pendingRewardsValue,
      ranking,
      recentReferrals,
      chartData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao calcular estatísticas do painel.' });
  }
});

// ==================== ROTAS DE USUÁRIOS E AUTENTICAÇÃO ====================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: 'insensitive' },
        passwordHash: password
      }
    });
    if (!user) {
      await addAuditLog(null, 'LOGIN_FAILED', `Tentativa de login malsucedida para o e-mail: ${email}`);
      return res.status(401).json({ message: 'Usuário ou senha incorretos.' });
    }
    await addAuditLog({ headers: { 'x-operator-name': user.name } }, 'LOGIN_SUCCESS', `Operador ${user.name} realizou login`);
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar login no backend.' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt
    })));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar usuários.' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await prisma.user.findUnique({
      where: { email }
    });
    if (exists) {
      return res.status(400).json({ message: 'Já existe um usuário cadastrado com este login/e-mail.' });
    }
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: password,
        role
      }
    });
    await addAuditLog(req, 'USER_CREATE', `Operador ${name} (${email}) cadastrado com o cargo ${role}`);
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar operador no backend.' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'Operador não encontrado.' });
    }
    await prisma.user.delete({ where: { id } });
    await addAuditLog(req, 'USER_DELETE', `Operador ${user.name} (${user.email}) excluído`);
    res.json({ message: 'Operador removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar operador no backend.' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const exists = await prisma.user.findUnique({
      where: { id }
    });
    if (!exists) {
      return res.status(404).json({ message: 'Operador não encontrado.' });
    }

    if (email) {
      const emailConflict = await prisma.user.findFirst({
        where: {
          email: { equals: email, mode: 'insensitive' },
          NOT: { id }
        }
      });
      if (emailConflict) {
        return res.status(400).json({ message: 'Já existe um operador cadastrado com este e-mail/login.' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password && password.trim() !== '') {
      updateData.passwordHash = password;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData
    });

    await addAuditLog(req, 'USER_UPDATE', `Operador ${user.name} (${user.email}) atualizado`);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar operador no backend.' });
  }
});


// ==================== ROTAS DE AUDITORIA ====================

app.get('/api/audit', async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar logs de auditoria.' });
  }
});

app.delete('/api/audit', async (req, res) => {
  try {
    await prisma.auditLog.deleteMany({});
    await addAuditLog(req, 'AUDIT_CLEAR', 'Histórico de auditoria limpo pelo operador');
    res.json({ message: 'Histórico de auditoria limpo com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao limpar logs de auditoria.' });
  }
});


// Servir arquivos estáticos do frontend em produção
const path = require('path');
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback para React Router (Single Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Função para sementes (seed) automáticas de usuários e planos caso o banco esteja vazio
async function autoSeed() {
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('Banco de dados limpo detectado. Executando seed automático de usuários e dados iniciais...');
      await seedDatabase();
      console.log('Seed automático concluído com sucesso.');
    }
  } catch (error) {
    console.error('Erro ao executar seed automático:', error);
  }
}

// Inicialização do servidor
app.listen(PORT, async () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
  await autoSeed();
});
