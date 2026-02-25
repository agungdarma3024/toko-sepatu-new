// lib/data.ts

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  // --- TAMBAHAN BARU UNTUK FILTER ---
  gender: 'Pria' | 'Wanita' | 'Unisex';
  sizes: number[];
  colors: string[];
};

export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'Wolak Runner Pro',
    category: 'running',
    price: 1299000,
    originalPrice: 1599000,
    description: 'Sepatu lari cushioning terbaik dengan teknologi foam terbaru yang responsif. Cocok untuk lari jarak jauh maupun latihan sehari-hari.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    rating: 4.8,
    reviewCount: 256,
    isNew: true,
    isBestSeller: true,
    // Data Baru
    gender: 'Unisex',
    sizes: [39, 40, 41, 42, 43],
    colors: ['Merah', 'Hitam']
  },
  {
    id: 'prod-002',
    name: 'Walik Street Classic',
    category: 'sneakers',
    price: 899000,
    description: 'Sneakers klasik dengan desain timeless berbahan kanvas premium dan sol karet vulcanized yang tahan lama.',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80',
    rating: 4.5,
    reviewCount: 180,
    isBestSeller: true,
    // Data Baru
    gender: 'Pria',
    sizes: [40, 41, 42, 43, 44],
    colors: ['Putih', 'Hitam']
  },
  {
    id: 'prod-003',
    name: 'Walik Casual Comfort',
    category: 'casual',
    price: 699000,
    originalPrice: 850000,
    description: 'Sepatu casual slip-on yang sangat nyaman dengan insole memory foam, cocok untuk pemakaian seharian di kantor atau jalan-jalan.',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80',
    rating: 4.2,
    reviewCount: 95,
    // Data Baru
    gender: 'Wanita',
    sizes: [37, 38, 39, 40],
    colors: ['Coklat', 'Putih']
  }
];

// Fungsi formatPrice tetap sama...
export const formatPrice = (price: number) => {
  // ... kodenya sama seperti sebelumnya ...
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};


// lib/data.ts (Tambahkan di paling bawah file)

// --- DATA BANNER SLIDER ---
export const heroBanners = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200&q=80", // Gambar sepatu lari di trek
      title: "Lari Lebih Jauh, Lebih Cepat",
      subtitle: "Koleksi Running terbaru dengan teknologi foam revolusioner.",
      link: "/kategori/running",
      buttonText: "Belanja Running",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=80", // Gambar sepatu boots/kulit
      title: "Gaya Klasik Tak Lekang Waktu",
      subtitle: "Sneakers dan sepatu formal untuk penampilan elegan Anda.",
      link: "/kategori/sneakers",
      buttonText: "Lihat Koleksi",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=1200&q=80", // Gambar sepatu casual
      title: "Kenyamanan Setiap Hari",
      subtitle: "Temukan sepatu casual yang pas untuk aktivitas harianmu.",
      link: "/kategori/casual",
      buttonText: "Cari Casual",
    },
  ];
  
  // --- DATA KATEGORI ---
  export const categories = [
    { name: "Sneakers", image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=300&q=80", link: "/kategori/sneakers" },
    { name: "Running", image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=300&q=80", link: "/kategori/running" },
    { name: "Casual", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&q=80", link: "/kategori/casual" },
  ];