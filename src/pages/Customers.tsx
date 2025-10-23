import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Table } from '../components';
import type { Customer, CustomerFilters } from '../types';

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<CustomerFilters>({
    search: '',
    status: 'all'
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        let url = 'http://localhost:3001/customers?';
        
        if (filters.search) {
          url += `&q=${filters.search}`;
        }
        
        if (filters.status && filters.status !== 'all') {
          url += `&status=${filters.status}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [filters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, status: e.target.value }));
  };

  const handleRowClick = (customer: Customer) => {
    navigate(`/customers/${customer.id}`);
  };

  const columns: TableProps<Customer>["columns"] = = [
    {
      header: 'ID',
      accessor: 'id',
      cell: (customer: Customer) => <span className="font-medium">{customer.id}</span>
    },
    {
      header: 'Nama',
      accessor: 'name',
      cell: (customer: Customer) => <span className="font-medium">{customer.name}</span>
    },
    {
      header: 'Email',
      accessor: 'email',
      cell: (customer: Customer) => <span>{customer.email}</span>
    },
    {
      header: 'Telepon',
      accessor: 'phone',
      cell: (customer: Customer) => <span>{customer.phone}</span>
    },
    {
      header: 'Alamat',
      accessor: 'address',
      cell: (customer: Customer) => <span className="truncate max-w-xs">{customer.address}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (customer: Customer) => (
        <span className={
          `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`
        }>
          {customer.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
        </span>
      )
    },
    {
      header: 'Aksi',
      accessor: 'actions',
      cell: (customer: Customer) => (
        <div className="flex space-x-2">
          <Link 
            to={`/customers/${customer.id}`}
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
        <h1 className="text-2xl font-semibold">Daftar Customer</h1>
        <Link to="/customers/new">
          <Button variant="primary">Tambah Customer</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Cari customer..."
              className="px-4 py-2 border rounded-lg w-full"
              value={filters.search}
              onChange={handleSearch}
            />
          </div>
          <div className="w-full sm:w-auto flex space-x-2">
            <select
              className="px-4 py-2 border rounded-lg w-full"
              value={filters.status}
              onChange={handleStatusFilter}
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>
        </div>

        <Table
          columns={columns}
          data={customers}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          emptyMessage="Tidak ada customer yang ditemukan"
        />
      </div>
    </div>
  );
};

export default Customers;