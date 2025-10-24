import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button, Input } from '../components';
import { ticketService } from '../services/ticketService';
import { customerService } from '../services/customerService';
import type { TicketFormData, TicketPriority, TicketCategory, Customer } from '../types';
import { useAuth } from '../context/AuthContext';

const TicketNew: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const initialCustomerId = searchParams.get('customerId') || '';

  const [form, setForm] = useState<TicketFormData>({
    title: '',
    description: '',
    customerId: initialCustomerId,
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
    const fetchCustomers = async () => {
      setIsLoadingCustomers(true);
      console.log(isLoadingCustomers)
      setError('');
      try {
        const data = await customerService.getAll();
        setCustomers(data);
        // if initial customerId present, set customerName
        if (initialCustomerId) {
          const found = data.find(c => String(c.id) === String(initialCustomerId));
          if (found) {
            setForm(prev => ({ ...prev, customerName: found.name }));
          }
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data pelanggan');
      } finally {
        setIsLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, [initialCustomerId]);

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

  // const isReady = useMemo(() => !isLoadingCustomers, [isLoadingCustomers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (!form.title || !form.description || !form.customerId) {
        throw new Error('Judul, deskripsi, dan customer wajib diisi');
      }

      const now = new Date().toISOString();
      const data: TicketFormData = {
        ...form,
        createdAt: now,
        updatedAt: now,
        statusHistory: [
          {
            id: crypto.randomUUID(),
            status: 'open',
            timestamp: now,
            userId: user?.id || 'system',
            userName: user?.name || 'System',
            notes: 'Tiket dibuat',
          },
        ] as any,
      } as any;

      const created = await ticketService.create(data);
      if (created && created.id) {
        navigate(`/tickets/${created.id}`);
      } else {
        navigate('/tickets');
      }
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan tiket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Buat Tiket Baru</h1>
        <div className="flex space-x-2">
          <Link to={initialCustomerId ? `/customers/${initialCustomerId}` : '/tickets'}>
            <Button variant="outline">Batal</Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

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
                <select name="customerId" value={form.customerId} onChange={handleCustomerChange} className="px-3 py-2 border rounded-md w-full" required>
                  <option value="">Pilih Customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>
              <Input label="Ditugaskan ke (User ID)" name="assignedTo" value={form.assignedTo || ''} onChange={handleChange} />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Catatan</label>
                <textarea name="notes" value={form.notes || ''} onChange={handleChange} className="px-3 py-2 border rounded-md w-full" rows={3} />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">Lampiran</h2>
            <div className="space-y-4">
              <Input label="URL Lampiran (opsional)" name="attachments" value={(form.attachments && form.attachments[0]) || ''} onChange={(e) => setForm(prev => ({ ...prev, attachments: e.target.value ? [e.target.value] : [] }))} />
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end">
          <Button type="submit" variant="primary" isLoading={isSubmitting}>Simpan Tiket</Button>
        </div>
      </form>
    </div>
  );
};

export default TicketNew;