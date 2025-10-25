import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button, Input } from '../components';
import { userService } from '../services/userService';
import type { User, UserFormData, UserRole } from '../types/user';

const UserEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<{
    name: string;
    email: string;
    username: string;
    role: UserRole;
    isActive: boolean;
    password?: string;
    confirmPassword?: string;
  }>({
    name: '',
    email: '',
    username: '',
    role: 'cs',
    isActive: true,
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      setIsLoading(true);
      setError('');
      try {
        const data: User = await userService.getById(id);
        setForm({
          name: data.name,
          email: data.email,
          username: data.username,
          role: data.role,
          isActive: data.isActive,
          password: '',
          confirmPassword: '',
        });
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSubmitting(true);
    setError('');

    try {
      if (!form.name || !form.email || !form.username) {
        throw new Error('Nama, email, dan username wajib diisi');
      }

      if (form.password || form.confirmPassword) {
        if (form.password !== form.confirmPassword) {
          throw new Error('Password dan konfirmasi password tidak cocok');
        }
      }

      const data: UserFormData = {
        name: form.name,
        email: form.email,
        username: form.username,
        role: form.role,
        isActive: form.isActive,
        ...(form.password ? { password: form.password } : {}),
        ...(form.confirmPassword ? { confirmPassword: form.confirmPassword } : {}),
      };

      const updated = await userService.update(id, data);

      if (updated && updated.id) {
        navigate(`/users/${updated.id}`);
      } else {
        navigate('/users');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan perubahan');
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
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded w-3/4"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Edit Pengguna</h1>
        <div className="flex space-x-2">
          <Link to={`/users/${id}`}>
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
            <h2 className="text-lg font-medium mb-4">Informasi Pengguna</h2>
            <div className="space-y-4">
              <Input label="Nama" name="name" value={form.name} onChange={handleChange} required />
              <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
              <Input label="Username" name="username" value={form.username} onChange={handleChange} required />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select name="role" value={form.role} onChange={handleChange} className="px-3 py-2 border rounded-md w-full">
                  <option value="admin">Admin</option>
                  <option value="cs">Customer Service</option>
                  <option value="noc">Teknisi</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Password (opsional)" type="password" name="password" value={form.password || ''} onChange={handleChange} placeholder="••••••••" />
                <Input label="Konfirmasi Password" type="password" name="confirmPassword" value={form.confirmPassword || ''} onChange={handleChange} placeholder="••••••••" />
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

export default UserEdit;