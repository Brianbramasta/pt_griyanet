import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../components';
import type { Customer, Ticket } from '../types';
import { customerService } from '../services';
import { ticketService } from '../services';

const AdminReports: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        // const [cRes, tRes] = await Promise.all([
        //   fetch('http://localhost:3001/customers'),
        //   fetch('http://localhost:3001/tickets'),
        // ]);
        const [cData, tData] = await Promise.all([
          // cRes.json(),
          // tRes.json(),
          customerService.getAll(),
          ticketService.getAll()
        ]);
        setCustomers(cData);
        setTickets(tData);
      } catch (err) {
        console.error('Error fetch reports:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const totalTickets = tickets.length;
    const ticketsByStatus = tickets.reduce<Record<string, number>>((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {});
    const ticketsByPriority = tickets.reduce<Record<string, number>>((acc, t) => {
      acc[t.priority] = (acc[t.priority] || 0) + 1;
      return acc;
    }, {});
    const recentCustomers = [...customers].sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()).slice(0, 5);
    const recentTickets = [...tickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
    return { totalCustomers, totalTickets, ticketsByStatus, ticketsByPriority, recentCustomers, recentTickets };
  }, [customers, tickets]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Laporan Admin</h1>
        <Button variant="primary" onClick={() => window.print()}>Cetak</Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded w-3/4"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium mb-4">Ringkasan</h2>
              <div className="space-y-2 text-gray-700">
                <p>Total Pelanggan: <span className="font-semibold">{stats.totalCustomers}</span></p>
                <p>Total Tiket: <span className="font-semibold">{stats.totalTickets}</span></p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium mb-4">Tiket berdasarkan Status</h2>
              <div className="space-y-2 text-gray-700">
                {Object.entries(stats.ticketsByStatus).map(([status, count]) => (
                  <p key={status}>{status}: <span className="font-semibold">{count}</span></p>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium mb-4">Tiket berdasarkan Prioritas</h2>
              <div className="space-y-2 text-gray-700">
                {Object.entries(stats.ticketsByPriority).map(([priority, count]) => (
                  <p key={priority}>{priority}: <span className="font-semibold">{count}</span></p>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium">Pelanggan Terbaru</h2>
              </div>
              <div className="divide-y">
                {stats.recentCustomers.map(c => (
                  <div key={c.id} className="p-4">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-gray-500">{c.email} • {c.phone}</p>
                    <p className="text-xs text-gray-400">Terdaftar: {new Date(c.registrationDate).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium">Tiket Terbaru</h2>
              </div>
              <div className="divide-y">
                {stats.recentTickets.map(t => (
                  <div key={t.id} className="p-4">
                    <p className="font-medium">{t.title}</p>
                    <p className="text-sm text-gray-500">{t.customerName}</p>
                    <p className="text-xs text-gray-400">Dibuat: {new Date(t.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;