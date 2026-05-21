import React, { useState, useEffect, useRef } from 'react';
import { X, Share2, Search, ArrowRight, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function NewReferralModal({ isOpen, onClose, onSuccess, showToast }) {
  const [customers, setCustomers] = useState([]);
  const [referrals, setReferrals] = useState([]);
  
  // Search state for Referrer
  const [referrerQuery, setReferrerQuery] = useState('');
  const [selectedReferrer, setSelectedReferrer] = useState(null);
  const [showReferrerDropdown, setShowReferrerDropdown] = useState(false);

  // Search state for Referee
  const [refereeQuery, setRefereeQuery] = useState('');
  const [selectedReferee, setSelectedReferee] = useState(null);
  const [showRefereeDropdown, setShowRefereeDropdown] = useState(false);

  const [status, setStatus] = useState('PENDENTE');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const referrerRef = useRef(null);
  const refereeRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Carregar todos os dados necessários
      Promise.all([api.getCustomers(), api.getReferrals()]).then(([custs, refs]) => {
        setCustomers(custs);
        setReferrals(refs);
      });
      // Resetar form
      setSelectedReferrer(null);
      setReferrerQuery('');
      setSelectedReferee(null);
      setRefereeQuery('');
      setStatus('PENDENTE');
      setNotes('');
    }
  }, [isOpen]);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (referrerRef.current && !referrerRef.current.contains(event.target)) {
        setShowReferrerDropdown(false);
      }
      if (refereeRef.current && !refereeRef.current.contains(event.target)) {
        setShowRefereeDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReferrer || !selectedReferee) {
      showToast('Selecione o indicador e o indicado.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      await api.addReferral({
        referrerId: selectedReferrer.id,
        refereeId: selectedReferee.id,
        status,
        notes: notes || null
      });
      showToast('Indicação registrada com sucesso!', 'success');
      onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || 'Erro ao registrar indicação.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtragem de Indicadores (Qualquer cliente ativo)
  const filteredReferrers = customers.filter(c => {
    if (c.status !== 'ATIVO') return false;
    return c.name.toLowerCase().includes(referrerQuery.toLowerCase()) || 
           (c.cpf && c.cpf.includes(referrerQuery)) ||
           (c.phone && c.phone.includes(referrerQuery));
  });

  // Filtragem de Indicados (Clientes que ainda não possuem indicações registradas como indicados)
  const filteredReferees = customers.filter(c => {
    // Não pode ser o mesmo cliente indicador selecionado
    if (selectedReferrer && c.id === selectedReferrer.id) return false;
    
    // Verifica se já foi indicado por alguém anteriormente no banco
    const alreadyReferred = referrals.some(r => r.refereeId === c.id);
    if (alreadyReferred) return false;

    return c.name.toLowerCase().includes(refereeQuery.toLowerCase()) || 
           (c.cpf && c.cpf.includes(refereeQuery)) ||
           (c.phone && c.phone.includes(refereeQuery));
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="bg-white dark:bg-isp-navy w-full max-w-lg rounded-2xl border border-slate-200 dark:border-isp-border shadow-2xl z-10 overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-isp-border/30">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-isp-accent" />
            <span>Registrar Nova Indicação</span>
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-isp-border/30 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* STEP 1: Referrer (Indicator) */}
          <div className="space-y-1 relative" ref={referrerRef}>
            <label className="text-xs font-semibold text-slate-500 dark:text-isp-muted flex items-center gap-1">
              <span>1. Cliente Indicador (Quem indicou)</span> <span className="text-rose-500">*</span>
            </label>
            
            {selectedReferrer ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-isp-accent/10 border border-isp-accent/30 text-sm text-slate-800 dark:text-white">
                <div>
                  <span className="font-semibold">{selectedReferrer.name}</span>
                  <span className="block text-[11px] text-slate-500 dark:text-isp-muted">{selectedReferrer.phone} • Plano: {selectedReferrer.plan?.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedReferrer(null);
                    setSelectedReferee(null); // Resetar indicado também para reavaliar filtros
                  }}
                  className="text-rose-500 hover:bg-rose-500/10 p-1 rounded-lg text-xs font-semibold"
                >
                  Alterar
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquise por nome, celular ou CPF do indicador..."
                  value={referrerQuery}
                  onChange={(e) => {
                    setReferrerQuery(e.target.value);
                    setShowReferrerDropdown(true);
                  }}
                  onFocus={() => setShowReferrerDropdown(true)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent focus:ring-1 focus:ring-isp-accent"
                />
                
                {/* Search Dropdown list */}
                {showReferrerDropdown && referrerQuery && (
                  <div className="absolute w-full mt-1.5 bg-white dark:bg-isp-navy border border-slate-200 dark:border-isp-border rounded-xl shadow-xl z-20 max-h-[160px] overflow-y-auto">
                    {filteredReferrers.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedReferrer(c);
                          setShowReferrerDropdown(false);
                        }}
                        className="p-2.5 hover:bg-slate-50 dark:hover:bg-isp-border/35 cursor-pointer text-xs flex justify-between items-center text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-isp-border/10 last:border-b-0"
                      >
                        <span className="font-semibold">{c.name}</span>
                        <span className="text-[10px] text-slate-400 dark:text-isp-muted">{c.phone}</span>
                      </div>
                    ))}
                    {filteredReferrers.length === 0 && (
                      <div className="p-3 text-center text-xs text-isp-muted flex items-center gap-1.5 justify-center">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Nenhum cliente ativo encontrado.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Icon indicator */}
          <div className="flex justify-center my-1">
            <ArrowRight className="w-5 h-5 text-isp-accent rotate-90 sm:rotate-0" />
          </div>

          {/* STEP 2: Referee (New subscriber) */}
          <div className="space-y-1 relative" ref={refereeRef}>
            <label className="text-xs font-semibold text-slate-500 dark:text-isp-muted flex items-center gap-1">
              <span>2. Novo Assinante Indicado</span> <span className="text-rose-500">*</span>
            </label>
            
            {selectedReferee ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-isp-accent/10 border border-isp-accent/30 text-sm text-slate-800 dark:text-white">
                <div>
                  <span className="font-semibold">{selectedReferee.name}</span>
                  <span className="block text-[11px] text-slate-500 dark:text-isp-muted">{selectedReferee.phone} • Bairro: {selectedReferee.neighborhood}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReferee(null)}
                  className="text-rose-500 hover:bg-rose-500/10 p-1 rounded-lg text-xs font-semibold"
                >
                  Alterar
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  disabled={!selectedReferrer}
                  placeholder={selectedReferrer ? "Pesquise por nome do assinante indicado..." : "⚠️ Primeiro selecione o indicador acima"}
                  value={refereeQuery}
                  onChange={(e) => {
                    setRefereeQuery(e.target.value);
                    setShowRefereeDropdown(true);
                  }}
                  onFocus={() => setShowRefereeDropdown(true)}
                  className={`w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none transition-all ${
                    selectedReferrer 
                      ? 'bg-slate-50 dark:bg-isp-border/20 border-slate-200 dark:border-isp-border/30 text-slate-800 dark:text-white focus:border-isp-accent focus:ring-1 focus:ring-isp-accent' 
                      : 'bg-slate-100 dark:bg-isp-border/5 border-transparent text-slate-400 cursor-not-allowed'
                  }`}
                />
                
                {/* Search Dropdown list */}
                {showRefereeDropdown && refereeQuery && selectedReferrer && (
                  <div className="absolute w-full mt-1.5 bg-white dark:bg-isp-navy border border-slate-200 dark:border-isp-border rounded-xl shadow-xl z-20 max-h-[160px] overflow-y-auto">
                    {filteredReferees.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedReferee(c);
                          setShowRefereeDropdown(false);
                        }}
                        className="p-2.5 hover:bg-slate-50 dark:hover:bg-isp-border/35 cursor-pointer text-xs flex justify-between items-center text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-isp-border/10 last:border-b-0"
                      >
                        <span className="font-semibold">{c.name}</span>
                        <span className="text-[10px] text-slate-400 dark:text-isp-muted">{c.neighborhood} - {c.city}</span>
                      </div>
                    ))}
                    {filteredReferees.length === 0 && (
                      <div className="p-3 text-center text-xs text-isp-muted flex items-center gap-1.5 justify-center">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Nenhum cliente disponível encontrado.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Status & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            
            {/* Status */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-isp-muted flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Status Inicial
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-sm text-slate-700 dark:text-white focus:outline-none focus:border-isp-accent"
              >
                <option value="PENDENTE">Pendente</option>
                <option value="INSTALADO">Instalado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>

            {/* Observations */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-isp-muted flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> Observações Internas
              </label>
              <input
                type="text"
                placeholder="Ex: Contato via WhatsApp. Agendado p/ sexta."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-isp-border/30">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-isp-border/40 hover:bg-slate-50 dark:hover:bg-isp-border/20 text-slate-600 dark:text-slate-300 text-sm font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedReferrer || !selectedReferee}
              className="w-1/2 py-2.5 rounded-xl bg-isp-accent hover:bg-isp-accent/90 text-white text-sm font-semibold transition-all shadow-md shadow-isp-accent/15 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Registrando...</span>
                </>
              ) : (
                <span>Registrar Indicação</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
