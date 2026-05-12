import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  tr: {
    // Sidebar & Navbar
    dashboard: 'Panel',
    myCourses: 'Eğitimlerim',
    videoCourses: 'Video Kurslar',
    referrals: 'Referanslarım',
    rewards: 'Ödüllerim',
    history: 'Gelir Geçmişi',
    community: 'Topluluk',
    profile: 'Profil',
    settings: 'Ayarlar',
    logout: 'Çıkış Yap',
    searchPlaceholder: 'Eğitim, kurs veya mentor ara...',
    proMember: 'Pro Üye',
    
    // Dashboard
    welcome: 'Hoş geldin',
    walletBalance: 'Cüzdan Bakiyesi',
    totalEarned: 'Toplam Kazanç',
    activeReferrals: 'Aktif Referanslar',
    completedCourses: 'Tamamlanan Eğitimler',
    recentActivity: 'Son Aktiviteler',
    commission: 'Komisyon',
    earned: 'Kazandı',
    viewAll: 'Tümünü Gör',
    withdraw: 'Para Çek',
    
    // My Courses & Video Courses
    myCoursesDesc: 'Kayıtlı olduğunuz ve devam ettiğiniz eğitimler.',
    all: 'Tümü',
    inProgress: 'Devam Edenler',
    completed: 'Tamamlananlar',
    lessons: 'Bölüm',
    lastWatched: 'Son izleme',
    continue: 'Devam Et',
    browseCourses: 'Kurslara Göz At',
    startLearning: 'Öğrenmeye Başla',
    courseDetails: 'Kurs Detayları',
    instructor: 'Eğitmen',
    
    // Referrals
    referralTitle: 'Referans Sistemi',
    referralDesc: 'Arkadaşlarını davet et, birlikte kazanın.',
    copyLink: 'Linki Kopyala',
    linkCopied: 'Link Kopyalandı!',
    totalInvited: 'Toplam Davet',
    activeSubscribers: 'Aktif Aboneler',
    pendingRewards: 'Bekleyen Ödüller',
    referralList: 'Referans Listesi',
    status: 'Durum',
    date: 'Tarih',
    level1Network: 'Level 1 Ağ',
    level2Network: 'Level 2 Ağ',
    
    // Rewards & History
    rewardsTitle: 'Ödüllerim',
    rewardsDesc: 'Başarılarınızı takip edin ve ödülleri toplayın.',
    historyTitle: 'Gelir Geçmişi',
    transactionId: 'İşlem ID',
    typeSource: 'Tür / Kaynak',
    amount: 'Tutar',
    showMore: 'Daha Fazla Göster',
    noTransactions: 'Henüz bir işlem bulunmuyor.',
    
    // Community
    communityTitle: 'Topluluk',
    communityDesc: 'Diğer üyelerle etkileşime geçin ve bilgi paylaşın.',
    sharePost: 'Bir şeyler paylaş...',
    comments: 'Yorumlar',
    likes: 'Beğeniler',
    post: 'Paylaş',
    
    // Settings
    settingsTitle: 'Ayarlar',
    settingsDesc: 'Platform tercihlerinizi yönetin.',
    generalTab: 'Genel',
    appearanceTab: 'Görünüm',
    sessionsTab: 'Oturumlar',
    systemLanguage: 'Sistem Dili',
    themeSelection: 'Tema Seçimi',
    saveChanges: 'Değişiklikleri Kaydet',
    saving: 'Kaydediliyor...',
    saved: 'Ayarlar Kaydedildi',
    
    // Profile
    profileTitle: 'Profilim',
    personalInfo: 'Kişisel Bilgiler',
    fullName: 'Tam Ad',
    phone: 'Telefon',
    profession: 'Meslek',
    city: 'Şehir',
    about: 'Hakkımda',
    education: 'Eğitim Alanı',
    experience: 'Deneyim Seviyesi',
    experienceBeginner: 'Başlangıç',
    experienceIntermediate: 'Orta',
    experienceAdvanced: 'İleri',
    experienceExpert: 'Uzman',
    select: 'Seçiniz'
  },
  en: {
    // Sidebar & Navbar
    dashboard: 'Dashboard',
    myCourses: 'My Courses',
    videoCourses: 'Video Courses',
    referrals: 'Referrals',
    rewards: 'Rewards',
    history: 'History',
    community: 'Community',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    searchPlaceholder: 'Search for education, courses or mentors...',
    proMember: 'Pro Member',
    
    // Dashboard
    welcome: 'Welcome',
    walletBalance: 'Wallet Balance',
    totalEarned: 'Total Earned',
    activeReferrals: 'Active Referrals',
    completedCourses: 'Completed Courses',
    recentActivity: 'Recent Activity',
    commission: 'Commission',
    earned: 'Earned',
    viewAll: 'View All',
    withdraw: 'Withdraw',
    
    // My Courses & Video Courses
    myCoursesDesc: 'Courses you are enrolled in and continuing.',
    all: 'All',
    inProgress: 'In Progress',
    completed: 'Completed',
    lessons: 'Lessons',
    lastWatched: 'Last watched',
    continue: 'Continue',
    browseCourses: 'Browse Courses',
    startLearning: 'Start Learning',
    courseDetails: 'Course Details',
    instructor: 'Instructor',
    
    // Referrals
    referralTitle: 'Referral System',
    referralDesc: 'Invite your friends, earn together.',
    copyLink: 'Copy Link',
    linkCopied: 'Link Copied!',
    totalInvited: 'Total Invited',
    activeSubscribers: 'Active Subscribers',
    pendingRewards: 'Pending Rewards',
    referralList: 'Referral List',
    status: 'Status',
    date: 'Date',
    level1Network: 'Level 1 Network',
    level2Network: 'Level 2 Network',
    
    // Rewards & History
    rewardsTitle: 'My Rewards',
    rewardsDesc: 'Track your achievements and collect rewards.',
    historyTitle: 'Earnings History',
    transactionId: 'Transaction ID',
    typeSource: 'Type / Source',
    amount: 'Amount',
    showMore: 'Show More',
    noTransactions: 'No transactions found yet.',
    
    // Community
    communityTitle: 'Community',
    communityDesc: 'Interact with other members and share knowledge.',
    sharePost: 'Share something...',
    comments: 'Comments',
    likes: 'Likes',
    post: 'Post',
    
    // Settings
    settingsTitle: 'Settings',
    settingsDesc: 'Manage your platform preferences.',
    generalTab: 'General',
    appearanceTab: 'Appearance',
    sessionsTab: 'Sessions',
    systemLanguage: 'System Language',
    themeSelection: 'Theme Selection',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    saved: 'Settings Saved',
    
    // Profile
    profileTitle: 'My Profile',
    personalInfo: 'Personal Information',
    fullName: 'Full Name',
    phone: 'Phone',
    profession: 'Profession',
    city: 'City',
    about: 'About Me',
    education: 'Education Area',
    experience: 'Experience Level',
    experienceBeginner: 'Beginner',
    experienceIntermediate: 'Intermediate',
    experienceAdvanced: 'Advanced',
    experienceExpert: 'Expert',
    select: 'Select'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('app_lang') || 'tr');

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
