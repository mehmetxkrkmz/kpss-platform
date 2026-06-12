import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const mockCourses = [
  { id: "turkce", title: "Türkçe", description: "Sözcükte Anlam, Paragraf, Dil Bilgisi ve Sözel Mantık. Toplam 30 Soru.", iconUrl: "https://cdn-icons-png.flaticon.com/512/3253/3253245.png" },
  { id: "matematik", title: "Matematik & Geometri", description: "Problemler, Sayısal Mantık, Temel Kavramlar ve Geometri. Toplam 30 Soru.", iconUrl: "https://cdn-icons-png.flaticon.com/512/4341/4341144.png" },
  { id: "tarih", title: "Tarih", description: "Osmanlı Devleti, İnkılap Tarihi ve Çağdaş Türk Tarihi. Toplam 27 Soru.", iconUrl: "https://cdn-icons-png.flaticon.com/512/3253/3253114.png" },
  { id: "cografya", title: "Coğrafya", description: "Türkiye'nin Fiziki, Beşeri ve Ekonomik Coğrafyası. Toplam 18 Soru.", iconUrl: "https://cdn-icons-png.flaticon.com/512/933/933936.png" },
  { id: "vatandaslik", title: "Vatandaşlık", description: "Hukuk Kavramları, Yasama-Yürütme-Yargı ve İdare Hukuku. Toplam 9 Soru.", iconUrl: "https://cdn-icons-png.flaticon.com/512/1006/1006555.png" },
  { id: "guncel", title: "Güncel Bilgiler", description: "Türkiye ve Dünya'daki güncel gelişmeler, kurumlar ve olaylar. Toplam 6 Soru.", iconUrl: "https://cdn-icons-png.flaticon.com/512/2965/2965311.png" }
];

