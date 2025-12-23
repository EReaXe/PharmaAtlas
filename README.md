# PharmaAtlas

Basit, hızlı ve ilişki tabanlı ilaç veritabanı prototipi.

## Kurulum ve Çalıştırma

Bu proje **Backend gerektirmez**. Çalıştırmak için:

1. Bu klasörü bir yerel sunucu ile açın.
   - VS Code kullanıyorsanız "Live Server" eklentisi ile `index.html`'e sağ tıklayıp "Open with Live Server" diyebilirsiniz.
   - Veya terminalde python yüklü ise: `python -m http.server` yazıp `localhost:8000` adresine gidin.
   
   *Not: Tarayıcı güvenlik politikaları gereği (CORS), `fetch` isteği doğrudan dosya sistemi (`file://`) üzerinden çalışmayabilir. Mutlaka basit bir HTTP sunucusu kullanın.*

## Veri Yapısı

Tüm veriler `/data` klasörü altındaki JSON dosyalarında tutulur:
- `drugs.json`: İlaç bilgileri ve ilişkiler (firma, etken madde, muadiller).
- `companies.json`: Üretici firma bilgileri.
- `ingredients.json`: Etken maddeler.

## Özellikler

- **Responsive Tasarım**: Mobil ve masaüstü uyumlu.
- **Hızlı Arama**: İlaç, firma veya etken madde ismine göre anlık arama.
- **İlişkisel Gezinti**:
  - Bir ilacın muadillerini görebilirsiniz.
  - Bir firmanın tüm ilaçlarını listeleyebilirsiniz.
  - Bir etken maddeyi kullanan tüm ilaçları bulabilirsiniz.
- **SPA Benzeri Deneyim**: Sayfalar ayrı HTML dosyaları olsa da, hızlı geçişler ve temiz UI ile akıcı bir deneyim sunar.
