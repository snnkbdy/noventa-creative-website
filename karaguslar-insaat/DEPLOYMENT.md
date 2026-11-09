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

## Yayın öncesi kontrol listesi
- [ ] Orijinal KARAGUŞLAR İNŞAAT kartal logosunu ekleyin; geçici geometrik işaretle değiştirmeyin.
- [ ] Gerçek şirket telefonunu, e-posta adresini ve varsa açık adresini ekleyin.
- [ ] Formu, şirketin onayladığı bir alıcı/servis ile bağlayın. Şu an form yalnızca kullanıcının e-posta uygulamasında taslak hazırlar.
- [ ] Konsept görsellerini onaylı proje fotoğraflarıyla değiştirin veya konsept etiketlerini koruyun.
- [ ] Gerçek alan adını bağladıktan sonra canonical, sitemap ve robots ayarlarını o alan adına göre ekleyin.

Cloudflare Pages'in ücretsiz planı kullanım ve kota koşullarına tabidir. Bu depo ayarı tek başına Cloudflare hesabı açmaz veya siteyi otomatik yayınlamaz.