const mockTopics = [
  // Türkçe
  { id: "turk-1", courseId: "turkce", title: "Sözcükte Anlam", questionCount: "2 Soru", order: 1 },
  { id: "turk-2", courseId: "turkce", title: "Cümlede Anlam", questionCount: "2 Soru", order: 2 },
  { id: "turk-3", courseId: "turkce", title: "Paragraf", questionCount: "15 Soru", order: 3 },
  { id: "turk-4", courseId: "turkce", title: "Dil Bilgisi", questionCount: "2 Soru", order: 4 },
  { id: "turk-5", courseId: "turkce", title: "Ses Bilgisi", questionCount: "1 Soru", order: 5 },
  { id: "turk-6", courseId: "turkce", title: "Anlatım Bozuklukları", questionCount: "1 Soru", order: 6 },
  { id: "turk-7", courseId: "turkce", title: "Yazım Yanlışları", questionCount: "1 Soru", order: 7 },
  { id: "turk-8", courseId: "turkce", title: "Noktalama İşaretleri", questionCount: "1 Soru", order: 8 },
  { id: "turk-9", courseId: "turkce", title: "Sözel Mantık Soruları", questionCount: "4 Soru", order: 9 },

  // Matematik
  { id: "mat-1", courseId: "matematik", title: "Temel Kavramlar", questionCount: "2 Soru", order: 1 },
  { id: "mat-2", courseId: "matematik", title: "Rasyonel Sayılar", questionCount: "2 Soru", order: 2 },
  { id: "mat-3", courseId: "matematik", title: "Köklü Sayılar", questionCount: "1 Soru", order: 3 },
  { id: "mat-4", courseId: "matematik", title: "Üslü Sayılar", questionCount: "1 Soru", order: 4 },
  { id: "mat-5", courseId: "matematik", title: "Matematiksel İlişkilerden Yararlanma", questionCount: "6 Soru", order: 5 },
  { id: "mat-6", courseId: "matematik", title: "Problemler", questionCount: "8 Soru", order: 6 },
  { id: "mat-7", courseId: "matematik", title: "Tablo, Grafik Okuma ve Yorumlama", questionCount: "3 Soru", order: 7 },
  { id: "mat-8", courseId: "matematik", title: "Sayısal Mantık Soruları", questionCount: "4 Soru", order: 8 },
  { id: "mat-9", courseId: "matematik", title: "Temel Geometri", questionCount: "3 Soru", order: 9 },

  // Tarih
  { id: "tar-1", courseId: "tarih", title: "İlk Türk Devletleri", questionCount: "1 Soru", order: 1 },
  { id: "tar-2", courseId: "tarih", title: "Türk-İslam Devletleri", questionCount: "2 Soru", order: 2 },
  { id: "tar-3", courseId: "tarih", title: "Osmanlı Devleti", questionCount: "9 Soru", order: 3 },
  { id: "tar-4", courseId: "tarih", title: "Kurtuluş Savaşı", questionCount: "3 Soru", order: 4 },
  { id: "tar-5", courseId: "tarih", title: "Atatürk İlke ve İnkılapları", questionCount: "9 Soru", order: 5 },
  { id: "tar-6", courseId: "tarih", title: "Çağdaş Türk ve Dünya Tarihi", questionCount: "3 Soru", order: 6 },

  // Coğrafya
  { id: "cog-1", courseId: "cografya", title: "Türkiye’nin Coğrafi Konumu", questionCount: "1 Soru", order: 1 },
  { id: "cog-2", courseId: "cografya", title: "Türkiye’nin İklimi ve Bitki Örtüsü", questionCount: "2 Soru", order: 2 },
  { id: "cog-3", courseId: "cografya", title: "Türkiye’nin Fiziki Özellikleri", questionCount: "4 Soru", order: 3 },
  { id: "cog-4", courseId: "cografya", title: "Türkiye’nin Beşeri Özellikleri", questionCount: "3 Soru", order: 4 },
  { id: "cog-5", courseId: "cografya", title: "Türkiye’nin Ekonomik Özellikleri", questionCount: "8 Soru", order: 5 },

  // Vatandaşlık
  { id: "vat-1", courseId: "vatandaslik", title: "Temel Hukuk Kavramları", questionCount: "3 Soru", order: 1 },
  { id: "vat-2", courseId: "vatandaslik", title: "Yasama, Yürütme, Yargı", questionCount: "4 Soru", order: 2 },
  { id: "vat-3", courseId: "vatandaslik", title: "İdare Hukuku", questionCount: "2 Soru", order: 3 },

  // Güncel Bilgiler
  { id: "gun-1", courseId: "guncel", title: "Güncel Olaylar ve Gelişmeler", questionCount: "6 Soru", order: 1 }
];

