import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Calendar, 
  Smartphone, 
  ChevronRight,
  UserCheck,
  UserX,
  AlertTriangle,
  Gift
} from 'lucide-react';
import { api } from '../services/api';

export default function CustomersTab({ openNewCustomerModal, openCustomerDetails, showToast, showConfirm, currentUser }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [locationFilter, setLocationFilter] = useState('TODOS');
  const [locations, setLocations] = useState([]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await api.getCustomers();
      setCustomers(data);

      // Extrair bairros/cidades únicas para filtro
      const locs = new Set();
      data.forEach(c => {
        if (c.neighborhood && c.city) {
          locs.add(`${c.neighborhood} - ${c.city}`);
        } else if (c.city) {
          locs.add(c.city);
        }
      });
      setLocations(Array.from(locs).sort());
    } catch (error) {
      showToast('Erro ao carregar clientes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Evita abrir o modal de detalhes ao clicar em deletar
    if (currentUser?.role !== 'ADMIN') {
      showToast('Apenas administradores possuem permissão para excluir clientes.', 'error');
      return;
    }
    
    showConfirm({
      title: 'Remover Cliente',
      description: 'Tem certeza que deseja remover este cliente? Esta ação é irreversível.',
      confirmLabel: 'Remover',
      cancelLabel: 'Cancelar',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.deleteCustomer(id);
          showToast('Cliente removido com sucesso!', 'success');
          fetchCustomers();
        } catch (error) {
          showToast(error.message || 'Erro ao deletar cliente.', 'error');
        }
      }
    });
  };

  // Filtrar clientes localmente para responsividade imediata
  const filteredCustomers = customers.filter(c => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      c.name.toLowerCase().includes(searchLower) ||
      (c.phone && c.phone.includes(searchTerm)) ||
      (c.cpf && c.cpf.includes(searchTerm));

    const matchesStatus = statusFilter === 'TODOS' || c.status === statusFilter;
    
    const clientLoc = `${c.neighborhood} - ${c.city}`;
    const matchesLocation = locationFilter === 'TODOS' || clientLoc === locationFilter || c.city === locationFilter;

    return matchesSearch && matchesStatus && matchesLocation;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Diretório de Clientes</h2>
          <p className="text-sm text-slate-500 dark:text-isp-muted">Pesquise, filtre e gerencie todos os clientes da sua base.</p>
        </div>
        <button
          onClick={openNewCustomerModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-isp-accent hover:bg-isp-accent/90 text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-isp-accent/20 align-self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Cliente</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white dark:bg-isp-navy p-4 rounded-2xl border border-slate-200 dark:border-isp-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="w-full md:max-w-md relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-isp-muted" />
          <input
            type="text"
            placeholder="Buscar por nome, WhatsApp ou CPF..."
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
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
              <option value="SUSPENSO">Suspenso</option>
            </select>
          </div>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-white focus:outline-none focus:border-isp-accent transition-all duration-200"
          >
            <option value="TODOS">Todos os Bairros/Cidades</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-isp-navy rounded-2xl border border-slate-200 dark:border-isp-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-isp-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-isp-muted font-medium text-xs">Carregando lista de clientes...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-isp-border/30 text-xs font-semibold text-slate-400 dark:text-isp-muted uppercase bg-slate-50/50 dark:bg-isp-border/10">
                  <th className="py-4 px-6">Nome</th>
                  <th className="py-4 px-6">WhatsApp</th>
                  <th className="py-4 px-6">Bairro / Cidade</th>
                  <th className="py-4 px-6">Plano Contratado</th>
                  <th className="py-4 px-6">Progresso</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Cadastro</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-isp-border/20 text-sm">
                {filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id}
                    onClick={() => openCustomerDetails(customer.id)}
                    className="hover:bg-slate-50/70 dark:hover:bg-isp-border/10 transition-all duration-200 cursor-pointer group"
                  >
                    {/* Name & CPF */}
                    <td className="py-4 px-6 font-semibold text-slate-800 dark:text-white">
                      <div>{customer.name}</div>
                      {customer.cpf && (
                        <div className="text-xs text-slate-400 dark:text-isp-muted font-normal mt-0.5">
                          CPF: {customer.cpf}
                        </div>
                      )}
                    </td>
                    
                    {/* Phone */}
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{customer.phone}</span>
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{customer.neighborhood}, {customer.city}</span>
                      </span>
                    </td>

                    {/* Plan */}
                    <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-200">
                      {customer.plan ? customer.plan.name : 'Nenhum'}
                    </td>

                    {/* Referral Progress */}
                    <td className="py-4 px-6">
                      {(() => {
                        const total = customer.referralsPerReward || 3;
                        const current = customer.progressInCycle || 0;
                        const earned = Math.floor((customer.installedReferrals || 0) / total);
                        return (
                          <div className="flex flex-col gap-1 min-w-[90px]">
                            <div className="flex items-center gap-1.5">
                              <Gift className="w-3 h-3 text-isp-accent shrink-0" />
                              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                {current}<span className="font-normal text-slate-400">/{total}</span>
                              </span>
                              {earned > 0 && (
                                <span className="ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-isp-accent/10 text-isp-accent">
                                  {earned}🎁
                                </span>
                              )}
                            </div>
                            <div className="flex gap-0.5">
                              {Array.from({ length: total }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                    i < current
                                      ? 'bg-isp-accent'
                                      : 'bg-slate-200 dark:bg-isp-border/40'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        customer.status === 'ATIVO' ? 'bg-emerald-500/10 text-emerald-500' :
                        customer.status === 'INATIVO' ? 'bg-slate-500/15 text-slate-500 dark:text-isp-muted' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          customer.status === 'ATIVO' ? 'bg-emerald-500' :
                          customer.status === 'INATIVO' ? 'bg-slate-400' :
                          'bg-amber-500'
                        }`} />
                        <span>{customer.status}</span>
                      </span>
                    </td>

                    {/* Registration Date */}
                    <td className="py-4 px-6 text-slate-500 dark:text-isp-muted">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(customer.createdAt).toLocaleDateString('pt-BR')}</span>
                      </span>
                    </td>

                    {/* Delete button & details arrow */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {currentUser?.role === 'ADMIN' && (
                          <button
                            onClick={(e) => handleDelete(customer.id, e)}
                            title="Remover Cliente"
                            className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-200"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-isp-accent group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-12">
                      <div className="flex flex-col items-center justify-center text-slate-400 dark:text-isp-muted gap-2">
                        <AlertTriangle className="w-8 h-8 text-amber-500/80" />
                        <span className="text-sm font-medium">Nenhum cliente atende aos filtros atuais.</span>
                        <span className="text-xs">Tente ajustar a busca ou limpar os filtros.</span>
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
