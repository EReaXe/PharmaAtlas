# Katkıda Bulunma Rehberi (Contributing)

PharmaAtlas açık kaynaklı bir projedir ve topluluk katkılarını memnuniyetle karşılar. İlaç veritabanımızı genişletmek veya kod iyileştirmeleri yapmak için aşağıdaki adımları izleyebilirsiniz.

## Veri Ekleme (İlaç, Firma, Etken Madde)

Veri eklemek için teknik bilgiye ihtiyacınız yoktur. Projenin ana dizinindeki **`generator.html`** aracını kullanabilirsiniz.

1.  **`generator.html`** dosyasını tarayıcınızda açın.
2.  Eklemek istediğiniz veri tipini seçin (İlaç veya Firma).
3.  Formu doldurun.
    *   **Barkod**: İlacın gerçek GTIN-13 barkodunu kullanmaya özen gösterin.
    *   **ID**: Firmalar için sıradaki boş ID numarasını verin.
4.  "JSON Oluştur" butonuna basın.
5.  Oluşan kodu kopyalayın.
6.  İlgili dosyayı açın (`data/drugs.json` veya `data/companies.json`).
7.  Listenin sonundaki süslü parantezden `}` sonra bir virgül `,` koyup kopyaladığınız kodu yapıştırın.

---

## Geliştirme Ortamı

Projeyi yerel bilgisayarınızda çalıştırmak için:

1.  Repoyu klonlayın:
    ```bash
    git clone https://github.com/google-deepmind/pharma-atlas.git
    ```
2.  Klasörün içinde bir yerel sunucu başlatın (JSON verilerini okuyabilmek için gereklidir):
    *   Python ile: `python -m http.server`
    *   VS Code ile: "Live Server" eklentisini kullanın.
3.  Tarayıcıda `localhost:8000` (veya sunucunun verdiği port) adresine gidin.

## Pull Request Kuralları

- Veri eklerken **mevcut barkodları** kontrol edin, çakışma olmasın.
- Kod değişikliği yapıyorsanız, **mobil uyumluluğu** bozmadığınızdan emin olun.
- Tasarım değişikliklerinde `assets/styles.css` içindeki değişkenleri (`var(--primary)`) kullanın.

Teşekkürler! 💊🌍
