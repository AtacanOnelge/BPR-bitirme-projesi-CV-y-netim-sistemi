// APP.JS - Ana Uygulama Mantığı
console.log('✓ app.js yüklendi');

let currentUser = null;
let allUsers = [];
let allJobs = [];
let allApplications = [];
let isRemembered = false; // Oturumun kalıcı olup olmadığını takip eder

// LocalStorage'dan veri yükle
function loadData() {
    try {
        const usersData = localStorage.getItem('atc_users');
        const jobsData = localStorage.getItem('atc_jobs');
        const appsData = localStorage.getItem('atc_applications');
        
        // Önce SessionStorage (geçici), yoksa LocalStorage (kalıcı) kontrol et
        let userLogged = sessionStorage.getItem('atc_current');
        if (userLogged) {
            isRemembered = false;
        } else {
            userLogged = localStorage.getItem('atc_current');
            if (userLogged) isRemembered = true;
        }

        allUsers = usersData ? JSON.parse(usersData) : [];
        allJobs = jobsData ? JSON.parse(jobsData) : [];
        allApplications = appsData ? JSON.parse(appsData) : [];
        currentUser = userLogged ? JSON.parse(userLogged) : null;

        console.log('✓ Veriler yüklendi - Kullanıcılar:', allUsers.length, 'İlanlar:', allJobs.length);
    } catch (error) {
        console.error('Veri yükleme hatası:', error);
        allUsers = [];
        allJobs = [];
        allApplications = [];
        currentUser = null;
    }
}

// LocalStorage'da veri kaydet
function saveData() {
    try {
        localStorage.setItem('atc_users', JSON.stringify(allUsers));
        localStorage.setItem('atc_jobs', JSON.stringify(allJobs));
        localStorage.setItem('atc_applications', JSON.stringify(allApplications));
        
        if (currentUser) {
            if (isRemembered) {
                localStorage.setItem('atc_current', JSON.stringify(currentUser));
                sessionStorage.removeItem('atc_current'); // Çakışmayı önle
            } else {
                sessionStorage.setItem('atc_current', JSON.stringify(currentUser));
                localStorage.removeItem('atc_current'); // Çakışmayı önle
            }
        } else {
            localStorage.removeItem('atc_current');
            sessionStorage.removeItem('atc_current');
        }
        console.log('✓ Veriler kaydedildi');
    } catch (error) {
        console.error('Veri kaydetme hatası:', error);
        alert('Veriler kaydedilirken hata oluştu!');
    }
}

// Sayfa Geçişi
function showPage(pageName) {
    try {
        // Tüm sayfaları gizle
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));

        // Seçilen sayfayı göster
        const page = document.getElementById(pageName);
        if (page) {
            page.classList.add('active');
            console.log('✓ Sayfa gösteriliyor:', pageName);
        } else {
            console.error('✗ Sayfa bulunamadı:', pageName);
            return;
        }

        // Sayfa yüklendiğinde çalışacak fonksiyonlar
        if (pageName === 'jobs') {
            displayJobs();
        } else if (pageName === 'profile') {
            if (!currentUser) {
                alert('Profili görüntülemek için giriş yapmalısınız!');
                showPage('login');
                return;
            }
            displayProfile();
        }
    } catch (error) {
        console.error('Sayfa geçişi hatası:', error);
    }
}

// Çıkış Yap
function logout() {
    try {
        currentUser = null;
        localStorage.removeItem('atc_current');
        sessionStorage.removeItem('atc_current');
        document.getElementById('mainHeader').style.display = 'none';
        alert('Başarıyla çıkış yapıldı');
        showPage('home');
        console.log('✓ Çıkış yapıldı');
    } catch (error) {
        console.error('Çıkış hatası:', error);
    }
}

// UI Oluşturucu (Modal ve Toast HTML'lerini enjekte eder)
function setupUI() {
    // Toast Container
    if (!document.querySelector('.toast-container')) {
        const tc = document.createElement('div');
        tc.className = 'toast-container';
        document.body.appendChild(tc);
    }
    // Modal Container
    if (!document.querySelector('.modal-overlay')) {
        const mo = document.createElement('div');
        mo.className = 'modal-overlay';
        mo.id = 'mainModal';
        mo.innerHTML = `
            <div class="modal-content">
                <span class="modal-close" onclick="closeModal()">&times;</span>
                <div id="modalBody"></div>
            </div>
        `;
        document.body.appendChild(mo);
        
        // Dışarı tıklayınca kapat
        mo.addEventListener('click', (e) => {
            if (e.target === mo) closeModal();
        });
    }
}

// Toast Bildirimi Göster
function showToast(message, type = 'success') {
    const container = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Modal İşlemleri
function openModal(contentHtml) {
    const modal = document.getElementById('mainModal');
    document.getElementById('modalBody').innerHTML = contentHtml;
    modal.classList.add('modal-active');
}

function closeModal() {
    document.getElementById('mainModal').classList.remove('modal-active');
}

// Tema Değiştirme Fonksiyonu
function toggleTheme() {
    const body = document.body;
    const icon = document.querySelector('#themeToggle i');
    
    body.classList.toggle('light-mode');
    
    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
        if(icon) icon.className = 'fa-solid fa-moon'; // Açık moddaysa Ay ikonu göster
    } else {
        localStorage.setItem('theme', 'dark');
        if(icon) icon.className = 'fa-solid fa-sun'; // Koyu moddaysa Güneş ikonu göster
    }
}

// Mobil Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.getElementById('mainHeader');
    sidebar.classList.toggle('mobile-active');
}

// Sayfa yüklendiğinde çalış
window.addEventListener('load', () => {
    console.log('✓ Sayfa yükleniyor...');
    setupUI();
    loadData();
    
    // Eğer kullanıcı giriş yapmışsa header'ı göster
    if (currentUser) {
        document.getElementById('mainHeader').style.display = 'flex';
        showPage('jobs');
        console.log('✓ Giriş yapan kullanıcı tespit edildi:', currentUser.email);
    } else {
        document.getElementById('mainHeader').style.display = 'none';
        showPage('home');
    }
});

// Hata yakalamak için global handler
window.addEventListener('error', (event) => {
    console.error('Global hata:', event.error);
});
