import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  Tag, 
  Calendar, 
  Share2, 
  Gift, 
  FileText,
  CheckCircle,
  Clock,
  ArrowLeftRight,
  ClipboardList,
  Trash2
} from 'lucide-react';
import { api } from '../services/api';

export default function CustomerDetailsModal({ customerId, isOpen, onClose, onUpdate, showToast, showConfirm, currentUser }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('referrals');
  const [noteInput, setNoteInput] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const handleDeleteCustomer = () => {
    if (!customer) return;
    showConfirm({
      title: 'Remover Cliente',
      description: `Tem certeza que deseja remover o cliente "${customer.name}"? Esta ação é irreversível e apagará todo o seu histórico.`,
      confirmLabel: 'Remover',
      cancelLabel: 'Cancelar',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.deleteCustomer(customer.id);
          showToast('Cliente removido com sucesso!', 'success');
          onClose();
          if (onUpdate) onUpdate();
        } catch (error) {
          showToast(error.message || 'Erro ao deletar cliente.', 'error');
        }
      }
    });
  };

  const fetchCustomerDetails = async () => {
    if (!customerId) return;
    try {
      setLoading(true);
      const data = await api.getCustomerById(customerId);
      setCustomer(data);
    } catch (error) {
      showToast('Erro ao carregar detalhes do cliente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && customerId) {
      fetchCustomerDetails();
      setActiveTab('referrals');
    }
  }, [isOpen, customerId]);

  const handleAddNote = async () => {
    if (!noteInput.trim()) {
      showToast('Digite algo antes de adicionar a nota.', 'warning');
      return;
    }
    try {
      setSavingNotes(true);
      // Parse existing notes as array of { text, createdAt }
      let existing = [];
      try { existing = JSON.parse(customer.notes || '[]'); } catch { existing = []; }
      if (!Array.isArray(existing)) existing = [];
      const updated = [...existing, { text: noteInput.trim(), createdAt: new Date().toISOString() }];
      await api.updateCustomer(customer.id, { notes: JSON.stringify(updated) });
      setNoteInput('');
      showToast('Nota adicionada com sucesso!', 'success');
      fetchCustomerDetails();
      if (onUpdate) onUpdate();
    } catch (e) {
      showToast('Erro ao adicionar nota.', 'error');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleUpdateReferralStatus = async (refId, newStatus) => {
    if (newStatus === 'CANCELADO') {
      showConfirm({
        title: 'Cancelar Indicação',
        description: 'Tem certeza que deseja cancelar esta indicação?',
        confirmLabel: 'Cancelar Indicação',
        cancelLabel: 'Voltar',
        type: 'warning',
        onConfirm: async () => {
          try {
            await api.updateReferral(refId, { status: newStatus });
            showToast(`Indicação cancelada!`, 'success');
            fetchCustomerDetails();
            if (onUpdate) onUpdate();
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
            await api.updateReferral(refId, { status: newStatus });
            showToast(`Indicação marcada como instalada!`, 'success');
            fetchCustomerDetails();
            if (onUpdate) onUpdate();
          } catch (error) {
            showToast(error.message || 'Erro ao atualizar indicação.', 'error');
          }
        }
      });
    } else {
      try {
        await api.updateReferral(refId, { status: newStatus });
        showToast(`Indicação atualizada para ${newStatus}!`, 'success');
        fetchCustomerDetails();
        if (onUpdate) onUpdate();
      } catch (error) {
        showToast(error.message || 'Erro ao atualizar indicação.', 'error');
      }
    }
  };

  const handleDeliverReward = (rewardId) => {
    showConfirm({
      title: 'Pagar Recompensa',
      description: 'Confirmar que a recompensa foi paga/entregue para o cliente? Esta ação não pode ser desfeita.',
      confirmLabel: 'Confirmar Pagamento',
      cancelLabel: 'Cancelar',
      type: 'success',
      onConfirm: async () => {
        try {
          await api.updateReward(rewardId, { status: 'ENTREGUE' });
          showToast('Recompensa entregue com sucesso!', 'success');
          fetchCustomerDetails();
          if (onUpdate) onUpdate();
        } catch (error) {
          showToast('Erro ao entregar recompensa.', 'error');
        }
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div className="bg-white dark:bg-isp-navy w-full max-w-xl h-full shadow-2xl z-10 flex flex-col justify-between border-l border-slate-200 dark:border-isp-border animate-slideLeft">
        
        {loading || !customer ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-10 h-10 border-4 border-isp-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-isp-muted font-medium text-xs">Carregando perfil do cliente...</p>
          </div>
        ) : (
          <>
            {/* Header & Basic Info */}
            <div className="p-6 border-b border-slate-100 dark:border-isp-border/30 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-accent text-white font-bold text-lg rounded-xl flex items-center justify-center shadow-lg shadow-isp-accent/25">
                    {customer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{customer.name}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1.5 ${
                      customer.status === 'ATIVO' ? 'bg-emerald-500/10 text-emerald-500' :
                      customer.status === 'INATIVO' ? 'bg-slate-500/15 text-slate-500 dark:text-isp-muted' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${
                        customer.status === 'ATIVO' ? 'bg-emerald-500' :
                        customer.status === 'INATIVO' ? 'bg-slate-400' :
                        'bg-amber-500'
                      }`} />
                      <span>{customer.status}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {currentUser?.role === 'ADMIN' && (
                    <button
                      onClick={handleDeleteCustomer}
                      title="Remover Cliente"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-isp-border/30 transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Grid detail stats */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{customer.phone}</span>
                </div>
                
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{customer.neighborhood}, {customer.city}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Tag className="w-4 h-4 text-slate-400" />
                  <span>Plano: <span className="font-semibold">{customer.plan?.name}</span></span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Cadastrado em: <span className="font-semibold">{new Date(customer.createdAt).toLocaleDateString('pt-BR')}</span></span>
                </div>
              </div>

              {/* Indication Linker ("Indicado por...") */}
              {customer.referredBy && (
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-isp-border/20 rounded-xl border border-slate-200/50 dark:border-isp-border/30 text-xs">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-isp-accent shrink-0" />
                  <span className="text-slate-500 dark:text-isp-muted">Indicado por:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{customer.referredBy.name}</span>
                </div>
              )}

              {/* Reward Progress Panel */}
              {(() => {
                const threshold = customer.referralsPerReward || 3;
                const current = customer.progressInCycle || 0;
                const earned = customer.rewardsEarned || 0;
                const pct = threshold > 0 ? Math.round((current / threshold) * 100) : 0;
                const remaining = threshold - current;
                return (
                  <div className="bg-gradient-to-br from-isp-accent/5 to-isp-cyan/5 dark:from-isp-accent/10 dark:to-isp-cyan/10 border border-isp-accent/20 dark:border-isp-accent/25 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-isp-accent" />
                        <span className="text-xs font-bold text-slate-700 dark:text-white">Progresso de Recompensas</span>
                      </div>
                      {earned > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-isp-accent/15 text-isp-accent border border-isp-accent/20">
                          {earned} prêmio{earned > 1 ? 's' : ''} ganho{earned > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* Segmented blocks */}
                    <div className="flex gap-1.5">
                      {Array.from({ length: threshold }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2.5 flex-1 rounded-full transition-all duration-500 ${
                            i < current
                              ? 'bg-gradient-to-r from-isp-accent to-isp-cyan shadow-sm shadow-isp-accent/30'
                              : 'bg-slate-200 dark:bg-isp-border/40'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 dark:text-isp-muted">
                        <span className="font-bold text-isp-accent">{current}</span> de {threshold} instalações
                      </span>
                      {remaining > 0 ? (
                        <span className="text-slate-400 dark:text-isp-muted">
                          Faltam <span className="font-bold text-slate-600 dark:text-slate-300">{remaining}</span> para o próximo prêmio
                        </span>
                      ) : (
                        <span className="font-bold text-emerald-500">🎉 Prêmio disponível!</span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Tabs Header */}
            <div className="flex border-b border-slate-100 dark:border-isp-border/20 px-6 select-none bg-slate-50/50 dark:bg-isp-border/5">
              <button
                onClick={() => setActiveTab('referrals')}
                className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all ${
                  activeTab === 'referrals'
                    ? 'border-isp-accent text-isp-accent dark:text-isp-cyan dark:border-isp-cyan'
                    : 'border-transparent text-slate-500 dark:text-isp-muted hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>Indicações Feitas ({customer.referralsMade.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('rewards')}
                className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all ${
                  activeTab === 'rewards'
                    ? 'border-isp-accent text-isp-accent dark:text-isp-cyan dark:border-isp-cyan'
                    : 'border-transparent text-slate-500 dark:text-isp-muted hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                <Gift className="w-4 h-4" />
                <span>Recompensas ({customer.rewards.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all ${
                  activeTab === 'notes'
                    ? 'border-isp-accent text-isp-accent dark:text-isp-cyan dark:border-isp-cyan'
                    : 'border-transparent text-slate-500 dark:text-isp-muted hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>Notas Internas</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* Tab 1: Indicações Feitas */}
              {activeTab === 'referrals' && (
                <div className="space-y-4">
                  {customer.referralsMade.map(ref => (
                    <div key={ref.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-isp-border/15 border border-slate-200/50 dark:border-isp-border/30 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block text-sm">{ref.referee.name}</span>
                        <span className="text-slate-400 dark:text-isp-muted block mt-0.5">{ref.referee.phone}</span>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            ref.status === 'INSTALADO' ? 'bg-emerald-500/10 text-emerald-500' :
                            ref.status === 'PENDENTE' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-rose-500/10 text-rose-500'
                          }`}>
                            <span>{ref.status}</span>
                          </span>
                          <span className="text-slate-400 dark:text-isp-muted">
                            {new Date(ref.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      {/* Quick action buttons within details drawer */}
                      <div>
                        {ref.status === 'PENDENTE' ? (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleUpdateReferralStatus(ref.id, 'CANCELADO')}
                              className="px-2 py-1 rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white font-medium"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleUpdateReferralStatus(ref.id, 'INSTALADO')}
                              className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white font-medium"
                            >
                              Instalar
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-isp-muted font-medium">Finalizado</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {customer.referralsMade.length === 0 && (
                    <div className="text-center py-10 text-slate-400 dark:text-isp-muted space-y-1">
                      <Clock className="w-8 h-8 text-slate-300 dark:text-isp-border/30 mx-auto" />
                      <p className="text-xs">Nenhuma indicação cadastrada para este cliente.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Recompensas */}
              {activeTab === 'rewards' && (
                <div className="space-y-4">
                  {customer.rewards.map(reward => (
                    <div key={reward.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-isp-border/15 border border-slate-200/50 dark:border-isp-border/30 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block text-sm">{reward.type}</span>
                        <span className="text-slate-400 dark:text-isp-muted block mt-0.5">Indicado: {reward.refereeName}</span>
                        <span className="text-slate-400 dark:text-isp-muted block">
                          Gerada em: {new Date(reward.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                        {reward.deliveredAt && (
                          <span className="text-emerald-500 block">
                            Paga em: {new Date(reward.deliveredAt).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-right flex flex-col items-end gap-2">
                        <span className="font-bold text-base text-slate-900 dark:text-white">
                          R$ {reward.value.toFixed(2)}
                        </span>
                        {reward.status === 'PENDENTE' ? (
                          <button
                            onClick={() => handleDeliverReward(reward.id)}
                            className="px-2.5 py-1 rounded bg-isp-accent hover:bg-isp-accent/90 text-white font-bold text-[10px]"
                          >
                            Entregar
                          </button>
                        ) : (
                          <span className="text-emerald-500 font-bold text-[10px] flex items-center gap-0.5">
                            <CheckCircle className="w-3.5 h-3.5" /> Pago
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {customer.rewards.length === 0 && (
                    <div className="text-center py-10 text-slate-400 dark:text-isp-muted space-y-1">
                      <Gift className="w-8 h-8 text-slate-300 dark:text-isp-border/30 mx-auto" />
                      <p className="text-xs">Nenhuma recompensa gerada para este cliente.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Notas Internas */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  {/* Existing notes list */}
                  {(() => {
                    let notesList = [];
                    try { notesList = JSON.parse(customer.notes || '[]'); } catch { notesList = []; }
                    if (!Array.isArray(notesList)) notesList = [];
                    return notesList.length > 0 ? (
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {notesList.map((n, i) => (
                          <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-isp-border/15 border border-slate-200/50 dark:border-isp-border/30">
                            <p className="text-xs text-slate-700 dark:text-white leading-relaxed">{n.text || n}</p>
                            <span className="text-[10px] text-slate-400 dark:text-isp-muted mt-1 block">
                              {n.createdAt ? new Date(n.createdAt).toLocaleString('pt-BR') : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-400 dark:text-isp-muted space-y-1">
                        <FileText className="w-7 h-7 mx-auto text-slate-300 dark:text-isp-border/30" />
                        <p className="text-xs">Nenhuma nota registrada ainda.</p>
                      </div>
                    );
                  })()}

                  {/* Add note input */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-isp-border/30">
                    <label className="text-xs text-slate-400 dark:text-isp-muted font-medium block">
                      Nova Nota
                    </label>
                    <textarea
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      rows="3"
                      placeholder="Ex: Cliente solicitou desconto, combinar retorno na sexta..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent focus:ring-1 focus:ring-isp-accent resize-none"
                    />
                    <button
                      onClick={handleAddNote}
                      disabled={savingNotes}
                      className="flex items-center gap-2 px-4 py-2 bg-isp-accent hover:bg-isp-accent/90 text-white rounded-xl text-xs font-semibold shadow-md shadow-isp-accent/15 transition disabled:opacity-60"
                    >
                      {savingNotes ? 'Salvando...' : '+ Adicionar Nota'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
}
