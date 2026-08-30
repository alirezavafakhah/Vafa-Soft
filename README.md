# Vafa-Soft - وبسایت دانلود اپلیکیشن‌های ویندوز

یک وبسایت مدرن و ریسپانسیو برای نمایش و دانلود اپلیکیشن‌های ویندوز.

## ویژگی‌ها

- 🎨 طراحی مدرن و زیبا
- 📱 کاملاً ریسپانسیو (موبایل، تبلت، دسکتاپ)
- 🎠 اسلایدر بنر با قابلیت سوایپ
- ⚡ سریع و بهینه
- 🌐 پشتیبانی از زبان فارسی (RTL)

## ساختار پروژه

```
WebSite/
├── index.html          # صفحه اصلی
├── css/
│   └── style.css       # استایل‌ها
├── js/
│   └── main.js         # اسکریپت‌ها
├── images/             # تصاویر (اختیاری)
└── README.md           # راهنما
```

## نحوه استفاده

### اجرای محلی
فقط کافیست فایل `index.html` را در مرورگر باز کنید.

### دیپلوی روی GitHub Pages

1. یک ریپازیتوری جدید در GitHub بسازید
2. فایل‌ها را push کنید:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. به Settings > Pages بروید
4. Source را روی `main` branch تنظیم کنید
5. سایت شما در آدرس `https://YOUR_USERNAME.github.io/YOUR_REPO` در دسترس خواهد بود

## سفارشی‌سازی

### تغییر اطلاعات اپلیکیشن‌ها
در فایل `index.html` بخش‌های مربوط به هر اپ را ویرایش کنید:
- نام اپلیکیشن
- توضیحات
- حجم فایل
- لینک دانلود (href در دکمه دانلود)

### تغییر رنگ‌ها
در فایل `css/style.css` متغیرهای CSS را در `:root` تغییر دهید:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    /* ... */
}
```

### افزودن لینک دانلود واقعی
لینک‌های `href="#"` را در دکمه‌های دانلود با لینک واقعی فایل‌ها جایگزین کنید.

## تکنولوژی‌ها

- HTML5
- CSS3 (Flexbox, Grid, CSS Variables)
- JavaScript (Vanilla)
- Font Awesome Icons
- Vazirmatn Font

## لایسنس

این پروژه آزاد است و می‌توانید از آن استفاده کنید.
