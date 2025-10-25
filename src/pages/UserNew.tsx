import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input } from '../components';
import { userService } from '../services/userService';
import type { UserFormData, UserRole } from '../types/user';

const UserNew: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<{
    name: string;
    email: string;
    username: string;
    role: UserRole;
    password: string;
    confirmPassword: string;
    isActive: boolean;
  }>({
    name: '',
    email: '',
    username: '',
    role: 'cs',
    password: '',
    confirmPassword: '',
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Basic validation
      if (!form.name || !form.email || !form.username) {
        throw new Error('Nama, email, dan username wajib diisi');
      }
      if (!form.password || !form.confirmPassword) {
        throw new Error('Password dan konfirmasi password wajib diisi');
      }
      if (form.password !== form.confirmPassword) {
        throw new Error('Password dan konfirmasi password tidak cocok');
      }

      const data: UserFormData = {
        name: form.name,
        email: form.email,
        username: form.username,
        role: form.role,
        isActive: form.isActive,
        password: form.password,
        confirmPassword: form.confirmPassword,
      };

      const created = await userService.create(data);

      if (created && (created as any).id) {
        navigate(`/users/${(created as any).id}`);
      } else {
        navigate('/users');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan pengguna');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Tambah Pengguna</h1>
        <Link to="/users">
          <Button variant="outline">Kembali</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium mb-4">Informasi Pengguna</h2>
            <div className="space-y-4">
              <Input label="Nama" name="name" value={form.name} onChange={handleChange} placeholder="Nama lengkap" required />
              <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@example.com" required />
              <Input label="Username" name="username" value={form.username} onChange={handleChange} placeholder="username" required />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select name="role" value={form.role} onChange={handleChange} className="px-3 py-2 border rounded-md w-full">
                  <option value="admin">Admin</option>
                  <option value="cs">Customer Service</option>
                  <option value="noc">Teknisi</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
                <Input label="Konfirmasi Password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="isActive" name="isActive" checked={form.isActive} onChange={handleChange} />
                <label htmlFor="isActive" className="text-sm text-gray-700">Aktif</label>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end space-x-2">
          <Button type="submit" variant="primary" isLoading={isSubmitting}>Simpan</Button>
        </div>
      </form>
    </div>
  );
};

export default UserNew;