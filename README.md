<h1 align="center">👜 JOBS SEEKER</h1>
<p align="center">Simply application <b><u>Jobs Seeker</u></b> dashboard management and user experience friendly</p>
<p align="center">
<img src="https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
<img src="https://img.shields.io/badge/drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" />
<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" />
</p>
<p align="center">
<a href="https://dbdiagram.io/d/fullstack-nextjs-682bfd4e1227bdcb4e112e71" target="_blank">
<img src="./fullstack-nextjs.png" width="600" />
</a>
</p>

---

## 🚀 Features

<ol>
    <li>
        <p>✅ User Authentication (Next-Auth)</p>
    </li>
    <li>
        <p>👤 Roles (Admin & customer)</p>
        <ul>
            <li><p>Dashboard Admin (Management and Listing Jobs)</p></li>
            <li><p>Dashboard Applicant (View own jobs)</p></li>
        </ul>
    </li>
    <li><p>🔔 Jobs Application Logs</p></li>
</ol>

---

## 🏃 How to run

- Clone this repository
- Copy `.env.example` to `.env.local`
- Make sure you already have a database connection to Neon Postgres and a properly configured connection string
- Good Luck Have Fun 💗

---

## 🔗 Link

- Production (Soon) 🚀
  📘 Catatan Status Reservasi

1. pending
   Status awal saat reservasi dibuat, tetapi belum dilakukan pembayaran.
   Biasanya ada batas waktu tertentu agar pembayaran dilakukan sebelum dianggap kadaluarsa.

2. paid
   Reservasi sudah dibayar dan dikonfirmasi oleh sistem.
   Tamu sudah mendapatkan jaminan bahwa kamar tersedia pada tanggal yang dipesan.

3. checked_in
   Tamu sudah tiba di hotel/penginapan dan melakukan proses check-in.
   Status ini mengindikasikan bahwa masa inap sudah dimulai.

4. checked_out
   Tamu sudah selesai menginap dan check-out dari kamar.
   Biasanya setelah status ini, kamar akan tersedia kembali untuk pemesanan berikutnya.

5. cancelled
   Reservasi dibatalkan, bisa oleh tamu atau admin.
   Pembayaran bisa dikembalikan atau tidak tergantung kebijakan refund.

6. expired
   Reservasi tidak dibayar dalam waktu tertentu, sehingga dibatalkan otomatis oleh sistem.
   Biasanya status ini digunakan untuk mencegah kamar terus-menerus ditahan oleh reservasi yang tidak valid.

7. refunded
   Reservasi yang sudah dibatalkan, dan uangnya telah dikembalikan ke tamu.
   Status ini muncul jika proses refund berhasil dilakukan.

8. no_show
   Tamu tidak datang pada hari check-in tanpa memberikan konfirmasi.
   Biasanya dianggap hangus dan tidak bisa refund.
