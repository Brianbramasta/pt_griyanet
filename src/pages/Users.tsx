import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Table } from '../components';
import type { User } from '../types';

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        let url = 'http://localhost:3001/users';
        
        // Add query parameters for filtering
        const params = new URLSearchParams();
        if (search) params.append('q', search);
        if (roleFilter !== 'all') params.append('role', roleFilter);
        
        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;
        
        const response = await fetch(url);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [search, roleFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleRoleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
  };

  const handleRowClick = (user: User) => {
    navigate(`/users/${user.id}`);
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      cell: (user: User) => <span className="font-medium">{user.id}</span>
    },
    {
      header: 'Nama',
      accessor: 'name',
      cell: (user: User) => <span className="font-medium">{user.name}</span>
    },
    {
      header: 'Email',
      accessor: 'email',
      cell: (user: User) => <span>{user.email}</span>
    },
    {
      header: 'Role',
      accessor: 'role',
      cell: (user: User) => (
        <span className={
          `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
            user.role === 'technician' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`
        }>
          {user.role === 'admin' ? 'Admin' :
           user.role === 'technician' ? 'Teknisi' :
           'Customer Service'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'active',
      cell: (user: User) => (
        <span className={
          `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`
        }>
          {user.active ? 'Aktif' : 'Tidak Aktif'}
        </span>
      )
    },
    {
      header: 'Aksi',
      accessor: 'actions',
      cell: (user: User) => (
        <div className="flex space-x-2">
          <Link 
            to={`/users/${user.id}`}
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
        <h1 className="text-2xl font-semibold">Daftar Pengguna</h1>
        <Link to="/users/new">
          <Button variant="primary">Tambah Pengguna</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <div className="w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Cari pengguna..."
              className="px-4 py-2 border rounded-lg w-full"
              value={search}
              onChange={handleSearch}
            />
          </div>
          <div className="w-full sm:w-1/4">
            <select
              className="px-4 py-2 border rounded-lg w-full"
              value={roleFilter}
              onChange={handleRoleFilter}
            >
              <option value="all">Semua Role</option>
              <option value="admin">Admin</option>
              <option value="technician">Teknisi</option>
              <option value="customer_service">Customer Service</option>
            </select>
          </div>
        </div>

        <Table
          columns={columns}
          data={users}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          emptyMessage="Tidak ada pengguna yang ditemukan"
        />
      </div>
    </div>
  );
};

export default Users;