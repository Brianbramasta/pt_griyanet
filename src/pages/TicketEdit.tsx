import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button, Input } from '../components';
import { ticketService } from '../services/ticketService';
import { customerService } from '../services/customerService';
import type { Ticket, TicketFormData, TicketPriority, TicketCategory, Customer, TicketStatus } from '../types';
import { useAuth } from '../context/AuthContext';

const TicketEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [form, setForm] = useState<TicketFormData>({
    title: '',
    description: '',
    customerId: '',
    customerName: '',
    createdBy: user?.id || '',
    assignedTo: '',
    status: 'open',
    priority: 'medium',
    category: 'other',
    attachments: [],
    notes: '',
  } as TicketFormData);

  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true);
      setError('');
      try {
        if (!id) throw new Error('ID tiket tidak valid');
        const data = await ticketService.getById(id);
        setTicket(data);
        // Prefill form from fetched ticket
        setForm({
          title: data.title,
          description: data.description,
          customerId: String(data.customerId),
          customerName: data.customerName,
          createdBy: data.createdBy,
          assignedTo: data.assignedTo || '',
          status: data.status as TicketStatus,
          priority: data.priority as TicketPriority,
          category: data.category as TicketCategory,
          attachments: data.attachments || [],
          notes: data.notes || '',
        } as TicketFormData);
      } catch (err) {
        console.error('Error fetching ticket:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil tiket');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCustomers = async () => {
      setIsLoadingCustomers(true);
      try {
        const data = await customerService.getAll();
        setCustomers(data);
      } catch (err) {
        console.error('Error fetching customers:', err);
      } finally {
        setIsLoadingCustomers(false);
      }
    };

    fetchInitial();
    fetchCustomers();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const found = customers.find(c => String(c.id) === String(value));
    setForm(prev => ({
      ...prev,
      customerId: value,
      customerName: found?.name || '',
    }));
  };

  const priorities: TicketPriority[] = ['low', 'medium', 'high', 'critical'];
  const categories: TicketCategory[] = ['connection', 'speed', 'billing', 'hardware', 'other'];
  const statuses: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed', 'cancelled'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (!id) throw new Error('ID tiket tidak valid');
      if (!form.title || !form.description || !form.customerId) {
        throw new Error('Judul, deskripsi, dan customer wajib diisi');
      }

      const now = new Date().toISOString();
      let updatedTicket: Ticket = {
        ...(ticket as Ticket),
        ...form,
        id: id,
        updatedAt: now,
      } as Ticket;

      if (form.status === 'closed' && (ticket as Ticket)?.status !== 'resolved') {
        setError('Tiket harus diselesaikan (resolved) terlebih dahulu sebelum ditutup (closed)');
        setIsSubmitting(false);
        return;
      }

      if (form.status === 'resolved' && !(ticket as Ticket)?.resolvedAt) {
        updatedTicket.resolvedAt = now;
      }
      if (form.status === 'closed') {
        updatedTicket.closedAt = now;
      }

      const newStatusHistory = {
        id: crypto.randomUUID(),
        status: form.status as TicketStatus,
        timestamp: now,
        userId: user?.id || 'system',
        userName: user?.name || 'System',
        notes: form.notes || '',
      } as any;
      updatedTicket.statusHistory = [
        ...((ticket as Ticket)?.statusHistory || []),
        newStatusHistory,
      ];

      // Use service to update
      const result = await ticketService.update(id, updatedTicket as unknown as TicketFormData);
      if (result && (result as any).id) {
        navigate(`/tickets/${id}`);
      } else {
        navigate('/tickets');
      }
    } catch (err) {
      console.error('Error updating ticket:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan tiket');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded w-3/4"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Tiket tidak ditemukan'}
        </div>
        <Button variant="outline" onClick={() => navigate('/tickets')}>
          Kembali ke Daftar Tiket
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Edit Tiket</h1>
        <div className="flex space-x-2">
          <Link to={`/tickets/${id}`}>
            <Button variant="outline">Batal</Button>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium mb-4">Informasi Tiket</h2>
            <div className="space-y-4">
              <Input label="Judul" name="title" value={form.title} onChange={handleChange} required />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="px-3 py-2 border rounded-md w-full" rows={4} />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <select name="customerId" value={form.customerId} onChange={handleCustomerChange} className="px-3 py-2 border rounded-md w-full">
                  <option value="">Pilih Customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <Input label="Nama Customer" name="customerName" value={form.customerName} onChange={handleChange} />
              <Input label="Assigned To" name="assignedTo" value={form.assignedTo || ''} onChange={handleChange} />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">Pengaturan Tiket</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="px-3 py-2 border rounded-md w-full">
                  {statuses.map(s => (
                    <option key={s} value={s} disabled={s === 'closed' && ticket?.status !== 'resolved'}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Prioritas</label>
                <select name="priority" value={form.priority} onChange={handleChange} className="px-3 py-2 border rounded-md w-full">
                  {priorities.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                <select name="category" value={form.category} onChange={handleChange} className="px-3 py-2 border rounded-md w-full">
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Catatan</label>
                <textarea name="notes" value={form.notes || ''} onChange={handleChange} className="px-3 py-2 border rounded-md w-full" rows={3} />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-2">
          <Link to={`/tickets/${id}`}>
            <Button variant="outline">Batal</Button>
          </Link>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>Simpan Perubahan</Button>
        </div>
      </form>
    </div>
  );
};

export default TicketEdit;