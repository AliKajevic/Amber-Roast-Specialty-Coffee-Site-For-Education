/**
 * Amber & Roast — Ana JavaScript
 * Yonetir: navbar kaydirma, hamburger menu, arama cubugu,
 *          scroll-reveal animasyonlari, sayac animasyonu,
 *          menu kategori filtresi, iletisim formu kontrolu
 */

/* =========================================================
  1. NAVBAR — Kaydirma + Hamburger + Arama
  ========================================================= */
//HTML sayfası yuklendiginde calisir.
document.addEventListener('DOMContentLoaded', () => { // DOM tamamen yuklendiginde bu kodlari calistirir.

  // Gerekli HTML elemanlarini sec
  const navbar = document.getElementById('navbar');  // Ust menu elemanini alir.
  const hamburger = document.getElementById('hamburger'); // Hamburger ikonunu alir.
  const navLinks = document.getElementById('navLinks');  // Menu linklerini alir.
  const searchToggle = document.getElementById('searchToggle');  // Arama ikonunu alir.
  const searchInput = document.getElementById('searchInput');   // Arama inputunu alir.

  // ── Yapiskan navbar: kaydirinca koyu arka plan ──
  if (navbar) { // Navbar varsa islemleri yapar.
    const isHomePage = window.location.pathname.endsWith('index.html') // Ana sayfa kontrolunu yapar.
      || window.location.pathname === '/' // Kok yolda ana sayfa kabul eder.
      || window.location.pathname === ''; // Bos yol icin ana sayfa kabul eder.
    if (!isHomePage) navbar.classList.add('always-dark');  // Ana sayfa degilse koyu stili uygular.

    // Sayfa kaydirilinca calisir
    window.addEventListener('scroll', () => { // Kaydirma olayini dinler.
      if (window.scrollY > 60) { // Kaydirma esigi kontrolu yapar.
        navbar.classList.add('scrolled');    // Koyu arka plan sinifini ekler.
      } else { // Esik altinda kalindiginda calisir.
        navbar.classList.remove('scrolled'); // Koyu arka plan sinifini kaldirir.
      }
    }, { passive: true }); // Performans icin pasif dinleme kullanir.
  }

  // ── Hamburger menu toggle (sadece mobil) ─────────────────────
  if (hamburger && navLinks) { // Hamburger ve menu varsa calisir.

    // Hamburger tiklaninca menuyu ac/kapat
    hamburger.addEventListener('click', () => { // Tiklama olayini dinler.
      const isOpen = navLinks.classList.toggle('open'); // Menu acik/kapali sinifini degistirir.
      hamburger.classList.toggle('open', isOpen);     // Ikon animasyon sinifini ayarlar.
      hamburger.setAttribute('aria-expanded', String(isOpen));  // Erisilebilirlik durumunu yazar.
      document.body.style.overflow = isOpen ? 'hidden' : '';  // Mobil menu acikken arka planda sayfanin kaymasini engeller.
    });

    // Menü linkine tiklaninca menu kapanir
    navLinks.querySelectorAll('.nav-link').forEach(link => {  // Tum nav linklerini secer.
      link.addEventListener('click', () => {   // Linke tiklaninca calisir.
        navLinks.classList.remove('open');     // Menu acik sinifini kaldirir.
        hamburger.classList.remove('open');    // Ikon sinifini kaldirir.
        hamburger.setAttribute('aria-expanded', 'false');   // Erisilebilirlik durumunu gunceller.
        document.body.style.overflow = '';  // Sayfa kaydirmayi geri acar.
      });
    });

    // Navbar disina tiklanirsa menuyu kapat 
    document.addEventListener('click', (e) => {   // Tum sayfada tiklama dinler.
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) { // Dis tiklama ve acik menu kontrolu yapar.
        navLinks.classList.remove('open');    // Menu acik sinifini kaldirir.
        hamburger.classList.remove('open');   // Ikon sinifini kaldirir.
        hamburger.setAttribute('aria-expanded', 'false');   // Erisilebilirlik durumunu gunceller.
        document.body.style.overflow = '';    // Sayfa kaydirmayi geri acar.
      }
    });
  }

  // ── Arama cubugu: ikonla ac/kapat ───────────────────────────
  if (searchToggle && searchInput) {                        // Elemanlar varsa calisir.
    searchToggle.addEventListener('click', () => {          // Ikona tiklaninca calisir.
      const isOpen = searchInput.classList.toggle('open');  // Open sinifini degistirir.
      if (isOpen) {                                         // Acik durum kontrolu yapar.
        searchInput.focus();                                // Inputa odak verir.
      } else {                                              // Kapali durumda calisir.
        searchInput.value = '';                          // Arama metnini temizler.
      }
    });

    // Escape tusu ile aramayi kapat
    searchInput.addEventListener('keydown', (e) => {    // Tus basimini dinler.
      if (e.key === 'Escape') {                      // Escape tusunu kontrol eder.
        searchInput.classList.remove('open');     // Open sinifini kaldirir.
        searchInput.value = '';                // Inputu temizler.
        searchToggle.focus();   // Odak tekrar ikona gider.
      }
    });
  }

  /* =========================================================
    2. SCROLL REVEAL ANIMASYONU (Intersection Observer)
    ========================================================= */

  // animasyon uygulanacak elemanlari sec
  const revealEls = document.querySelectorAll('.reveal'); // Reveal sinifli elemanlari secer.

  if (revealEls.length > 0) {        // Eleman var mi kontrol eder.
    const revealObserver = new IntersectionObserver((entries) => {  // Gozlemci olusturur.
      entries.forEach((entry, idx) => {    // Gozlemlenen her eleman icin calisir.
        if (entry.isIntersecting) {        // Ekranda gorunurluk kontrolu yapar.
          const delay = idx * 80;    // Elemanlarin sirayla animasyonlu gorunmesi icin gecikme hesaplar.
          setTimeout(() => {      // Gecikmeli calistirir.
            entry.target.classList.add('visible'); // Gorunur sinifini ekler.
          }, delay); // Gecikmeyi uygular.
          revealObserver.unobserve(entry.target); // Tek seferlik calismayi saglar.
        }
      });
    }, { // Gozlemci ayarlarini tanimlar.
      threshold: 0.12,           // Gorunurluk esigini belirler.
      rootMargin: '0px 0px -40px 0px' // Gozlem marjini ayarlar.
    });

    // Her .reveal elemanina gozlemci ekle
    revealEls.forEach(el => revealObserver.observe(el)); // Tum elemanlari izler.
  }

  /* =========================================================
    3. SAYAC ANIMASYONU (Istatistikler)
    ========================================================= */

  // Istatistik bolumundeki sayaclar
  const counters = document.querySelectorAll('.stat-number'); // Sayac elemanlarini secer.

  if (counters.length > 0) {  // Sayac var mi kontrol eder.
    // Eleman ekranda gorunur olunca sayac animasyonunu tetikler
    const counterObserver = new IntersectionObserver((entries) => {  // Sayac gozlemcisi olusturur.
      entries.forEach(entry => {       // Her giris icin dongu kurar.
        if (entry.isIntersecting) {     // Gorunurluk kontrolu yapar.
          animateCounter(entry.target);   // Sayac animasyonunu cagirir.
          counterObserver.unobserve(entry.target);    // Tek seferlik calismayi saglar.
        }
      });
    }, { threshold: 0.5 }); // Gorunurluk esigini belirler.

    counters.forEach(counter => counterObserver.observe(counter));  // Tum sayaclari izler.
  }


  /**
   * Sayiyi 0'dan data-target degerine kadar animasyonla arttirir.
   * @param {HTMLElement} el - Sayac elemani
   */

  function animateCounter(el) {  // Sayaci animasyonlu artirir.
    const target = parseInt(el.dataset.target, 10); // Hedef sayiyi alir.
    const duration = 1800; // Animasyon suresini belirler.
    const start = performance.now(); // Baslangic zamanini alir.

    function update(now) { // Her karede calisan guncelleme fonksiyonudur.
      const elapsed = now - start; // Gecen sureyi hesaplar.
      const progress = Math.min(elapsed / duration, 1); // Ilerlemeyi sinirlar.
      const eased = 1 - Math.pow(1 - progress, 3);   // Yumusak gecis uygular.
      el.textContent = Math.floor(eased * target).toLocaleString();  // Sayiyi gunceller.
      if (progress < 1) requestAnimationFrame(update); // Animasyonu surdurur.
    }

    requestAnimationFrame(update); // Animasyonu tetikler.
  }

  /* =========================================================
    4. MENU KATEGORI FILTRESI (Sadece menu sayfasi)
    ========================================================= */

  const filterBar = document.getElementById('filterBar'); // Filtre alanini secer.

  if (filterBar) { // Filtre alani varsa calisir.
    const filterBtns = filterBar.querySelectorAll('.filter-btn'); // Filtre butonlarini secer.
    const menuItems = document.querySelectorAll('.menu-grid-item'); // Menu kartlarini secer.
    const sectionHeading = document.getElementById('menuSectionHeading'); // Baslik elemanini secer.

    // Her kategori icin baslik metni ve ikon tanimlari
    const categoryLabels = { // Kategori basliklarini tanimlar.
      all: { icon: 'fa-solid fa-utensils', text: 'Tüm Menü' }, // Tum menu etiketi.
      hot: { icon: 'fa-solid fa-mug-hot', text: 'Sıcak İçecekler' }, // Sicak icecek etiketi.
      cold: { icon: 'fa-solid fa-ice-cream', text: 'Soğuk İçecekler' }, // Soguk icecek etiketi.
      pastry: { icon: 'fa-solid fa-cookie-bite', text: 'Kruvasanlar' }, // Kruvasan etiketi.
      breakfast: { icon: 'fa-solid fa-egg', text: 'Kahvaltı' }, // Kahvalti etiketi.
      dessert: { icon: 'fa-solid fa-cake-candles', text: 'Tatlılar' }, // Tatli etiketi.
    };

    const defaultFilter = 'all'; // Varsayilan filtreyi belirler.
    const { icon, text } = categoryLabels[defaultFilter]; // Varsayilan etiketleri alir.

    sectionHeading.innerHTML = // Baslik HTML'ini gunceller.
      `<i class="${icon}" style="color:#c07c40; margin-right:0.6rem;"></i>${text}`; // Ikonlu basligi yazar.

    filterBtns.forEach(btn => { // Her buton icin dongu kurar.
      btn.addEventListener('click', () => { // Butona tiklaninca calisir.

        // Aktif sinifini tum butonlardan kaldir, tiklanana ekle
        filterBtns.forEach(b => b.classList.remove('active')); // Tum butonlardan active sinifini kaldirir.
        btn.classList.add('active'); // Tiklanan butonu aktif yapar.

        const filter = btn.dataset.filter; // Secilen filtreyi alir.

        // ── Bolum basligini guncelle ──────────────────────────
        if (sectionHeading && categoryLabels[filter]) { // Baslik ve kategori varsa calisir.
          const { icon, text } = categoryLabels[filter]; // Ikon ve metni alir.
          sectionHeading.innerHTML = // Baslik HTML'ini gunceller.
            `<i class="${icon}" style="color:#c07c40; margin-right:0.6rem;"></i>${text}`; // Ikonlu basligi yazar.
          }

        // ── Urunleri filtrele ──────────────────────────────────
        menuItems.forEach(item => { // Menu kartlari uzerinde dolasir.
          const category = item.dataset.category; // Kartin kategorisini alir.
          const matches = filter === 'all' || category === filter; // Filtre eslesmesini kontrol eder.

          if (matches) { // Eslesme varsa calisir.
            item.classList.remove('hidden'); // Gizli sinifini kaldirir.
            item.classList.remove('visible'); // Gorunur sinifini sifirlar.
            void item.offsetWidth; // CSS animasyonunun yeniden baslamasi icin tarayiciyi yeniden hesaplama yapmaya zorlar.
            item.classList.add('visible'); // Gorunur sinifini ekler.
          } else { // Eslesme yoksa calisir.
            item.classList.add('hidden'); // Karti gizler.
          }
        });
      });
    });

    // Sayfa acilinca tum urunleri gorunur yap
    menuItems.forEach(item => item.classList.add('visible')); // Tum urunleri gorunur yapar.
  }

  /* =========================================================
    5. ILETISIM FORMU DOGRULAMA
    ========================================================= */

  const contactForm = document.getElementById('contactForm'); // Iletisim formunu secer.

  if (contactForm) { // Form varsa calisir.
    // Form alanlari ve hata mesajlari
    const nameInput = document.getElementById('contactName'); // Isim alanini secer.
    const emailInput = document.getElementById('contactEmail'); // E-posta alanini secer.
    const subjectInput = document.getElementById('contactSubject'); // Konu alanini secer.
    const messageInput = document.getElementById('contactMessage'); // Mesaj alanini secer.
    const formSuccess = document.getElementById('formSuccess'); // Basari mesajini secer.

    const nameError = document.getElementById('nameError'); // Isim hata mesajini secer.
    const emailError = document.getElementById('emailError'); // E-posta hata mesajini secer.
    const subjectError = document.getElementById('subjectError'); // Konu hata mesajini secer.
    const messageError = document.getElementById('messageError'); // Mesaj hata mesajini secer.

    /**
     * Regex ile e-posta dogrulama yapar.
     * @param {string} email
     * @returns {boolean}
     */
    function isValidEmail(email) { // E-posta gecerliligini kontrol eder.
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()); // Regex(metin kurallari) ile dogrular. trim() basta ve sonda bosluklari siler.
    }

    /**
     * Alanin hata stilini ac/kapat.
     * @param {HTMLElement} input   - Input elemani
     * @param {HTMLElement} errorEl - Hata mesaji
     * @param {boolean}     valid   - Alan gecerli mi?
     */
    function setFieldState(input, errorEl, valid) { // Alanin durumunu ayarlar.
      if (valid) { // Gecerliyse calisir.
        input.classList.remove('error');  // Hata sinifini kaldirir.
        errorEl.classList.remove('show'); // Hata mesajini gizler.
      } else { // Gecersizse calisir.
        input.classList.add('error');     // Hata sinifini ekler.
        errorEl.classList.add('show');    // Hata mesajini gosterir.
      }
      return valid;
    }

    // Kullanici alandan cikinca (blur) kontrol et
    nameInput.addEventListener('blur', () => setFieldState(nameInput, nameError, nameInput.value.trim().length >= 2)); // Isim alanini blur ile kontrol eder.
    emailInput.addEventListener('blur', () => setFieldState(emailInput, emailError, isValidEmail(emailInput.value))); // E-posta alanini blur ile kontrol eder.
    subjectInput.addEventListener('blur', () => setFieldState(subjectInput, subjectError, subjectInput.value.trim().length >= 2)); // Konu alanini blur ile kontrol eder.
    messageInput.addEventListener('blur', () => setFieldState(messageInput, messageError, messageInput.value.trim().length >= 10)); // Mesaj alanini blur ile kontrol eder.

    contactForm.addEventListener('submit', (e) => { // Form gonderimini yakalar.
      e.preventDefault(); // Sayfa yenilemeyi engeller.

      // Tüm alanları kontrol et
      const validName = setFieldState(nameInput, nameError, nameInput.value.trim().length >= 2); // Isim dogrular.
      const validEmail = setFieldState(emailInput, emailError, isValidEmail(emailInput.value)); // E-posta dogrular.
      const validSubject = setFieldState(subjectInput, subjectError, subjectInput.value.trim().length >= 2); // Konu dogrular.
      const validMessage = setFieldState(messageInput, messageError, messageInput.value.trim().length >= 10); // Mesaj dogrular.

      if (validName && validEmail && validSubject && validMessage) { // Tum alanlar dogruysa calisir.
        // Tum alanlar gecerli — formu gizle, basari mesajini goster
        contactForm.style.display = 'none'; // Formu gizler.
        formSuccess.style.display = 'block';  // Basari mesajini gosterir.
        formSuccess.classList.add('show');     // Show sinifini ekler.
        contactForm.reset(); // Form alanlarini temizler.

        // 5 saniye sonra formu geri getir (kullanici tekrar gonderebilsin)
        setTimeout(() => { // Gecikmeli geri gosterme ayarlar.
          contactForm.style.display = ''; // Formu tekrar gosterir.
          formSuccess.style.display = 'none'; // Basari mesajini gizler.
          formSuccess.classList.remove('show'); // Show sinifini kaldirir.
        }, 5000); // Gecikme suresini belirler.
      } else { // Gecersiz alan varsa calisir.
        // Ilk hatali alana odaklan
        const firstError = contactForm.querySelector('.error'); // Ilk hatali alanı secer.
        if (firstError) firstError.focus(); // Hata alanina odak verir.
      }
    });
  }

  /* =========================================================
     6. SMOOTH SCROLL — ayni sayfadaki #linkler icin
     ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => { // Sayfa ici linkleri secer.
    anchor.addEventListener('click', (e) => { // Link tiklamasini dinler.
      const target = document.querySelector(anchor.getAttribute('href')); // href degerindeki hedef elemani bulur.
      if (target) { // Hedef eleman varsa calisir.
        e.preventDefault(); // Tarayicinin varsayilan anlik atlama davranisini engeller.
        target.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Sayfayi hedef elemana yumusak kaydirma efektiyle goturur.
      }
    });
  });

  /* =========================================================
     7. AKTIF NAV LINK — mevcut sayfayi vurgula
     ========================================================= */
  const currentPath = window.location.pathname; //Tarayicidaki aktif sayfanin URL yolunu alir.
  document.querySelectorAll('.nav-link').forEach(link => { // Tum navigasyon linkleri uzerinde tek tek dolasir.
    const href = link.getAttribute('href'); // Linkin href degerini (hedef yolunu) alir.
    if (href && currentPath.endsWith(href.replace('../', '').replace('./', ''))) { 
    // Link yolu ile mevcut sayfa yolu eslesiyorsa aktif sayfa kabul eder.
      link.classList.add('active'); // Aktif link stilini uygular.
    }
  });

}); 