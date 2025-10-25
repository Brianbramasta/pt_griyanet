import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components';
import type { Ticket, TicketStatusHistory } from '../types';

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [statusUpdate, setStatusUpdate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    const fetchTicketData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const response = await fetch(`http://localhost:3001/tickets/${id}`);
        
        if (!response.ok) {
          throw new Error('Tiket tidak ditemukan');
        }
        
        const data = await response.json();
        setTicket(data);
      } catch (err) {
        console.error('Error fetching ticket data:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTicketData();
    }
  }, [id]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusUpdate(e.target.value);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };
  type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
  const handleUpdateStatus = async () => {
    if (!ticket || !statusUpdate) return;
    
    try {
      if (statusUpdate === 'closed' && ticket.status !== 'resolved') {
        alert('Tiket harus diselesaikan (resolved) terlebih dahulu sebelum ditutup (closed)');
        return;
      }
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const now = new Date().toISOString();
      const newStatusHistory: TicketStatusHistory = {
        id:id || '1',
        status: statusUpdate as TicketStatus,
        timestamp: now,
        userId: currentUser.id || '1',
        userName: currentUser.name || 'Admin User',
        notes: notes
      };
      
      const updatedTicket = {
        ...ticket,
        status: statusUpdate as TicketStatus,
        updatedAt: now,
        resolvedAt: statusUpdate === 'resolved' ? now : ticket.resolvedAt,
        closedAt: statusUpdate === 'closed' ? now : ticket.closedAt,
        statusHistory: [...(ticket.statusHistory || []), newStatusHistory]
      };
      
      const response = await fetch(`http://localhost:3001/tickets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTicket)
      });
      
      if (!response.ok) {
        throw new Error('Gagal memperbarui status tiket');
      }
      
      setTicket(updatedTicket);
      setNotes('');
    } catch (err) {
      console.error('Error updating ticket status:', err);
      alert('Gagal memperbarui status tiket');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus tiket ini?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3001/tickets/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Gagal menghapus tiket');
      }
      
      navigate('/tickets');
    } catch (err) {
      console.error('Error deleting ticket:', err);
      alert('Gagal menghapus tiket');
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
        <h1 className="text-2xl font-semibold">Detail Tiket</h1>
        <div className="flex space-x-2">
          <Link to={`/tickets/edit/${ticket.id}`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Hapus
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{ticket.title}</h2>
                <span className={
                  `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                    ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`
                }>
                  {ticket.status === 'open' ? 'Terbuka' :
                   ticket.status === 'in_progress' ? 'Dalam Proses' :
                   'Terselesaikan'}
                </span>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <Link to={`/customers/${ticket.customerId}`} className="text-blue-600 hover:text-blue-800">
                    {ticket.customerName}
                  </Link>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kategori</p>
                  <p>{ticket.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prioritas</p>
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
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dibuat Pada</p>
                  <p>{new Date(ticket.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Terakhir Diperbarui</p>
                  <p>{new Date(ticket.updatedAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ditugaskan Kepada</p>
                  <p>{ticket.assignedTo || 'Belum ditugaskan'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">Riwayat Status</h2>
            </div>
            <div className="p-4">
              {ticket.statusHistory && ticket.statusHistory.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <ul className="space-y-6">
                    {ticket.statusHistory.map((history, index) => (
                      <li key={index} className="relative pl-8">
                        <div className="absolute left-0 top-2 w-8 flex items-center justify-center">
                          <div className={
                            `w-3 h-3 rounded-full ${
                              history.status === 'open' ? 'bg-yellow-500' :
                              history.status === 'in_progress' ? 'bg-blue-500' :
                              'bg-green-500'
                            }`
                          }></div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                Status diubah menjadi 
                                <span className={
                                  `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-1 ${
                                    history.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                                    history.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                                  }`
                                }>
                                  {history.status === 'open' ? 'Terbuka' :
                                   history.status === 'in_progress' ? 'Dalam Proses' :
                                   'Terselesaikan'}
                                </span>
                              </p>
                              <p className="text-sm text-gray-500">
                                oleh {history.userName} pada {new Date(history.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          {history.notes && (
                            <div className="mt-2 text-gray-700">
                              {history.notes}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Belum ada riwayat status</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Update Status */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">Perbarui Status</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status Baru
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={statusUpdate}
                    onChange={handleStatusChange}
                  >
                    <option value="">Pilih Status</option>
                    <option value="open">Terbuka</option>
                    <option value="in_progress">Dalam Proses</option>
                    <option value="resolved">Terselesaikan</option>
                    <option value="closed" disabled={ticket?.status !== 'resolved'}>Ditutup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Komentar (Opsional)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    value={notes}
                    onChange={handleNotesChange}
                    placeholder="Tambahkan komentar atau catatan tentang perubahan status"
                  ></textarea>
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleUpdateStatus}
                  disabled={!statusUpdate}
                >
                  Perbarui Status
                </Button>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">Informasi Customer</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nama</p>
                  <p className="font-medium">{ticket.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p>{ticket.customerId}</p>
                </div>
                <div className="pt-2">
                  <Link to={`/customers/${ticket.customerId}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Lihat Detail Customer
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;