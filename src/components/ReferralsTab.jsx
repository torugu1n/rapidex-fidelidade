import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MessageSquare,
  Gift,
  ArrowRight,
  Trash2,
  Calendar
} from 'lucide-react';
import { api } from '../services/api';

export default function ReferralsTab({ openNewReferralModal, openCustomerDetails, showToast, showConfirm, currentUser }) {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const data = await api.getReferrals();
      setReferrals(data);
    } catch (error) {
      showToast('Erro ao carregar indicações.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    if (newStatus === 'CANCELADO') {
      showConfirm({
        title: 'Cancelar Indicação',
        description: 'Tem certeza que deseja cancelar esta indicação?',
        confirmLabel: 'Cancelar Indicação',
        cancelLabel: 'Voltar',
        type: 'warning',
        onConfirm: async () => {
          try {
            await api.updateReferral(id, { status: newStatus });
            showToast(`Indicação cancelada!`, 'success');
            fetchReferrals();
          } catch (error) {
            showToast(error.message || 'Erro ao atualizar indicação.', 'error');
          }
        }
      });
    } else if (newStatus === 'INSTALADO') {
      showConfirm({
        title: 'Marcar como Instalado',
        description: 'Confirmar que o serviço foi instalado para este indicado? Se o ciclo de indicações for atingido, uma recompensa será gerada.',
        confirmLabel: 'Confirmar Instalação',
        cancelLabel: 'Voltar',
        type: 'success',
        onConfirm: async () => {
          try {
            await api.updateReferral(id, { status: newStatus });
            showToast(`Indicação marcada como instalada!`, 'success');
            fetchReferrals();
          } catch (error) {
            showToast(error.message || 'Erro ao atualizar indicação.', 'error');
          }
        }
      });
    } else {
      try {
        await api.updateReferral(id, { status: newStatus });
        showToast(`Indicação atualizada para ${newStatus}!`, 'success');
        fetchReferrals();
      } catch (error) {
        showToast(error.message || 'Erro ao atualizar indicação.', 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    if (currentUser?.role !== 'ADMIN') {
      showToast('Apenas administradores possuem permissão para excluir indicações.', 'error');
      return;
    }
    showConfirm({
      title: 'Excluir Indicação',
      description: 'Tem certeza que deseja excluir esta indicação? Se houver recompensa pendente associada, ela também será removida.',
      confirmLabel: 'Excluir',
      cancelLabel: 'Cancelar',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.deleteReferral(id);
          showToast('Indicação removida.', 'success');
          fetchReferrals();
        } catch (error) {
          showToast('Erro ao excluir indicação.', 'error');
        }
      }
    });
  };

  const filteredReferrals = referrals.filter(r => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      r.referrerName.toLowerCase().includes(searchLower) ||
      r.refereeName.toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === 'TODOS' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Gerenciamento de Indicações</h2>
          <p className="text-sm text-slate-500 dark:text-isp-muted">Acompanhe quem indicou novos assinantes e valide o status da instalação.</p>
        </div>
        <button
          onClick={openNewReferralModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-isp-accent hover:bg-isp-accent/90 text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-isp-accent/20 align-self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Indicação</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white dark:bg-isp-navy p-4 rounded-2xl border border-slate-200 dark:border-isp-border shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="w-full sm:max-w-md relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-isp-muted" />
          <input
            type="text"
            placeholder="Buscar por indicador ou indicado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-isp-muted focus:outline-none focus:border-isp-accent dark:focus:border-isp-accent transition-all duration-200"
          />
        </div>

        {/* Filters */}
        <div className="w-full sm:w-auto flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 dark:text-isp-muted" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-white focus:outline-none focus:border-isp-accent transition-all duration-200"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="PENDENTE">Pendente</option>
            <option value="INSTALADO">Instalado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Referrals Table */}
      <div className="bg-white dark:bg-isp-navy rounded-2xl border border-slate-200 dark:border-isp-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-isp-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-isp-muted font-medium text-xs">Carregando indicações...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-isp-border/30 text-xs font-semibold text-slate-400 dark:text-isp-muted uppercase bg-slate-50/50 dark:bg-isp-border/10">
                  <th className="py-4 px-6">Cliente Indicador</th>
                  <th className="py-4 px-6 text-center"></th>
                  <th className="py-4 px-6">Novo Assinante (Indicado)</th>
                  <th className="py-4 px-6">Data Indicação</th>
                  <th className="py-4 px-6">Status Indicação</th>
                  <th className="py-4 px-6">Recompensa Associada</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-isp-border/20 text-sm">
                {filteredReferrals.map((ref) => (
                  <tr 
                    key={ref.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-isp-border/10 transition-all duration-200 group"
                  >
                    {/* Referrer */}
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => openCustomerDetails(ref.referrerId)}
                        className="font-semibold text-slate-800 dark:text-white hover:text-isp-accent hover:underline text-left block"
                      >
                        {ref.referrerName}
                      </button>
                      <span className="text-xs text-slate-400 dark:text-isp-muted block mt-0.5">{ref.referrerPhone}</span>
                    </td>

                    {/* Arrow Icon */}
                    <td className="py-4 px-2 text-center text-slate-400">
                      <ArrowRight className="w-4 h-4 mx-auto text-isp-accent/50" />
                    </td>

                    {/* Referee */}
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => openCustomerDetails(ref.refereeId)}
                        className="font-semibold text-slate-800 dark:text-white hover:text-isp-accent hover:underline text-left block"
                      >
                        {ref.refereeName}
                      </button>
                      <span className="text-xs text-slate-400 dark:text-isp-muted block mt-0.5">{ref.refereePhone}</span>
                      {ref.refereeNeighborhood && (
                        <span className="text-[10px] bg-slate-100 dark:bg-isp-border/30 text-slate-500 dark:text-isp-muted px-1.5 py-0.5 rounded mt-1 inline-block">
                          {ref.refereeNeighborhood} - {ref.refereeCity}
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-slate-500 dark:text-isp-muted whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(ref.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        ref.status === 'INSTALADO' ? 'bg-emerald-500/10 text-emerald-500' :
                        ref.status === 'PENDENTE' ? 'bg-amber-500/10 text-amber-500 animate-pulse' :
                        'bg-rose-500/10 text-rose-500'
                      }`}>
                        {ref.status === 'INSTALADO' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {ref.status === 'PENDENTE' && <Clock className="w-3.5 h-3.5" />}
                        {ref.status === 'CANCELADO' && <XCircle className="w-3.5 h-3.5" />}
                        <span>{ref.status}</span>
                      </span>
                      {ref.notes && (
                        <div className="text-[10px] text-slate-400 dark:text-isp-muted mt-1 max-w-[200px] truncate" title={ref.notes}>
                          Obs: {ref.notes}
                        </div>
                      )}
                    </td>

                    {/* Reward details */}
                    <td className="py-4 px-6">
                      {ref.reward ? (
                        <div className="space-y-1">
                          <span className="font-semibold text-slate-800 dark:text-white block">
                            R$ {ref.reward.value.toFixed(2)}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            ref.reward.status === 'ENTREGUE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}>
                            <Gift className="w-2.5 h-2.5" />
                            <span>{ref.reward.status}</span>
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-isp-muted">Nenhuma</span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {ref.status === 'PENDENTE' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(ref.id, 'CANCELADO')}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-200"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(ref.id, 'INSTALADO')}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-200 shadow-sm"
                            >
                              Instalar
                            </button>
                          </>
                        )}
                        {currentUser?.role === 'ADMIN' && (
                          <button
                            onClick={() => handleDelete(ref.id)}
                            title="Remover Indicação"
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredReferrals.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-slate-400 dark:text-isp-muted">
                      Nenhuma indicação encontrada.
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
