import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components';
import type { Ticket } from '../types';
import { useAppSelector } from '../redux/hooks';
import { selectUserRole } from '../redux/slices/authSlice';

const Dashboard: React.FC = () => {
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    cancelled: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Mengambil role user dari Redux store
  const userRole = useAppSelector(selectUserRole);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recent tickets
        const ticketsResponse = await fetch('http://localhost:3001/tickets?_sort=createdAt&_order=desc&_limit=5');
        const tickets = await ticketsResponse.json();
        setRecentTickets(tickets);

        // Fetch ticket stats
        const allTicketsResponse = await fetch('http://localhost:3001/tickets');
        const allTickets = await allTicketsResponse.json();
        
        setTicketStats({
          total: allTickets.length,
          open: allTickets.filter((ticket: Ticket) => ticket.status === 'open').length,
          inProgress: allTickets.filter((ticket: Ticket) => ticket.status === 'in_progress').length,
          resolved: allTickets.filter((ticket: Ticket) => ticket.status === 'resolved').length,
          closed: allTickets.filter((ticket: Ticket) => ticket.status === 'closed').length,
          cancelled: allTickets.filter((ticket: Ticket) => ticket.status === 'cancelled').length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard: React.FC<{ title: string; value: number; color: string }> = ({ title, value, color }) => (
    <div className={`bg-white rounded-lg shadow p-6 border-t-4 ${color}`}>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <StatCard title="Total Tiket" value={ticketStats.total} color="border-blue-500" />
        <StatCard title="Tiket Terbuka" value={ticketStats.open} color="border-yellow-500" />
        <StatCard title="Dalam Proses" value={ticketStats.inProgress} color="border-orange-500" />
        <StatCard title="Terselesaikan" value={ticketStats.resolved} color="border-green-500" />
        <StatCard title="Ditutup" value={ticketStats.closed} color="border-gray-500" />
        <StatCard title="Dibatalkan" value={ticketStats.cancelled} color="border-red-500" />
      </div>

      {/* Recent Tickets */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Tiket Terbaru</h2>
          <Link to="/tickets">
            <Button variant="outline" size="sm">Lihat Semua</Button>
          </Link>
        </div>
        
        <div className="divide-y">
          {recentTickets.length > 0 ? (
            recentTickets.map((ticket) => (
              <div key={ticket.id} className="p-4 hover:bg-gray-50">
                <Link to={`/tickets/${ticket.id}`} className="block">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{ticket.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span>ID: {ticket.id}</span>
                        <span className="mx-2">•</span>
                        <span>Customer: {ticket.customerName}</span>
                      </div>
                    </div>
                    <div>
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
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              Tidak ada tiket terbaru
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions - Hanya tampilkan jika bukan role NOC */}
      {userRole !== 'noc' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Aksi Cepat</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/tickets/new">
              <Button variant="primary">Buat Tiket Baru</Button>
            </Link>
            <Link to="/customers/new">
              <Button variant="secondary">Tambah Customer</Button>
            </Link>
            <Link to="/users/new">
              <Button variant="outline">Tambah Pengguna</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;