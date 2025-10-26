import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components';
import type { Customer, Ticket } from '../types';
import { customerService, ticketService } from '../services/index';

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerTickets, setCustomerTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCustomerData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // Fetch customer details
        // const customerResponse = await fetch(`http://localhost:3001/customers/${id}`);
        
        
        // if (!customerResponse.ok) {
        //   throw new Error('Customer tidak ditemukan');
        // }
        
        // const customerData = await customerResponse.json();
        const customerData = await customerService.getById(id!);
        setCustomer(customerData);
        
        // Fetch customer tickets
        // const ticketsResponse = await fetch(`http://localhost:3001/tickets?customerId=${id}`);
        // const ticketsData = await ticketsResponse.json();
        const ticketsData = await customerService.getTickets(id!);
        setCustomerTickets(ticketsData);
      } catch (err) {
        console.error('Error fetching customer data:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCustomerData();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus customer ini?')) {
      return;
    }
    
    try {
      // const response = await fetch(`http://localhost:3001/customers/${id}`, {
      //   method: 'DELETE',
      // });
      
      // if (!response.ok) {
      //   throw new Error('Gagal menghapus customer');
      // }
      const getCustomer = await customerService.getTickets(id!);
      for (const _ticket of getCustomer) {
        console.log('Ticket to delete:', _ticket);
        await ticketService.delete(_ticket.id);
      }
      console.log('Customer to delete:', getCustomer);
      await customerService.delete(id!);

      
      
      navigate('/customers');
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert('Gagal menghapus customer');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded w-3/4"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Customer tidak ditemukan'}
        </div>
        <Button variant="outline" onClick={() => navigate('/customers')}>
          Kembali ke Daftar Customer
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Detail Customer</h1>
        <div className="flex space-x-2">
          <Link to={`/customers/edit/${customer.id}`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Hapus
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium mb-4">Informasi Customer</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-medium">{customer.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nama</p>
                  <p className="font-medium">{customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telepon</p>
                  <p>{customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Alamat</p>
                  <p>{customer.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={
                    `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`
                  }>
                    {customer.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-4">Detail Layanan</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Paket Internet</p>
                  <p className="font-medium">{customer.serviceDetails?.packageName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Instalasi</p>
                  <p>{customer.serviceDetails?.installationDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Pembayaran</p>
                  <p>{customer.registrationDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Catatan</p>
                  <p>{customer.notes || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Tiket Customer</h2>
          <Link to={`/tickets/new?customerId=${customer.id}`}>
            <Button variant="primary" size="sm">Buat Tiket Baru</Button>
          </Link>
        </div>
        
        {customerTickets.length > 0 ? (
          <div className="divide-y">
            {customerTickets.map((ticket) => (
              <div key={ticket.id} className="p-4 hover:bg-gray-50">
                <Link to={`/tickets/${ticket.id}`} className="block">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{ticket.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span>ID: {ticket.id}</span>
                        <span className="mx-2">•</span>
                        <span>Dibuat: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div>
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
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>Customer ini belum memiliki tiket</p>
            <Link to={`/tickets/new?customerId=${customer.id}`} className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
              Buat tiket baru
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetail;