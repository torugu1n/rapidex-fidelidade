import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Gift, 
  CheckCircle2, 
  Clock, 
  Phone,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

export default function RewardsTab({ openCustomerDetails, showToast, showConfirm }) {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [typeFilter, setTypeFilter] = useState('TODOS');

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const data = await api.getRewards();
      setRewards(data);
    } catch (error) {
      showToast('Erro ao carregar recompensas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleDeliverReward = (id) => {
    showConfirm({
      title: 'Pagar Recompensa',
      description: 'Confirmar que a recompensa foi paga/entregue para o cliente? Esta ação não pode ser desfeita.',
      confirmLabel: 'Confirmar Pagamento',
      cancelLabel: 'Cancelar',
      type: 'success',
      onConfirm: async () => {
        try {
          await api.updateReward(id, { status: 'ENTREGUE' });
          showToast('Recompensa marcada como entregue!', 'success');
          fetchRewards();
        } catch (error) {
          showToast('Erro ao entregar recompensa.', 'error');
        }
      }
    });
  };

  const filteredRewards = rewards.filter(w => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      w.referrerName.toLowerCase().includes(searchLower) ||
      (w.refereeName && w.refereeName.toLowerCase().includes(searchLower));

    const matchesStatus = statusFilter === 'TODOS' || w.status === statusFilter;
    const matchesType = typeFilter === 'TODOS' || w.type.toLowerCase().includes(typeFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Controle de Recompensas</h2>
        <p className="text-sm text-slate-500 dark:text-isp-muted">Acompanhe as recompensas devidas aos clientes indicadores e registre o pagamento manual.</p>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white dark:bg-isp-navy p-4 rounded-2xl border border-slate-200 dark:border-isp-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="w-full md:max-w-md relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-isp-muted" />
          <input
            type="text"
            placeholder="Buscar por cliente indicador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-isp-muted focus:outline-none focus:border-isp-accent dark:focus:border-isp-accent transition-all duration-200"
          />
        </div>

        {/* Filters */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 items-center">
          {/* Status Filter */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 dark:text-isp-muted shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-white focus:outline-none focus:border-isp-accent transition-all duration-200"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="PENDENTE">Pendente</option>
              <option value="ENTREGUE">Entregue</option>
            </select>
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-white focus:outline-none focus:border-isp-accent transition-all duration-200"
          >
            <option value="TODOS">Todos os Tipos</option>
            <option value="Fatura">Desconto na Fatura</option>
            <option value="Pix">Pix / Dinheiro</option>
          </select>
        </div>
      </div>

      {/* Rewards Table */}
      <div className="bg-white dark:bg-isp-navy rounded-2xl border border-slate-200 dark:border-isp-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-isp-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-isp-muted font-medium text-xs">Carregando controle de recompensas...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-isp-border/30 text-xs font-semibold text-slate-400 dark:text-isp-muted uppercase bg-slate-50/50 dark:bg-isp-border/10">
                  <th className="py-4 px-6">Cliente Beneficiário (Indicador)</th>
                  <th className="py-4 px-6">Indicação de Origem</th>
                  <th className="py-4 px-6">Tipo Recompensa</th>
                  <th className="py-4 px-6">Valor</th>
                  <th className="py-4 px-6">Status Entrega</th>
                  <th className="py-4 px-6">Datas</th>
                  <th className="py-4 px-6 text-right text-xs">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-isp-border/20 text-sm">
                {filteredRewards.map((reward) => (
                  <tr 
                    key={reward.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-isp-border/10 transition-all duration-200"
                  >
                    {/* Referrer */}
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => openCustomerDetails(reward.referrerId)}
                        className="font-semibold text-slate-800 dark:text-white hover:text-isp-accent hover:underline text-left block"
                      >
                        {reward.referrerName}
                      </button>
                      <span className="text-xs text-slate-400 dark:text-isp-muted flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {reward.referrerPhone}
                      </span>
                    </td>

                    {/* Referee */}
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                      Indicação de: <span className="font-semibold text-slate-700 dark:text-slate-200">{reward.refereeName}</span>
                    </td>

                    {/* Type */}
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-isp-accent" />
                        <span>{reward.type}</span>
                      </span>
                    </td>

                    {/* Value */}
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-white">
                      R$ {reward.value.toFixed(2)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        reward.status === 'ENTREGUE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500 animate-pulse'
                      }`}>
                        {reward.status === 'ENTREGUE' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        <span>{reward.status}</span>
                      </span>
                    </td>

                    {/* Dates */}
                    <td className="py-4 px-6 text-slate-500 dark:text-isp-muted whitespace-nowrap text-xs space-y-0.5">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Gerada: {new Date(reward.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                      {reward.deliveredAt && (
                        <div className="flex items-center gap-1 text-emerald-500">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Entregue: {new Date(reward.deliveredAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      {reward.status === 'PENDENTE' ? (
                        <button
                          onClick={() => handleDeliverReward(reward.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-isp-accent hover:bg-isp-accent/90 text-white transition-all duration-200 shadow-sm shadow-isp-accent/15"
                        >
                          Marcar como Entregue
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-isp-muted font-medium flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          Pago
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredRewards.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="flex flex-col items-center justify-center text-slate-400 dark:text-isp-muted gap-1">
                        <AlertCircle className="w-8 h-8 text-slate-300 dark:text-isp-border" />
                        <span className="text-sm font-semibold">Nenhuma recompensa a ser exibida.</span>
                        <span className="text-xs">Ajuste os filtros ou registre novas instalações.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
