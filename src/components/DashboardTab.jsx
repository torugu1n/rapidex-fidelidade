import React, { useState, useEffect } from 'react';
import {
  Users,
  Share2,
  Percent,
  Gift,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Trophy,
  Activity
} from 'lucide-react';
import { api } from '../services/api';

export default function DashboardTab({
  setActiveTab,
  currentUser,
  openNewCustomerModal,
  openNewReferralModal,
  openCustomerDetails,
  showToast,
  showConfirm
}) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error(error);
      showToast('Erro ao carregar dados do dashboard.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateStatus = async (referralId, newStatus) => {
    if (newStatus === 'CANCELADO') {
      showConfirm({
        title: 'Cancelar Indicação',
        description: 'Tem certeza que deseja cancelar esta indicação?',
        confirmLabel: 'Cancelar Indicação',
        cancelLabel: 'Voltar',
        type: 'warning',
        onConfirm: async () => {
          try {
            await api.updateReferral(referralId, { status: newStatus });
            showToast(`Indicação cancelada!`, 'success');
            fetchStats();
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
            await api.updateReferral(referralId, { status: newStatus });
            showToast(`Indicação marcada como instalada!`, 'success');
            fetchStats();
          } catch (error) {
            showToast(error.message || 'Erro ao atualizar indicação.', 'error');
          }
        }
      });
    } else {
      try {
        await api.updateReferral(referralId, { status: newStatus });
        showToast(`Indicação atualizada para ${newStatus}!`, 'success');
        fetchStats();
      } catch (error) {
        showToast(error.message || 'Erro ao atualizar indicação.', 'error');
      }
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-isp-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-isp-muted font-medium text-sm animate-pulse">Carregando painel administrativo...</p>
      </div>
    );
  }

  // Configurações do gráfico SVG
  const maxVal = Math.max(...stats.chartData.map(d => d.indicações), 5);
  const height = 180;
  const width = 500;
  const padding = 35;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Gerar coordenadas dos pontos do gráfico
  const pointsReferrals = stats.chartData.map((d, i) => {
    const x = padding + (i * chartWidth) / (stats.chartData.length - 1);
    const y = height - padding - (d.indicações * chartHeight) / maxVal;
    return `${x},${y}`;
  }).join(' ');

  const pointsConversions = stats.chartData.map((d, i) => {
    const x = padding + (i * chartWidth) / (stats.chartData.length - 1);
    const y = height - padding - (d.conversões * chartHeight) / maxVal;
    return `${x},${y}`;
  }).join(' ');

  const midVal = Math.round(maxVal / 2);
  const midY = height - padding - (midVal * chartHeight) / maxVal;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
            Olá, <span className="bg-gradient-to-r from-isp-accent to-isp-cyan bg-clip-text text-transparent">{currentUser?.name || stats.adminName || 'Operador'}</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-isp-muted mt-1">
            Aqui está o resumo das indicações e recompensas da rede.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <button
            onClick={openNewCustomerModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-isp-border/30 hover:bg-slate-300 dark:hover:bg-isp-border/50 text-slate-800 dark:text-white text-sm font-semibold transition-all duration-200 border border-slate-300 dark:border-isp-border/40"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Cliente</span>
          </button>
          <button
            onClick={openNewReferralModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-isp-accent hover:bg-isp-accent/90 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-isp-accent/20"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Indicação</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Customers */}
        <div
          onClick={() => setActiveTab('customers')}
          className="bg-white dark:bg-isp-navy p-6 rounded-2xl border border-slate-200 dark:border-isp-border shadow-sm flex items-center justify-between group hover:border-isp-accent/40 dark:hover:border-isp-accent/30 transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-isp-muted uppercase tracking-wider">Clientes Cadastrados</span>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalCustomers}</h3>
            <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              <span>{stats.activeCustomers} ativos na base</span>
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-isp-brand/10 dark:bg-isp-brand/20 text-isp-accent group-hover:scale-110 transition-transform duration-200">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Total Referrals */}
        <div
          onClick={() => setActiveTab('referrals')}
          className="bg-white dark:bg-isp-navy p-6 rounded-2xl border border-slate-200 dark:border-isp-border shadow-sm flex items-center justify-between group hover:border-isp-accent/40 dark:hover:border-isp-accent/30 transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-isp-muted uppercase tracking-wider">Indicações Totais</span>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalReferrals}</h3>
            <span className="text-[11px] text-isp-cyan font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
              <span>{stats.pendingReferrals} pendentes de análise</span>
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-isp-accent/10 dark:bg-isp-accent/20 text-isp-accent group-hover:scale-110 transition-transform duration-200">
            <Share2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Conversion Rate */}
        <div
          onClick={() => setActiveTab('referrals')}
          className="bg-white dark:bg-isp-navy p-6 rounded-2xl border border-slate-200 dark:border-isp-border shadow-sm flex items-center justify-between group hover:border-isp-accent/40 dark:hover:border-isp-accent/30 transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-isp-muted uppercase tracking-wider">Taxa de Conversão</span>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.conversionRate}%</h3>
            <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>{stats.installedReferrals} clientes instalados</span>
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 group-hover:scale-110 transition-transform duration-200">
            <Percent className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Rewards Pending */}
        <div
          onClick={() => setActiveTab('rewards')}
          className="bg-white dark:bg-isp-navy p-6 rounded-2xl border border-slate-200 dark:border-isp-border shadow-sm flex items-center justify-between group hover:border-isp-accent/40 dark:hover:border-isp-accent/30 transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-isp-muted uppercase tracking-wider">Recompensas Pendentes</span>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">R$ {stats.pendingRewardsValue.toFixed(2)}</h3>
            <span className="text-[11px] text-slate-400 dark:text-isp-muted font-medium">
              {stats.pendingRewardsCount} resgates aguardando
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 group-hover:scale-110 transition-transform duration-200">
            <Gift className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Chart & Mini Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-isp-navy p-6 rounded-2xl border border-slate-200 dark:border-isp-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-isp-accent" />
              <h4 className="text-sm font-semibold text-slate-800 dark:text-white uppercase tracking-wider">Desempenho de Indicações</h4>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-isp-accent inline-block"></span>
                <span className="text-slate-600 dark:text-isp-muted">Indicações</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-isp-cyan inline-block"></span>
                <span className="text-slate-600 dark:text-isp-muted">Instalados</span>
              </div>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full relative h-[180px] mt-2">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="currentColor" className="text-slate-200 dark:text-isp-border/30" strokeDasharray="3,3" />
              <line x1={padding} y1={midY} x2={width - padding} y2={midY} stroke="currentColor" className="text-slate-200 dark:text-isp-border/30" strokeDasharray="3,3" />
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-slate-300 dark:text-isp-border/60" />

              {/* X Axis Labels */}
              {stats.chartData.map((d, i) => {
                const x = padding + (i * chartWidth) / (stats.chartData.length - 1);
                return (
                  <text
                    key={i}
                    x={x}
                    y={height - 10}
                    className="text-[10px] fill-slate-400 dark:fill-isp-muted font-semibold text-center"
                    textAnchor="middle"
                  >
                    {d.month}
                  </text>
                );
              })}

              {/* Y Axis Labels */}
              <text x={padding - 10} y={padding + 4} className="text-[10px] fill-slate-400 dark:fill-isp-muted font-semibold" textAnchor="end">{maxVal}</text>
              <text x={padding - 10} y={midY + 4} className="text-[10px] fill-slate-400 dark:fill-isp-muted font-semibold" textAnchor="end">{midVal}</text>
              <text x={padding - 10} y={height - padding + 4} className="text-[10px] fill-slate-400 dark:fill-isp-muted font-semibold" textAnchor="end">0</text>

              {/* Line 1: Indicações */}
              <polyline
                fill="none"
                stroke="#3b81cd"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsReferrals}
                className="transition-all duration-500"
              />

              {/* Line 2: Conversões */}
              <polyline
                fill="none"
                stroke="#3cb0e6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsConversions}
                className="transition-all duration-500"
                strokeDasharray="1"
              />

              {/* Points for line 1 */}
              {stats.chartData.map((d, i) => {
                const x = padding + (i * chartWidth) / (stats.chartData.length - 1);
                const y = height - padding - (d.indicações * chartHeight) / maxVal;
                return (
                  <g key={`p1-${i}`} className="group/dot cursor-pointer">
                    <circle
                      cx={x}
                      cy={y}
                      r="5"
                      fill="#3b81cd"
                      stroke="#fff"
                      strokeWidth="1.5"
                      className="hover:scale-150 transition-transform duration-200"
                      style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                      onMouseEnter={() => setHoveredPoint({ x, y, month: d.month, label: 'Indicações', value: d.indicações, color: '#3b81cd' })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                );
              })}

              {/* Points for line 2 */}
              {stats.chartData.map((d, i) => {
                const x = padding + (i * chartWidth) / (stats.chartData.length - 1);
                const y = height - padding - (d.conversões * chartHeight) / maxVal;
                return (
                  <g key={`p2-${i}`} className="group/dot cursor-pointer">
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#3cb0e6"
                      stroke="#fff"
                      strokeWidth="1.5"
                      className="hover:scale-150 transition-transform duration-200"
                      style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                      onMouseEnter={() => setHoveredPoint({ x, y, month: d.month, label: 'Instalados', value: d.conversões, color: '#3cb0e6' })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Custom Tooltip */}
            {hoveredPoint && (
              <div
                className="absolute bg-slate-900/90 dark:bg-slate-950/95 text-white py-1.5 px-2.5 rounded-xl border border-slate-700/50 shadow-2xl backdrop-blur-sm pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-2 transition-all duration-150 z-20 flex flex-col gap-0.5 text-center font-sans animate-fadeIn"
                style={{
                  left: `${(hoveredPoint.x / width) * 100}%`,
                  top: `${(hoveredPoint.y / height) * 100}%`
                }}
              >
                <span className="text-[9px] text-slate-300 dark:text-slate-400 font-bold uppercase tracking-wider">{hoveredPoint.month}</span>
                <div className="flex items-center gap-1.5 justify-center">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hoveredPoint.color }} />
                  <span className="text-xs font-bold text-white">
                    {hoveredPoint.value} {hoveredPoint.label.toLowerCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mini Ranking */}
        <div className="bg-white dark:bg-isp-navy p-6 rounded-2xl border border-slate-200 dark:border-isp-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm font-semibold text-slate-800 dark:text-white uppercase tracking-wider">Top Indicadores</h4>
            </div>

            <div className="space-y-4">
              {stats.ranking.slice(0, 3).map((item, idx) => (
                <div key={item.customerId} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-isp-border/20 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${idx === 0 ? 'bg-amber-500/20 text-amber-500' :
                        idx === 1 ? 'bg-slate-400/20 text-slate-400' :
                          'bg-amber-700/20 text-amber-700'
                      }`}>
                      {idx + 1}
                    </div>
                    <button
                      onClick={() => openCustomerDetails(item.customerId)}
                      className="text-left font-medium text-sm text-slate-700 dark:text-white hover:text-isp-accent hover:underline truncate max-w-[120px]"
                    >
                      {item.customerName}
                    </button>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{item.totalReferrals} ind.</span>
                    <span className="block text-[10px] text-emerald-500 font-medium">{item.convertedReferrals} conv.</span>
                  </div>
                </div>
              ))}
              {stats.ranking.length === 0 && (
                <p className="text-xs text-isp-muted text-center py-6">Nenhum indicador registrado.</p>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('ranking')}
            className="w-full text-center text-xs font-semibold text-isp-accent hover:text-isp-cyan dark:text-isp-cyan dark:hover:text-isp-accent mt-4 pt-3 border-t border-slate-100 dark:border-isp-border/30 transition-all duration-200"
          >
            Ver Ranking Completo →
          </button>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-isp-navy p-6 rounded-2xl border border-slate-200 dark:border-isp-border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-isp-accent" />
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white uppercase tracking-wider">Últimas Indicações</h4>
          </div>
          <button
            onClick={() => setActiveTab('referrals')}
            className="text-xs font-semibold text-isp-accent hover:text-isp-cyan dark:text-isp-cyan dark:hover:text-isp-accent transition-all duration-200"
          >
            Ver Todas Indicações →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-isp-border/30 text-xs font-semibold text-slate-400 dark:text-isp-muted uppercase">
                <th className="pb-3 pl-2">Indicador</th>
                <th className="pb-3">Indicado</th>
                <th className="pb-3">Data</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-isp-border/20 text-sm">
              {stats.recentReferrals.map((ref) => (
                <tr key={ref.id} className="hover:bg-slate-50/50 dark:hover:bg-isp-border/10 transition-all duration-200">
                  <td className="py-3.5 pl-2 font-medium text-slate-800 dark:text-white">{ref.referrerName}</td>
                  <td className="py-3.5 text-slate-600 dark:text-slate-300">{ref.refereeName}</td>
                  <td className="py-3.5 text-slate-500 dark:text-isp-muted">
                    {new Date(ref.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${ref.status === 'INSTALADO' ? 'bg-emerald-500/10 text-emerald-500' :
                        ref.status === 'PENDENTE' ? 'bg-amber-500/10 text-amber-500 animate-pulse' :
                          'bg-rose-500/10 text-rose-500'
                      }`}>
                      {ref.status === 'INSTALADO' && <CheckCircle2 className="w-3 h-3" />}
                      {ref.status === 'PENDENTE' && <Clock className="w-3 h-3" />}
                      {ref.status === 'CANCELADO' && <XCircle className="w-3 h-3" />}
                      <span>{ref.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    {ref.status === 'PENDENTE' ? (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleUpdateStatus(ref.id, 'CANCELADO')}
                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-200"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(ref.id, 'INSTALADO')}
                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-200"
                        >
                          Instalado
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-isp-muted font-medium">Finalizado</span>
                    )}
                  </td>
                </tr>
              ))}
              {stats.recentReferrals.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-isp-muted text-xs">
                    Nenhuma indicação cadastrada no sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
