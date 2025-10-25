# Griyanet - Aplikasi Manajemen Tiket dan Pelanggan

Aplikasi web untuk manajemen tiket dan pelanggan untuk penyedia layanan internet.

## Fitur

- Manajemen pelanggan
- Manajemen tiket
- Autentikasi pengguna
- Dashboard analitik
- Pencarian dan filter

## Teknologi

- React
- TypeScript
- Tailwind CSS
- React Router
- JSON Server (untuk API)

## Instalasi

```bash
# Menginstal dependensi
npm install

# Menjalankan aplikasi dalam mode development
npm run dev

# Menjalankan JSON Server untuk API
npm run server

# Menjalankan aplikasi dan server secara bersamaan
npm run dev:all
```

## User login

Admin:

- username: admin@griyanet.com
- password: admin123
  noc:
- username: noc@griyanet.com
- password: noc123
  customer:
- username: customer@griyanet.com
- password: customer123

## API Endpoints

### Customers

- `GET /customers` - Mendapatkan semua pelanggan
- `GET /customers/:id` - Mendapatkan pelanggan berdasarkan ID
- `POST /customers` - Membuat pelanggan baru
- `PUT /customers/:id` - Memperbarui pelanggan
- `DELETE /customers/:id` - Menghapus pelanggan

### Tickets

- `GET /tickets` - Mendapatkan semua tiket
- `GET /tickets/:id` - Mendapatkan tiket berdasarkan ID
- `POST /tickets` - Membuat tiket baru
- `PUT /tickets/:id` - Memperbarui tiket
- `DELETE /tickets/:id` - Menghapus tiket

### Users

- `GET /users` - Mendapatkan semua pengguna
- `GET /users/:id` - Mendapatkan pengguna berdasarkan ID
- `POST /users` - Membuat pengguna baru
- `PUT /users/:id` - Memperbarui pengguna
- `DELETE /users/:id` - Menghapus pengguna

## Struktur Proyek

```
├── public/             # File statis
├── src/                # Kode sumber
│   ├── components/     # Komponen React
│   ├── context/        # Context API
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Halaman aplikasi
│   ├── services/       # Service API
│   ├── styles/         # File CSS
│   ├── types/          # TypeScript types
│   ├── utils/          # Fungsi utilitas
│   ├── App.tsx         # Komponen utama
│   └── main.tsx        # Entry point
├── db.json             # Database JSON Server
├── server.js           # Konfigurasi JSON Server
└── package.json        # Dependensi dan scripts
```

## Pengembangan

### Menjalankan Json Server

```bash
npm run server:json

```

### Menjalankan Test

```bash
# Menjalankan test
npm test

# Menjalankan test dalam mode watch
npm run test:watch

# Menjalankan test dengan coverage
npm run test:coverage
```

### Build untuk Production

```bash
npm run build
```
