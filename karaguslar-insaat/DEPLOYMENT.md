# Ücretsiz yayınlama — Cloudflare Pages

Bu klasör bağımsız statik web sitesi olarak hazırlanmıştır; derleme komutu veya ücretli paket gerektirmez.

## Cloudflare Pages ayarları
1. Cloudflare hesabında **Workers & Pages → Create → Pages → Connect to Git** yolunu açın.
2. GitHub hesabını bağlayıp `snnkbdy/noventa-creative-website` deposunu seçin.
3. **Root directory (advanced)** alanını `karaguslar-insaat` yapın.
4. Framework preset: **None**.
5. Build command: boş bırakın.
6. Build output directory: `.` (nokta).
7. Deploy ile önizleme adresini oluşturun.

Bu ayar yalnızca `karaguslar-insaat` klasörünü yayınlar; deponun kökündeki diğer site dosyalarına dokunmaz.

## Otomatik kontroller

Depoda `.github/workflows/site-check.yml` iş akışı bulunur. Site dosyaları değiştiğinde bağlantılar, yinelenen kimlikler, yerel dosyalar, görsel alternatif metinleri, form etiketleri, marka yazımı ve satır içi JavaScript sözdizimi denetlenir. GitHub deposunun **Actions** sekmesinden sonuç görülebilir.

## Yayın öncesi kontrol listesi
- [ ] Orijinal KARAGUŞLAR İNŞAAT kartal logosunu ekleyin; geçici geometrik işaretle değiştirmeyin.
- [ ] Gerçek şirket telefonunu, e-posta adresini ve varsa açık adresini ekleyin.
- [ ] Formu, şirketin onayladığı bir alıcı/servis ile bağlayın. Form şu an yalnızca tarayıcıda alanları kontrol eder ve bilgilendirme gösterir; veri saklamaz veya göndermez.
- [ ] Konsept görsellerini onaylı proje fotoğraflarıyla değiştirin veya konsept etiketlerini koruyun.
- [ ] Gerçek alan adını bağladıktan sonra canonical, sitemap ve robots ayarlarını o alan adına göre ekleyin.

Cloudflare Pages'in ücretsiz planı kullanım ve kota koşullarına tabidir. Bu depo ayarı tek başına Cloudflare hesabı açmaz veya siteyi otomatik yayınlamaz.
