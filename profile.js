// PROFILE.JS - Profil Sayfası Mantığı
console.log('✓ profile.js yüklendi');

function displayProfile() {
    if (!currentUser) return;

    // Metin bilgilerini güncelle
    document.getElementById('profileEmail').textContent = currentUser.email;
    
    let roleText = 'İş Arayan';
    if (currentUser.role === 'employer') {
        roleText = 'İşveren';
    } else if (currentUser.role === 'guest') {
        roleText = 'Misafir';
    }
    
    document.getElementById('profileRole').textContent = roleText;

    // Profil fotoğrafını kontrol et ve göster
    const profileImg = document.getElementById('profileImage');
    const defaultIcon = document.getElementById('profileDefaultIcon');

    if (currentUser.photo) {
        profileImg.src = currentUser.photo;
        profileImg.style.display = 'block';
        defaultIcon.style.display = 'none';
    } else {
        profileImg.style.display = 'none';
        defaultIcon.style.display = 'block';
    }

    // CV Durumu Güncelleme
    const cvText = document.getElementById('cvName');
    if (currentUser.cv) {
        cvText.textContent = currentUser.cv.name;
        cvText.style.color = 'var(--accent)';
    } else {
        cvText.textContent = 'CV Yüklenmemiş';
        cvText.style.color = 'var(--gray)';
    }

    // İşveren Paneli Görünürlüğü
    const employerPanel = document.getElementById('employerPanel');
    if (employerPanel) {
        employerPanel.style.display = currentUser.role === 'employer' ? 'block' : 'none';
    }
}

function uploadCV(event) {
    // CV yükleme mantığı buraya eklenebilir
}
