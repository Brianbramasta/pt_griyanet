import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Table } from '../components';
import type { Ticket, TicketFilters } from '../types';
import { ticketService } from '../services/ticketService';

const Tickets: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TicketFilters>({
    search: '',
    status: '',
    priority: '',
    category: ''
  });

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        // let url = 'http://localhost:3001/tickets?_sort=createdAt&_order=desc';
        
        // if (filters.search) {
        //   url += `&q=${filters.search}`;
        // }
        
        // if (filters.status && filters.status !== 'all') {
        //   url += `&status=${filters.status}`;
        // }
        
        // if (filters.priority && filters.priority !== 'all') {
        //   url += `&priority=${filters.priority}`;
        // }
        
        // if (filters.category && filters.category !== 'all') {
        //   url += `&category=${filters.category}`;
        // }
        
        // const response = await fetch(url);
        // const data = await response.json();
        const data = await ticketService.getAll(filters);
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [filters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };
  type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled' | '';
  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, status: e.target.value as TicketStatus }));
  };
  type TicketPriority = 'low' | 'medium' | 'high' | 'critical' | '';
  const handlePriorityFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, priority: e.target.value as TicketPriority }));
  };
  type TicketCategory = 'connection' | 'speed' | 'billing' | 'hardware' | 'other' | '';
  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, category: e.target.value as TicketCategory }));
  };

  const handleRowClick = (ticket: Ticket) => {
    navigate(`/tickets/${ticket.id}`);
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'id' as keyof Ticket,
      cell: (ticket: Ticket) => <span className="font-medium">{ticket.id}</span>
    },
    {
      header: 'Judul',
      accessor: 'title' as keyof Ticket,
      cell: (ticket: Ticket) => <span className="font-medium">{ticket.title}</span>
    },
    {
      header: 'Customer',
      accessor: 'customerName' as keyof Ticket,
      cell: (ticket: Ticket) => <span>{ticket.customerName}</span>
    },
    {
      header: 'Kategori',
      accessor: 'category' as keyof Ticket,
      cell: (ticket: Ticket) => <span>{ticket.category}</span>
    },
    {
      header: 'Prioritas',
      accessor: 'priority' as keyof Ticket,
      cell: (ticket: Ticket) => (
        <span className={
          `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
            ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`
        }>
          {ticket.priority === 'high' ? 'Tinggi' :
           ticket.priority === 'medium' ? 'Sedang' :
           'Rendah'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status' as keyof Ticket,
      cell: (ticket: Ticket) => (
        <span className={
          `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
            ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
            ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' :
            ticket.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`
        }>
          {ticket.status === 'open' ? 'Terbuka' :
           ticket.status === 'in_progress' ? 'Dalam Proses' :
           ticket.status === 'resolved' ? 'Terselesaikan' :
           ticket.status === 'closed' ? 'Ditutup' :
           ticket.status === 'cancelled' ? 'Dibatalkan' :
           ticket.status}
        </span>
      )
    },
    {
      header: 'Tanggal Dibuat',
      accessor: 'createdAt' as keyof Ticket,
      cell: (ticket: Ticket) => <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
    },
    {
      header: 'Aksi',
      accessor: (ticket: Ticket) => (
        <div className="flex space-x-2">
          <Link 
            to={`/tickets/${ticket.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-blue-600 hover:text-blue-800"
          >
            Detail
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Daftar Tiket</h1>
        <Link to="/tickets/new">
          <Button variant="primary">Buat Tiket Baru</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Cari tiket..."
              className="px-4 py-2 border rounded-lg w-full"
              value={filters.search}
              onChange={handleSearch}
            />
          </div>
          <div className="w-full sm:w-2/3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <select
              className="px-4 py-2 border rounded-lg w-full"
              value={filters.status}
              onChange={handleStatusFilter}
            >
              <option value="">Semua Status</option>
              <option value="open">Terbuka</option>
              <option value="in_progress">Dalam Proses</option>
              <option value="resolved">Terselesaikan</option>
              <option value="closed">Ditutup</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
            <select
              className="px-4 py-2 border rounded-lg w-full"
              value={filters.priority}
              onChange={handlePriorityFilter}
            >
              <option value="">Semua Prioritas</option>
              <option value="high">Tinggi</option>
              <option value="medium">Sedang</option>
              <option value="low">Rendah</option>
            </select>
            <select
              className="px-4 py-2 border rounded-lg w-full"
              value={filters.category}
              onChange={handleCategoryFilter}
            >
              <option value="">Semua Kategori</option>
              <option value="connection">Koneksi</option>
              <option value="hardware">Hardware</option>
              <option value="billing">Billing</option>
              <option value="other">Lainnya</option>
            </select>
          </div>
        </div>

        <Table
          columns={columns}
          data={tickets}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          emptyMessage="Tidak ada tiket yang ditemukan"
        />
      </div>
    </div>
  );
};

export default Tickets;