const mockPlaylists = [
  // Coğrafya Oynatma Listeleri
  { id: "pl-cog-1", courseId: "cografya", instructorName: "Coğrafya Detaylı Konu Anlatımı", youtubeLink: "https://www.youtube.com/watch?v=HUWNPYuCK4g&list=PLPlLdubQ1fMs-O0_vwxL7bH-S7Bi4jKsu", thumbnailUrl: "https://img.youtube.com/vi/HUWNPYuCK4g/hqdefault.jpg", isRecommended: true },
  { id: "pl-cog-2", courseId: "cografya", instructorName: "Coğrafya Soru Çözüm Kampı", youtubeLink: "https://www.youtube.com/watch?v=68Sca3h_JHU&list=PLMqhgmOZb4CoVXFjEzw1H4IxVEhxyq3Fm", thumbnailUrl: "https://img.youtube.com/vi/68Sca3h_JHU/hqdefault.jpg", isRecommended: false },
  
  // Matematik Oynatma Listeleri
  { id: "pl-mat-1", courseId: "matematik", instructorName: "Matematik Sıfırdan Zirveye", youtubeLink: "https://www.youtube.com/watch?v=EiPc1aU53gs&list=PL8xiaE-wCWlYAj1jWjyNJzKBGLVZjwPOm", thumbnailUrl: "https://img.youtube.com/vi/EiPc1aU53gs/hqdefault.jpg", isRecommended: true },
  { id: "pl-mat-2", courseId: "matematik", instructorName: "Matematik Pratik Çözümler", youtubeLink: "https://www.youtube.com/watch?v=sB_eWyrniBc&list=PLPhEmM6X--Werv9vy7exYuPAQRgO0X4yt", thumbnailUrl: "https://img.youtube.com/vi/sB_eWyrniBc/hqdefault.jpg", isRecommended: false },

  // Tarih Oynatma Listeleri
  { id: "pl-tar-1", courseId: "tarih", instructorName: "KPSS Tarih Konu Anlatımı Serisi", youtubeLink: "https://www.youtube.com/watch?v=l51qG1kx9cY&list=PL5kIOunpmSBM_vApgXxIQZx5PnegGbWFF", thumbnailUrl: "https://img.youtube.com/vi/l51qG1kx9cY/hqdefault.jpg", isRecommended: true },
  { id: "pl-tar-2", courseId: "tarih", instructorName: "Tarih Genel Tekrar ve Analiz", youtubeLink: "https://www.youtube.com/watch?v=rCF1jlILJhY&list=PL5w_hbb3voMmmxQhHqC_bmvVtzlDpXfA1", thumbnailUrl: "https://img.youtube.com/vi/rCF1jlILJhY/hqdefault.jpg", isRecommended: true },
  { id: "pl-tar-3", courseId: "tarih", instructorName: "Tarih Soru Bankası Çözümleri", youtubeLink: "https://www.youtube.com/watch?v=7zpTO5v_aJ0&list=PL8xiaE-wCWlasUydAJNlOorH26JeqHHDm", thumbnailUrl: "https://img.youtube.com/vi/7zpTO5v_aJ0/hqdefault.jpg", isRecommended: false },

  // Türkçe Oynatma Listeleri
  { id: "pl-turk-1", courseId: "turkce", instructorName: "Türkçe Konu Anlatımı", youtubeLink: "https://www.youtube.com/watch?v=R7tSJhmK6NA&list=PL5kIOunpmSBMBPYmrPkd0JikOPIfQW-Sn", thumbnailUrl: "https://img.youtube.com/vi/R7tSJhmK6NA/hqdefault.jpg", isRecommended: true },
  { id: "pl-turk-2", courseId: "turkce", instructorName: "Türkçe Soru Çözüm ve Tekrar", youtubeLink: "https://www.youtube.com/watch?v=52SNuDuWvW8&list=PLGyBp_lgs0Lhc30J06k0BRldmOe5-Wdn1", thumbnailUrl: "https://img.youtube.com/vi/52SNuDuWvW8/hqdefault.jpg", isRecommended: false },

  // Vatandaşlık Oynatma Listeleri
  { id: "pl-vat-1", courseId: "vatandaslik", instructorName: "Vatandaşlık Konu Anlatımı", youtubeLink: "https://www.youtube.com/watch?v=tWrzSWzY6BI&list=PL5kIOunpmSBO2LLEQwCB9pJFT87wJsVSE", thumbnailUrl: "https://img.youtube.com/vi/tWrzSWzY6BI/hqdefault.jpg", isRecommended: true }
];

export const seedDatabase = async () => {
  try {
    // Yanlış eklenen eski tarih playlistini temizleme (varsa)
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, "playlists", "pl-tar-4"));
    } catch (e) {
      console.log("Eski kayıt silinirken atlandı.");
    }
    for (const course of mockCourses) {
      await setDoc(doc(collection(db, "courses"), course.id), course);
    }
    for (const topic of mockTopics) {
      await setDoc(doc(collection(db, "topics"), topic.id), topic);
    }
    for (const playlist of mockPlaylists) {
      await setDoc(doc(collection(db, "playlists"), playlist.id), playlist);
    }
    console.log("KPSS Ortaöğretim müfredat verileri başarıyla Firestore'a eklendi!");
  } catch (error) {
    console.error("Veri eklenirken hata:", error);
  }
};
