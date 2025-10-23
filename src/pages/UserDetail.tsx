import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components';
import type { User } from '../types';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const response = await fetch(`http://localhost:3001/users/${id}`);
        
        if (!response.ok) {
          throw new Error('Pengguna tidak ditemukan');
        }
        
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleToggleStatus = async () => {
    if (!user) return;
    
    try {
      const updatedUser = {
        ...user,
        active: !user.active
      };
      
      const response = await fetch(`http://localhost:3001/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      });
      
      if (!response.ok) {
        throw new Error('Gagal memperbarui status pengguna');
      }
      
      setUser(updatedUser);
    } catch (err) {
      console.error('Error updating user status:', err);
      alert('Gagal memperbarui status pengguna');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3001/users/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Gagal menghapus pengguna');
      }
      
      navigate('/users');
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Gagal menghapus pengguna');
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

  if (error || !user) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Pengguna tidak ditemukan'}
        </div>
        <Button variant="outline" onClick={() => navigate('/users')}>
          Kembali ke Daftar Pengguna
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Detail Pengguna</h1>
        <div className="flex space-x-2">
          <Link to={`/users/edit/${user.id}`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Hapus
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <div className="flex items-center mt-1">
                <span className={
                  `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'technician' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`
                }>
                  {user.role === 'admin' ? 'Admin' :
                   user.role === 'technician' ? 'Teknisi' :
                   'Customer Service'}
                </span>
                <span className={
                  `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`
                }>
                  {user.active ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Informasi Pengguna</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-medium">{user.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nama</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p>{user.role === 'admin' ? 'Admin' :
                      user.role === 'technician' ? 'Teknisi' :
                      'Customer Service'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center mt-1">
                    <span className={
                      `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3 ${
                        user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`
                    }>
                      {user.active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                    <Button 
                      variant={user.active ? 'danger' : 'success'} 
                      size="sm"
                      onClick={handleToggleStatus}
                    >
                      {user.active ? 'Nonaktifkan' : 'Aktifkan'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Informasi Tambahan</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Tanggal Bergabung</p>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Terakhir Login</p>
                  <p>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Belum pernah login'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telepon</p>
                  <p>{user.phone || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log - Placeholder for future implementation */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Log Aktivitas</h2>
        </div>
        <div className="p-8 text-center text-gray-500">
          <p>Fitur log aktivitas akan segera hadir</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;