import { HeroData, PhotoItem, MemoryItem } from '../types';

export const initialHeroData: HeroData = {
  title: 'Selamat Ulang Tahun, Seng! 💖',
  subtitle: 'Hari istimewa untuk jiwa yang paling memesona dan penerang duniaku.',
  recipientName: 'Afgea Cantik',
  age: 24,
  badgeText: 'Lopyouuu',
  loveMessage: 'Terima kasih telah hadir dan memberi warna terindah dalam hidupku. Senyummu adalah cahaya hariku, dan tawamu adalah melodi paling merdu. Semoga usiamu yang baru dipenuhi berkah, kesehatan, cinta, dan impian yang menjadi nyata.',
  senderName: 'Ersha >_<',
  dateStr: '23 Agustus',
};

export const initialPhotos: PhotoItem[] = [];

export const initialMemories: MemoryItem[] = [
  {
    id: 'mem-1',
    title: 'Pertama Kali Bertatap Mata di Toko Buku',
    date: '12 Januari 2023',
    category: 'Pertama Bertemu',
    emoji: '☕',
    description: 'Sore hujan itu, ketika kita tanpa sengaja mengambil buku yang sama. Tatapan matamu yang hangat membuat jantungku berdegup kencang untuk pertama kalinya.',
  },
  {
    id: 'mem-2',
    title: 'Malam Ketika Aku Meminta Kamu Jadi Teman Hidupku',
    date: '14 Februari 2023',
    category: 'Janji Cinta',
    emoji: '💍',
    description: 'Di bawah kerlip lampu kota dan langit berbintang, saat kamu mengangguk sambil tersenyum haru, itulah malam terindah dalam seluruh hidupku.',
  },
  {
    id: 'mem-3',
    title: 'Menatap Sunset Jingga di Tepi Pantai',
    date: '20 Juli 2023',
    category: 'Liburan Bersama',
    emoji: '🌅',
    description: 'Duduk berdua di pasir pantai mendengarkan deburan ombak, bergandengan tangan sambil menyadari bahwa rumah ternyamanku adalah bersamamu.',
  },
  {
    id: 'mem-4',
    title: 'Ulang Tahun Hari Ini & Selamanya',
    date: '23 Agustus 2024',
    category: 'Momen Manis',
    emoji: '🎂',
    description: 'Selamat bertambah usia, cintaku. Aku berjanji akan terus mendampingimu, merayakan setiap impianmu, dan mencintaimu lebih dalam di setiap detik yang kita lalui.',
  },
];
