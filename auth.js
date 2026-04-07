// AUTH.JS - Kimlik Doğrulama Fonksiyonları
console.log('✓ auth.js yüklendi');

let regPhotoBase64 = null;

function previewRegisterPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            regPhotoBase64 = e.target.result;
            const preview = document.getElementById('regPhotoPreview');
            if (preview) preview.src = regPhotoBase64;
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Şifreyi hash'leyen simüle edilmiş fonksiyon.
 * Gerçek projelerde sunucu tarafında 'bcrypt' veya 'argon2' kullanılmalıdır.
 */
function hashPassword(password) {
    // Bu sadece bir örnektir, gerçek güvenlik sağlamaz.
    return btoa(password + "atc_salt"); 
}

function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

function login() {
    try {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPass').value;

        if (!email || !password) {
            alert('Lütfen email ve şifre giriniz!');
            return;
        }

        // Email format kontrolü
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Geçerli bir email adresi girin!');
            return;
        }

        // Kullanıcıyı bul
        const user = allUsers.find(u => u.email === email);
        
        // Şifre kontrolü (Girilen şifrenin hash'i ile kayıtlı hash karşılaştırılır)
        const isPasswordCorrect = user && user.password === hashPassword(password);

        if (isPasswordCorrect) {
            currentUser = user;
            
            // Beni hatırla seçeneğini kontrol et
            const rememberCheckbox = document.getElementById('rememberMe');
            isRemembered = rememberCheckbox ? rememberCheckbox.checked : false;

            saveData();
            document.getElementById('mainHeader').style.display = 'flex';
            
            // Form temizle
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPass').value = '';

            showPage('jobs');
            console.log('✓ Giriş başarılı:', email);
        } else {
            alert('Email veya şifre hatalı!');
            console.log('✗ Giriş başarısız:', email);
        }
    } catch (error) {
        console.error('Giriş hatası:', error);
        alert('Bir hata oluştu: ' + error.message);
    }
}

function loginAsGuest() {
    try {
        // Geçici bir misafir kullanıcı objesi oluştur
        currentUser = {
            id: 'guest_' + Date.now(),
            email: 'misafir@atc.com',
            role: 'guest',
            name: 'Misafir Kullanıcı',
            photo: null,
            cv: null,
            savedJobs: []
        };
        isRemembered = false; // Misafir oturumu tarayıcı kapatıldığında silinsin
        saveData();
        
        document.getElementById('mainHeader').style.display = 'flex';
        showPage('jobs');
        showToast('Misafir olarak giriş yapıldı', 'info');
    } catch (error) {
        console.error('Misafir girişi hatası:', error);
    }
}

function register() {
    try {
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPass').value;
        const role = document.getElementById('regRole').value;
        const gender = document.getElementById('regGender').value;

        // Zorunlu alanları kontrol et
        if (!email || !password || !role || !gender) {
            alert('Lütfen tüm zorunlu alanları doldurunuz!');
            return;
        }

        // Şifre uzunluğu kontrolü
        if (password.length < 4) {
            alert('Şifre en az 4 karakter olmalıdır!');
            return;
        }

        // Email format kontrolü
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Geçerli bir email adresi girin!');
            return;
        }

        // Email zaten kayıtlı mı kontrol et
        if (allUsers.find(u => u.email === email)) {
            alert('Bu email zaten kayıtlı! Lütfen başka bir email deneyin.');
            return;
        }

        // Yeni kullanıcı oluştur
        const newUser = {
            id: Date.now(),
            email: email,
            password: hashPassword(password), // Şifreyi hash'leyerek sakla
            role: role,
            salary: '0',
            gender: gender,
            photo: regPhotoBase64,
            cv: null,
            savedJobs: [],
            createdAt: new Date().toISOString()
        };

        allUsers.push(newUser);
        saveData();

        console.log('✓ Kayıt başarılı:', email);
        alert('✓ Başarıyla kayıt oldunuz!\n\nEmail: ' + email + '\nŞimdi giriş yapabilirsiniz.');

        // Formu tamamen temizle
        clearRegisterForm();
        showPage('login');

    } catch (error) {
        console.error('Kayıt hatası:', error);
        alert('Bir hata oluştu: ' + error.message);
    }
}

function clearRegisterForm() {
    document.getElementById('regEmail').value = '';
    document.getElementById('regPass').value = '';
    document.getElementById('regRole').value = 'jobseeker';
    document.getElementById('regGender').value = 'Erkek';
    regPhotoBase64 = null;
    const photoInput = document.getElementById('regPhoto');
    if (photoInput) photoInput.value = '';
    const preview = document.getElementById('regPhotoPreview');
    if (preview) preview.src = 'https://via.placeholder.com/80';
}

function clearLoginForm() {
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPass').value = '';
}
