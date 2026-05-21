import React, { useState, useEffect } from 'react';
import { X, User, Phone, FileText, MapPin, Tag, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

const TERESINA_NEIGHBORHOODS = [
  'Aeroporto','Água Mineral','Alvorada','Areal','Bairro de Lourdes',
  'Bela Vista','Buenos Aires','Cabral','Catarina','Centro',
  'Cristo Rei','Dirceu Arcoverde I','Dirceu Arcoverde II','Esperança',
  'Fátima','Gurupi','Horto','Ininga','Itararé','Jacinta Andrade',
  'Jockey Club','Jóquei','Leste','Lourival Parente','Luxemburgo',
  'Mafrense','Matinha','Mocambinho','Noivos','Nossa Senhora de Fátima',
  'Parque Juliana','Piçarra','Planalto Ininga','Poti Velho','Primavera',
  'Renascença','Santa Maria da Codipi','Santa Rosa','São Cristóvão',
  'São João','São Pedro','Satélite','Tabuleta','Uruguai',
  'Vale Quem Tem','Vermelha','Vila Operária'
].sort();

export default function NewCustomerModal({ isOpen, onClose, onSuccess, showToast, showConfirm }) {
  const [plans, setPlans] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [city, setCity] = useState('');
  const [planId, setPlanId] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [customNeighborhood, setCustomNeighborhood] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [status, setStatus] = useState('ATIVO');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getPlans().then(data => {
        setPlans(data);
        if (data.length > 0) setPlanId(data[0].id);
      });
      setName('');
      setPhone('');
      setCpf('');
      setCity('');
      setNeighborhood('');
      setCustomNeighborhood('');
      setIsCustom(false);
      setStatus('ATIVO');
    }
  }, [isOpen]);

  const handlePhoneChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    const limited = rawVal.substring(0, 11);
    
    let formatted = '';
    if (limited.length > 0) {
      formatted += '(' + limited.substring(0, 2);
    }
    if (limited.length > 2) {
      formatted += ') ';
      if (limited.length <= 10) {
        formatted += limited.substring(2, 6);
        if (limited.length > 6) {
          formatted += '-' + limited.substring(6);
        }
      } else {
        formatted += limited.substring(2, 7);
        formatted += '-' + limited.substring(7);
      }
    }
    setPhone(formatted);
  };

  const handleCpfChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.substring(0, 11);
    
    let formatted = '';
    if (val.length > 0) {
      formatted += val.substring(0, 3);
    }
    if (val.length > 3) {
      formatted += '.' + val.substring(3, 6);
    }
    if (val.length > 6) {
      formatted += '.' + val.substring(6, 9);
    }
    if (val.length > 9) {
      formatted += '-' + val.substring(9, 11);
    }
    setCpf(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalNeighborhood = isCustom ? customNeighborhood.trim() : neighborhood;

    if (!name || phone.length < 14 || !planId || !finalNeighborhood || !city.trim()) {
      showToast('Por favor, preencha todos os campos obrigatórios com informações válidas.', 'warning');
      return;
    }

    const doSave = async () => {
      try {
        setSubmitting(true);
        await api.addCustomer({
          name, phone, cpf: cpf || null,
          planId, city: city.trim(), neighborhood: finalNeighborhood, status
        });
        showToast('Cliente cadastrado com sucesso!', 'success');
        onSuccess();
        onClose();
      } catch (err) {
        showToast(err.message || 'Erro ao cadastrar cliente.', 'error');
      } finally {
        setSubmitting(false);
      }
    };

    if (showConfirm) {
      showConfirm({
        title: 'Confirmar Cadastro',
        description: `Deseja cadastrar "${name}" como novo cliente?`,
        confirmLabel: 'Cadastrar',
        type: 'success',
        onConfirm: doSave
      });
    } else {
      await doSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-white dark:bg-isp-navy w-full max-w-lg rounded-2xl border border-slate-200 dark:border-isp-border shadow-2xl z-10 overflow-hidden animate-slideUp">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-isp-border/30">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-isp-accent" />
            <span>Cadastrar Novo Cliente</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-isp-border/30 transition-all duration-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-isp-muted flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Nome Completo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text" required
              placeholder="Digite o nome completo do cliente"
              value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent focus:ring-1 focus:ring-isp-accent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-isp-muted flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> WhatsApp <span className="text-rose-500">*</span>
              </label>
              <input
                type="text" required
                placeholder="(XX) 9XXXX-XXXX"
                value={phone} onChange={handlePhoneChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent focus:ring-1 focus:ring-isp-accent transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-isp-muted flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> CPF (Opcional)
              </label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={cpf} onChange={handleCpfChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent focus:ring-1 focus:ring-isp-accent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-isp-muted flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Bairro <span className="text-rose-500">*</span>
              </label>
              <select
                required value={isCustom ? 'OUTRO' : neighborhood} onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'OUTRO') {
                    setIsCustom(true);
                    setNeighborhood('');
                  } else {
                    setIsCustom(false);
                    setNeighborhood(val);
                  }
                }}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-sm text-slate-700 dark:text-white focus:outline-none focus:border-isp-accent focus:ring-1 focus:ring-isp-accent transition-all"
              >
                <option value="">Selecione o bairro...</option>
                {TERESINA_NEIGHBORHOODS.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
                <option value="OUTRO">Outro (digitar manualmente)...</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-isp-muted flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Cidade <span className="text-rose-500">*</span>
              </label>
              <input
                type="text" required
                placeholder="Digite a cidade"
                value={city} onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent focus:ring-1 focus:ring-isp-accent transition-all"
              />
            </div>
          </div>

          {isCustom && (
            <div className="space-y-1 animate-fadeIn">
              <label className="text-xs font-semibold text-slate-500 dark:text-isp-muted flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Nome do Bairro Personalizado <span className="text-rose-500">*</span>
              </label>
              <input
                type="text" required
                placeholder="Digite o nome do bairro"
                value={customNeighborhood} onChange={(e) => setCustomNeighborhood(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent focus:ring-1 focus:ring-isp-accent transition-all"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-isp-muted flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Plano Contratado <span className="text-rose-500">*</span>
              </label>
              <select
                value={planId} onChange={(e) => setPlanId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-sm text-slate-700 dark:text-white focus:outline-none focus:border-isp-accent focus:ring-1 focus:ring-isp-accent transition-all"
              >
                {plans.map(p => (
                  <option key={p.id} value={p.id}>{p.name} — R$ {p.price.toFixed(2)}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-isp-muted flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Status Inicial
              </label>
              <select
                value={status} onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-sm text-slate-700 dark:text-white focus:outline-none focus:border-isp-accent focus:ring-1 focus:ring-isp-accent transition-all"
              >
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
                <option value="SUSPENSO">Suspenso</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-isp-border/30">
            <button
              type="button" onClick={onClose} disabled={submitting}
              className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-isp-border/40 hover:bg-slate-50 dark:hover:bg-isp-border/20 text-slate-600 dark:text-slate-300 text-sm font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit" disabled={submitting}
              className="w-1/2 py-2.5 rounded-xl bg-isp-accent hover:bg-isp-accent/90 text-white text-sm font-semibold transition-all shadow-md shadow-isp-accent/15 flex items-center justify-center gap-2"
            >
              {submitting
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Salvando...</span></>
                : <><CheckCircle className="w-4 h-4" /><span>Salvar Cliente</span></>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
