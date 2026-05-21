import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Award, 
  TrendingUp, 
  Gift, 
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { api } from '../services/api';

export default function RankingTab({ openCustomerDetails, showToast }) {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRanking = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setRanking(data.ranking);
    } catch (error) {
      showToast('Erro ao carregar ranking.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-isp-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-isp-muted font-medium text-xs">Carregando quadro de líderes...</p>
      </div>
    );
  }

  const maxReferrals = ranking.length > 0 ? ranking[0].totalReferrals : 1;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Quadro de Líderes (Ranking)</h2>
        <p className="text-sm text-slate-500 dark:text-isp-muted">Clientes promotores que mais trazem novos assinantes para o provedor.</p>
      </div>

      {/* Leaderboard Cards (Top 3) */}
      {ranking.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
          {/* 2nd Place */}
          <div className="bg-white dark:bg-isp-navy border border-slate-200 dark:border-isp-border p-6 rounded-2xl shadow-sm text-center relative order-2 md:order-1 md:h-[220px] flex flex-col justify-between group hover:border-slate-400 dark:hover:border-isp-border/80 transition-all duration-200">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full border-4 border-white dark:border-isp-navy flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 shadow-md">
              2
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white text-base mt-2 truncate group-hover:text-isp-accent transition-colors">
                {ranking[1].customerName}
              </h4>
              <p className="text-xs text-slate-400 dark:text-isp-muted mt-0.5">{ranking[1].customerPhone}</p>
            </div>
            <div className="my-4">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{ranking[1].totalReferrals}</span>
              <span className="text-xs text-slate-400 dark:text-isp-muted ml-1">indicações</span>
            </div>
            <div className="flex justify-around text-xs border-t border-slate-100 dark:border-isp-border/30 pt-3 text-slate-500 dark:text-isp-muted">
              <div>
                <span className="block font-bold text-slate-700 dark:text-white">{ranking[1].convertedReferrals}</span>
                <span>Instalados</span>
              </div>
              <div>
                <span className="block font-bold text-emerald-500">R$ {ranking[1].rewardsPaid.toFixed(0)}</span>
                <span>Resgatados</span>
              </div>
            </div>
          </div>

          {/* 1st Place */}
          <div className="bg-gradient-brand text-white border-2 border-isp-cyan p-8 rounded-3xl shadow-xl text-center relative order-1 md:order-2 md:h-[250px] flex flex-col justify-between scale-105 group transition-all duration-300">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-amber-400 rounded-full border-4 border-isp-navy flex items-center justify-center font-bold text-isp-navy shadow-lg shadow-amber-400/25">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-lg mt-1 truncate">
                {ranking[0].customerName}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">{ranking[0].customerPhone}</p>
            </div>
            <div className="my-3">
              <span className="text-5xl font-black text-white bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                {ranking[0].totalReferrals}
              </span>
              <span className="text-xs text-slate-300 ml-1">indicações</span>
            </div>
            <div className="flex justify-around text-xs border-t border-white/10 pt-4 text-slate-300">
              <div>
                <span className="block font-bold text-white text-sm">{ranking[0].convertedReferrals}</span>
                <span>Instalados</span>
              </div>
              <div>
                <span className="block font-bold text-amber-300 text-sm">R$ {ranking[0].rewardsPaid.toFixed(0)}</span>
                <span>Resgatados</span>
              </div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="bg-white dark:bg-isp-navy border border-slate-200 dark:border-isp-border p-6 rounded-2xl shadow-sm text-center relative order-3 md:h-[200px] flex flex-col justify-between group hover:border-slate-400 dark:hover:border-isp-border/80 transition-all duration-200">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-amber-700/20 rounded-full border-4 border-white dark:border-isp-navy flex items-center justify-center font-bold text-amber-700 shadow-md">
              3
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white text-base mt-2 truncate group-hover:text-isp-accent transition-colors">
                {ranking[2].customerName}
              </h4>
              <p className="text-xs text-slate-400 dark:text-isp-muted mt-0.5">{ranking[2].customerPhone}</p>
            </div>
            <div className="my-4">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{ranking[2].totalReferrals}</span>
              <span className="text-xs text-slate-400 dark:text-isp-muted ml-1">indicações</span>
            </div>
            <div className="flex justify-around text-xs border-t border-slate-100 dark:border-isp-border/30 pt-3 text-slate-500 dark:text-isp-muted">
              <div>
                <span className="block font-bold text-slate-700 dark:text-white">{ranking[2].convertedReferrals}</span>
                <span>Instalados</span>
              </div>
              <div>
                <span className="block font-bold text-emerald-500">R$ {ranking[2].rewardsPaid.toFixed(0)}</span>
                <span>Resgatados</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table (All Ranked) */}
      <div className="bg-white dark:bg-isp-navy rounded-2xl border border-slate-200 dark:border-isp-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-isp-border/30 flex items-center gap-2">
          <Award className="w-5 h-5 text-isp-accent" />
          <h3 className="font-semibold text-slate-800 dark:text-white">Posições e Desempenho Geral</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-isp-border/30 text-xs font-semibold text-slate-400 dark:text-isp-muted uppercase bg-slate-50/50 dark:bg-isp-border/10">
                <th className="py-4 px-6 text-center w-16">Pos</th>
                <th className="py-4 px-6">Cliente Indicador</th>
                <th className="py-4 px-6">Volume de Indicações</th>
                <th className="py-4 px-6">Conversões</th>
                <th className="py-4 px-6">Aproveitamento</th>
                <th className="py-4 px-6">Recompensas Recebidas</th>
                <th className="py-4 px-6 text-right">Perfil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-isp-border/20 text-sm">
              {ranking.map((item, idx) => {
                const pct = Math.round((item.convertedReferrals / item.totalReferrals) * 100);
                const widthPercent = (item.totalReferrals / maxReferrals) * 100;
                
                return (
                  <tr 
                    key={item.customerId}
                    onClick={() => openCustomerDetails(item.customerId)}
                    className="hover:bg-slate-50/50 dark:hover:bg-isp-border/10 transition-all duration-200 cursor-pointer group"
                  >
                    {/* Position */}
                    <td className="py-4 px-6 text-center font-bold">
                      {idx === 0 && <span className="text-amber-500 text-base">🥇</span>}
                      {idx === 1 && <span className="text-slate-400 text-base">🥈</span>}
                      {idx === 2 && <span className="text-amber-700 text-base">🥉</span>}
                      {idx > 2 && <span className="text-slate-500 dark:text-isp-muted">{idx + 1}</span>}
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6 font-semibold text-slate-800 dark:text-white">
                      {item.customerName}
                      <span className="block font-normal text-xs text-slate-400 dark:text-isp-muted mt-0.5">{item.customerPhone}</span>
                    </td>

                    {/* Progress bar and quantity */}
                    <td className="py-4 px-6 w-[280px]">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-800 dark:text-white w-6 shrink-0">{item.totalReferrals}</span>
                        <div className="w-full bg-slate-100 dark:bg-isp-border/20 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-isp-accent h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${widthPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Converted */}
                    <td className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                      {item.convertedReferrals} instalados
                    </td>

                    {/* Percentage Rate */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        {pct >= 50 ? (
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-rose-500" />
                        )}
                        <span className={`font-semibold ${pct >= 50 ? 'text-emerald-500' : 'text-slate-600 dark:text-slate-300'}`}>
                          {pct}%
                        </span>
                      </div>
                    </td>

                    {/* Rewards Paid */}
                    <td className="py-4 px-6 font-bold text-emerald-500">
                      <span className="flex items-center gap-1">
                        <Gift className="w-4 h-4 text-emerald-500" />
                        <span>R$ {item.rewardsPaid.toFixed(2)}</span>
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-isp-accent group-hover:translate-x-0.5 transition-all ml-auto" />
                    </td>
                  </tr>
                );
              })}

              {ranking.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400 dark:text-isp-muted">
                    Nenhum indicador registrado para gerar ranking.
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
