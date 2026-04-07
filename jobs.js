// AUTH.JS - Kimlik Doğrulama Fonksiyonları
console.log('✓ auth.js yüklendi');

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

        // Kullanıcıyı ara
        const user = allUsers.find(u => u.email === email && u.password === password);

        if (user) {
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
            password: password,
            role: role,
            salary: '0',
            gender: gender,
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
}

function clearLoginForm() {
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPass').value = '';
}
