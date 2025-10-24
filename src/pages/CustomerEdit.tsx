import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button, Input } from '../components';
import { customerService } from '../services/customerService';
import type { Customer, CustomerFormData } from '../types/customer';

const CustomerEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    registrationDate: '',
    status: 'active',
    serviceType: 'Fiber Optic',
    serviceDetails: {
      packageName: '',
      bandwidth: '',
      monthlyFee: 0,
      installationDate: '',
    },
    notes: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) return;
      setIsLoading(true);
      setError('');
      try {
        const data: Customer = await customerService.getById(id);
        setForm({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          registrationDate: data.registrationDate,
          status: data.status,
          serviceType: data.serviceType,
          serviceDetails: data.serviceDetails,
          notes: data.notes,
        });
      } catch (err) {
        console.error('Error fetching customer:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('serviceDetails.')) {
      const key = name.split('.')[1] as keyof NonNullable<CustomerFormData['serviceDetails']>;
      setForm(prev => ({
        ...prev,
        serviceDetails: {
          packageName: prev.serviceDetails?.packageName ?? "",
          bandwidth: prev.serviceDetails?.bandwidth ?? "",
          monthlyFee: prev.serviceDetails?.monthlyFee ?? 0,
          installationDate: prev.serviceDetails?.installationDate ?? "",
          [key]: key === 'monthlyFee' ? Number(value) : value ,
        },
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSubmitting(true);
    setError('');

    try {
      // Basic validation
      if (!form.name || !form.email || !form.phone) {
        throw new Error('Nama, email, dan telepon wajib diisi');
      }

      const data: CustomerFormData = {
        ...form,
        status: form.status as CustomerFormData['status'],
        serviceDetails: form.serviceDetails && {
          packageName: form.serviceDetails.packageName || '',
          bandwidth: form.serviceDetails.bandwidth || '',
          monthlyFee: Number(form.serviceDetails.monthlyFee) || 0,
          installationDate: form.serviceDetails.installationDate || '',
        },
      };

      const updated = await customerService.update(id, data);

      if (updated && updated.id) {
        navigate(`/customers/${updated.id}`);
      } else {
        navigate('/customers');
      }
    } catch (err) {
      console.error('Error updating customer:', err);
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
        <h1 className="text-2xl font-semibold">Edit Customer</h1>
        <div className="flex space-x-2">
          <Link to={`/customers/${id}`}>
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
            <h2 className="text-lg font-medium mb-4">Informasi Customer</h2>
            <div className="space-y-4">
              <Input label="Nama" name="name" value={form.name} onChange={handleChange} required />
              <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
              <Input label="Telepon" name="phone" value={form.phone} onChange={handleChange} required />
              <Input label="Alamat" name="address" value={form.address} onChange={handleChange} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Kota" name="city" value={form.city} onChange={handleChange} />
                <Input label="Kode Pos" name="postalCode" value={form.postalCode} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className="px-3 py-2 border rounded-md w-full">
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Jenis Layanan</label>
                  <select name="serviceType" value={form.serviceType} onChange={handleChange} className="px-3 py-2 border rounded-md w-full">
                    <option value="Fiber Optic">Fiber Optic</option>
                    <option value="Wireless">Wireless</option>
                    <option value="DSL">DSL</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Catatan</label>
                <textarea name="notes" value={form.notes || ''} onChange={handleChange} className="px-3 py-2 border rounded-md w-full" rows={3} />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">Detail Layanan</h2>
            <div className="space-y-4">
              <Input label="Nama Paket" name="serviceDetails.packageName" value={form.serviceDetails?.packageName || ''} onChange={handleChange} />
              <Input label="Bandwidth" name="serviceDetails.bandwidth" value={form.serviceDetails?.bandwidth || ''} onChange={handleChange} />
              <Input label="Biaya Bulanan" type="number" name="serviceDetails.monthlyFee" value={String(form.serviceDetails?.monthlyFee ?? '')} onChange={handleChange} />
              <Input label="Tanggal Instalasi" type="date" name="serviceDetails.installationDate" value={form.serviceDetails?.installationDate || ''} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end">
          <Button type="submit" variant="primary" isLoading={isSubmitting}>Simpan Perubahan</Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerEdit;