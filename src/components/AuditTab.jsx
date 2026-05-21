import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  RefreshCw 
} from 'lucide-react';
import { api } from '../services/api';

export default function AuditTab({ showToast, showConfirm, currentUser }) {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auditFilter, setAuditFilter] = useState('TODOS');
  const [auditSearch, setAuditSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 12;

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const logs = await api.getAuditLogs();
      setAuditLogs(logs);
    } catch (e) {
      showToast('Erro ao carregar histórico de auditoria.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'ADMIN') {
      loadAuditLogs();
    }
  }, [currentUser]);

  const handleClearAudit = () => {
    showConfirm({
      title: 'Limpar Auditoria',
      description: 'ATENÇÃO: Deseja realmente excluir TODOS os logs de auditoria do sistema? Esta ação é permanente e não poderá ser revertida.',
      confirmLabel: 'Limpar Logs',
      cancelLabel: 'Voltar',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.clearAuditLogs();
          showToast('Histórico de auditoria limpo com sucesso.', 'success');
          setAuditLogs([]);
        } catch (e) {
          showToast('Erro ao limpar histórico de auditoria.', 'error');
        }
      }
    });
  };

  // Filtrar logs de auditoria
  const filteredLogs = auditLogs.filter(log => {
    const searchLower = auditSearch.toLowerCase();
    const matchesSearch = 
      log.description.toLowerCase().includes(searchLower) ||
      log.operatorName.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower);

    if (auditFilter === 'TODOS') return matchesSearch;
    if (auditFilter === 'CLIENTES') return matchesSearch && log.action.includes('CUSTOMER');
    if (auditFilter === 'INDICACOES') return matchesSearch && log.action.includes('REFERRAL');
    if (auditFilter === 'RECOMPENSAS') return matchesSearch && log.action.includes('REWARD');
    if (auditFilter === 'EQUIPE') return matchesSearch && log.action.includes('USER');
    if (auditFilter === 'CONFIG') return matchesSearch && (log.action.includes('SETTINGS') || log.action.includes('PLAN') || log.action.includes('DATABASE'));
    return matchesSearch;
  });

  // Paginação dos logs
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const getActionBadgeColor = (action) => {
    if (action.includes('CREATED') || action.includes('ADDED')) {
      return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 dark:bg-emerald-500/20';
    }
    if (action.includes('DELETED') || action.includes('REMOVED') || action.includes('RESET')) {
      return 'bg-rose-500/10 text-rose-500 border border-rose-500/20 dark:bg-rose-500/20';
    }
    if (action.includes('CHANGED') || action.includes('UPDATED')) {
      return 'bg-amber-500/10 text-amber-500 border border-amber-500/20 dark:bg-amber-500/20';
    }
    return 'bg-isp-accent/15 text-isp-cyan border border-isp-accent/20 dark:bg-isp-accent/35';
  };

  const formatActionName = (action) => {
    const mapping = {
      'DATABASE_RESET': 'Banco Redefinido',
      'SETTINGS_UPDATED': 'Configurações Atualizadas',
      'PLAN_CREATED': 'Plano Adicionado',
      'CUSTOMER_CREATED': 'Cliente Cadastrado',
      'CUSTOMER_DELETED': 'Cliente Excluído',
      'REFERRAL_CREATED': 'Indicação Registrada',
      'REFERRAL_STATUS_CHANGED': 'Status da Indicação Alterado',
      'REFERRAL_DELETED': 'Indicação Excluída',
      'REWARD_DELIVERED': 'Prêmio Pago',
      'USER_CREATED': 'Operador Adicionado',
      'USER_DELETED': 'Operador Removido',
      'USER_LOGIN': 'Login Efetuado'
    };
    return mapping[action] || action;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-isp-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-isp-muted font-medium text-xs">Carregando logs de auditoria...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Auditoria do Sistema</h2>
          <p className="text-sm text-slate-500 dark:text-isp-muted">Monitore as ações dos operadores, novos cadastros, premiações e alterações de configuração.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadAuditLogs}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-isp-cyan hover:bg-slate-100 dark:hover:bg-isp-border/30 rounded-xl border border-slate-200 dark:border-isp-border/40 transition-all"
            title="Atualizar Logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {auditLogs.length > 0 && (
            <button
              onClick={handleClearAudit}
              className="py-2 px-3 rounded-xl border border-rose-500/30 dark:border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" /> Limpar Logs
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-isp-navy p-6 rounded-2xl border border-slate-200 dark:border-isp-border shadow-sm space-y-5">
        {/* Filters & Search Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="w-full lg:max-w-xs relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-isp-muted" />
            <input
              type="text"
              placeholder="Buscar por descrição, ação ou operador..."
              value={auditSearch}
              onChange={(e) => {
                setAuditSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-isp-accent placeholder-slate-400 dark:placeholder-isp-muted transition-all"
            />
          </div>

          {/* Filter buttons */}
          <div className="w-full lg:w-auto flex flex-wrap gap-1.5 select-none text-[10px] font-bold uppercase overflow-x-auto pb-1 lg:pb-0">
            {['TODOS', 'CLIENTES', 'INDICACOES', 'RECOMPENSAS', 'EQUIPE', 'CONFIG'].map(f => (
              <button
                key={f}
                onClick={() => {
                  setAuditFilter(f);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  auditFilter === f 
                    ? 'bg-isp-accent text-white border-isp-accent shadow-sm shadow-isp-accent/15' 
                    : 'bg-slate-50 dark:bg-isp-border/10 text-slate-500 dark:text-isp-muted border-slate-200 dark:border-isp-border/20 hover:bg-slate-100 dark:hover:bg-isp-border/20'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto border border-slate-100 dark:border-isp-border/20 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-isp-border/10 text-slate-500 dark:text-isp-muted border-b border-slate-100 dark:border-isp-border/20">
                <th className="py-3 px-4 font-semibold w-40">Data / Hora</th>
                <th className="py-3 px-4 font-semibold w-44">Operador</th>
                <th className="py-3 px-4 font-semibold w-48">Ação</th>
                <th className="py-3 px-4 font-semibold">Descrição do Evento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-isp-border/10 text-slate-700 dark:text-slate-200">
              {currentLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-isp-border/5 transition-colors duration-150">
                  <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400 dark:text-isp-muted whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-white truncate max-w-[150px]">
                    {log.operatorName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold inline-block tracking-wider ${getActionBadgeColor(log.action)}`}>
                      {formatActionName(log.action)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 leading-relaxed font-medium text-slate-600 dark:text-slate-300">
                    {log.description}
                  </td>
                </tr>
              ))}

              {currentLogs.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-slate-400 dark:text-isp-muted">
                    Nenhum registro de auditoria encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-2 text-xs">
            <span className="text-slate-500 dark:text-isp-muted">
              Exibindo {indexOfFirstLog + 1} - {Math.min(indexOfLastLog, filteredLogs.length)} de {filteredLogs.length} logs
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-isp-border/20 text-slate-700 dark:text-white border border-slate-200 dark:border-isp-border/30 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-isp-border/40 transition-all font-medium"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-isp-border/20 text-slate-700 dark:text-white border border-slate-200 dark:border-isp-border/30 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-isp-border/40 transition-all font-medium"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
