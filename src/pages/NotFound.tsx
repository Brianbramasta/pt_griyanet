import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold mt-4 mb-6">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-600 mb-8">
          Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
        </p>
        <Link to="/">
          <Button variant="primary">
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;