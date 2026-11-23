# LAPORAN AUDIT KELAYAKAN PERANCANGAN SISTEM
## (ERD, DFD LEVEL 1, MAPPING CHART, DAN FLOWCHART)
### Sistem Informasi Beasiswa Berbasis Website di Politeknik Negeri Lampung (ScholarHub POLINELA)

---

## 1. PENDAHULUAN & RINGKASAN EKSEKUTIF

Laporan ini disusun sebagai hasil audit teknis komparatif antara **Dokumen Perancangan Sistem** (ERD, DFD Level 1, Mapping Chart Swimlane, dan Flowchart 1 s.d. 8) dengan **Implementasi Nyata Aplikasi ScholarHub POLINELA** (berbasis React Vite, Express.js, dan database MySQL `beasiswa_polinela`).

Secara keseluruhan, **rancangan perancangan yang dibuat telah mencapai tingkat kesesuaian ~88%** terhadap batasan sistem akademik:
- ✅ **Batasan Bisnis Terjaga:** Mahasiswa/pengunjung bersifat *tanpa login* (hanya membaca informasi, filter beasiswa, memeriksa syarat, dan diarahkan ke tautan pendaftaran eksternal resmi).
- ✅ **Tidak Ada Pendaftaran Internal:** Tidak ada tabel transaksi pendaftaran mahasiswa, unggah berkas mahasiswa, penilaian, atau seleksi internal yang menyalahi ruang lingkup.
- ✅ **Dukungan Multi-Record Persyaratan:** Relasi 1 beasiswa ke banyak butir persyaratan terakomodasi dengan baik.

Namun, terdapat **2 kekeliruan kritis** dan **beberapa inkonsistensi minor** yang wajib diperbaiki sebelum diajukan ke Seminar Hasil (Semhas) atau Ujian Skripsi agar tidak menjadi celah pertanyaan penguji.

---

## 2. AUDIT ENTITY RELATIONSHIP DIAGRAM (ERD)

### 2.1. Temuan Kritis: Salah Label Entitas `log_aktivitas`
* **Lokasi Temuan:** Entitas kotak persegi panjang di sudut kiri bawah diagram.
* **Kondisi Saat Ini:** Kotak tersebut tertulis **`pengaturan_situs`**, padahal atribut yang terhubung adalah:
  - `id (PK)`
  - `pengguna_id (FK)`
  - `aksi`
  - `jenis_entitas`
  - `id_entitas`
  - `data_sebelum`
  - `data_sesudah`
  - `dibuat_pada`
  - Relasi `mencatat` dari entitas `pengguna`.
* **Dampak:** Di dalam ERD terdapat **dua entitas bernama sama (`pengaturan_situs`)**, sehingga tabel `log_aktivitas` seolah-olah tidak ada di ERD.
* **Tindakan Perbaikan:** Ganti nama kotak entitas tersebut menjadi **`log_aktivitas`**.

### 2.2. Temuan Minor: Duplikasi Atribut di `persyaratan_beasiswa`
* **Lokasi Temuan:** Entitas `persyaratan_beasiswa`.
* **Kondisi Saat Ini:** Terdapat dua buah oval dengan teks **`nama_persyaratan`** (satu di sisi kiri, satu di atas-kiri entitas).
* **Tindakan Perbaikan:** Hapus salah satu oval atribut `nama_persyaratan` yang duplikat.

### 2.3. Temuan Minor: Atribut Berlebih di `kategori_beasiswa`
* **Lokasi Temuan:** Entitas `kategori_beasiswa`.
* **Kondisi Saat Ini:** Terdapat oval atribut **`diperbarui_oleh (FK)`**.
* **Kondisi Database Nyata:** Tabel MySQL `kategori_beasiswa` hanya terdiri dari:
  `id (PK)`, `nama_kategori`, `slug`, `deskripsi`, `dibuat_pada`, `diperbarui_pada`.
  Tabel ini tidak memiliki foreign key `diperbarui_oleh`.
* **Tindakan Perbaikan:** Hapus oval `diperbarui_oleh (FK)` pada `kategori_beasiswa`.

### 2.4. Validasi Kardinalitas Relasi ERD
* `beasiswa` (1) ke `persyaratan_beasiswa` (N): **1 to N** *(Sesuai)*
* `kategori_beasiswa` (1) ke `beasiswa` (N): **1 to N** *(Sesuai)*
* `penyelenggara_beasiswa` (1) ke `beasiswa` (N): **1 to N** *(Sesuai)*
* `pengguna` (1) ke `beasiswa` (N): Relasi `membuat` (1:N) dan `memperbarui` (1:N) *(Sesuai)*
* `pengguna` (1) ke `pengumuman` (N): Relasi `membuat` (1:N) dan `memperbarui` (1:N) *(Sesuai)*
* `pengguna` (1) ke `pengaturan_situs` (N): Relasi `memperbarui` (1:N) *(Sesuai)*
* `pengguna` (1) ke `log_aktivitas` (N): Relasi `mencatat` (1:N) *(Sesuai setelah ganti label)*

---

## 3. AUDIT DATA FLOW DIAGRAM (DFD LEVEL 1)

### 3.1. DFD Mahasiswa / Pengunjung (Proses 4.0 - Sajikan Informasi Beasiswa)
* **Status:** ✅ **100% Valid & Sesuai**
* **Analisis:**
  - Aliran data masuk ke Proses 4.0 murni berupa data referensi publik (*read-only*):
    `Data kategori`, `Data penyelenggara`, `Beasiswa berstatus terbit`, `Data persyaratan`, `Pengaturan publik`, dan `Pengumuman aktif`.
  - Aliran data keluar ke entitas `Mahasiswa / Pengunjung`:
    `Daftar, detail, syarat, pengumuman, tautan`.
  - Tidak ada aliran simpan pendaftaran mahasiswa ke database. Sangat tepat.

### 3.2. DFD Administrator (Proses 1.0, 2.0, 3.0, 5.0, 6.0)
* **Temuan 1 (Arah Panah Log Terbalik):** ❌
  - Pada **Proses 2.0 (Kelola Kategori & Penyelenggara)**: Aliran *"Log perubahan referensi"* panahnya mengarah **DARI** `Log Aktivitas` **KE** Proses 2.0.
  - Pada **Proses 6.0 (Kelola Pengaturan Situs)**: Aliran *"Log perubahan pengaturan"* panahnya mengarah **DARI** `Log Aktivitas` **KE** Proses 6.0.
  - *Kaidah DFD:* Proses mencatat/menulis data ke data store (operasi write), sehingga panah **wajib mengarah DARI proses MENUJU Data Store `Log Aktivitas`**.
* **Temuan 2 (Hak Akses Proses 6.0 - Kelola Pengaturan Situs):** ⚠️
  - Pada diagram, Proses 6.0 dihubungkan ke entitas umum `Administrator`.
  - *Fakta Sistem:* Pengaturan Situs dilindungi otorisasi ketat khusus `Admin Utama` (`requireAdminUtama`). Admin konten biasa tidak berhak mengubah logo, nama website, kontak, atau durasi running text.
  - *Koreksi:* Hubungkan Proses 6.0 ke entitas eksternal **`Admin Utama`**, bukan `Administrator` umum.

### 3.3. DFD Admin Utama (Proses 7.0 & 8.0)
* **Temuan 1 (Arah Panah Log Terbalik pada Proses 7.0):** ❌
  - Aliran *"Log perubahan akun"* panahnya mengarah **DARI** `Log Aktivitas` **KE** Proses 7.0.
  - *Koreksi:* Balik arah panah agar mengarah **DARI Proses 7.0 KE Data Store `Log Aktivitas`**.
* **Proses 8.0 (Lihat Log Aktivitas):** ✅ **Sangat Tepat**
  - Mengambil data riwayat dari `Log Aktivitas` dan identitas pelaku dari `Pengguna`, lalu menyajikan riwayat aktivitas terfilter kepada `Admin Utama`.

---

## 4. AUDIT FLOWCHART SISTEM (FLOWCHART 1 S.D. 8)

### Flowchart 1 — Halaman Pengunjung
* **Kelemahan Alur:**
  1. Alur berakhir mendadak (*dead-end*). Dari blok `Display daftar beasiswa`, `Display beasiswa berdasarkan kategori`, dan `Display detail dan persyaratan beasiswa`, garis panah langsung menuju terminal `Selesai`.
  2. Belum tergambar aksi klik **Tautan Pendaftaran Resmi Eksternal (Website Mitra)**.
* **Rekomendasi Alur Ideal:**
  ```mermaid
  flowchart TD
    Start([Mulai]) --> Buka[Buka Website ScholarHub]
    Buka --> Home[Menampilkan Halaman Beranda]
    Home --> Filter{Cari / Filter Kategori?}
    Filter -- Ya --> TampilList[Tampilkan Daftar Beasiswa Sesuai Filter]
    Filter -- Tidak --> TampilSemua[Tampilkan Daftar Beasiswa Terbaru]
    TampilList --> Pilih{Pilih Salah Satu Beasiswa?}
    TampilSemua --> Pilih
    Pilih -- Ya --> Detail[Tampilkan Detail Persyaratan & Jadwal]
    Pilih -- Tidak --> Selesai([Selesai / Kembali])
    Detail --> DaftarEksternal{Daftar Beasiswa?}
    DaftarEksternal -- Ya --> Redirect[Klik CTA: Dialihkan ke Situs Resmi Mitra]
    DaftarEksternal -- Tidak --> Selesai
    Redirect --> Selesai
  ```

### Flowchart 2 — Autentikasi Administrator
* **Status:** ✅ **Sangat Baik & Lengkap**
* Memverifikasi username & password, menolak kredensial salah dengan pesan kesalahan, mencatat log login, serta memisahkan percabangan Dashboard Admin Utama vs Dashboard Administrator.

### Flowchart 3 — Kelola Kategori & Penyelenggara
* **Status:** ✅ **Sesuai**
* Mengakomodasi 3 cabang aksi: Tambah (input), Ubah (edit), Hapus (dengan konfirmasi). Setiap aksi sukses memicu *simpan & catat log aktivitas*.

### Flowchart 4 — Kelola Beasiswa & Persyaratan
* **Status:** 🌟 **Sangat Baik (Unggulan)**
* Memiliki 4 cabang aksi:
  1. **Tambah** (Input informasi beasiswa & multi-persyaratan)
  2. **Ubah** (Edit informasi & persyaratan)
  3. **Hapus** (Dengan konfirmasi)
  4. **Publikasi** (Mengatur status draf/terbit/arsip dan jadwal buka/tutup)
* Sangat selaras dengan implementasi backend & frontend Tahap 3.

### Flowchart 5 — Kelola Pengumuman
* **Status:** ✅ **Sesuai**
* Mengakomodasi CRUD pengumuman, pengaturan urutan tampil, dan jadwal tayang yang tercatat ke log aktivitas.

### Flowchart 6 — Kelola Pengaturan Situs
* **Status:** ❌ **Perlu Koreksi Role Peran**
* **Temuan:** Blok awal tertulis **`Display Dashboard Administrator`**.
* **Koreksi:** Ubah menjadi **`Display Dashboard Admin Utama`**. Fitur ini tidak dimiliki oleh Administrator biasa.

### Flowchart 7 — Kelola Akun Administrator
* **Status:** 🌟 **Sangat Baik (Unggulan)**
* Memisahkan aksi **Ubah Status (Aktif / Nonaktif)** dari aksi Hapus Akun. Ini selaras dengan proteksi integritas data di backend (akun yang memiliki riwayat data beasiswa tidak dihapus permanen melainkan dinonaktifkan).

### Flowchart 8 — Lihat Log Aktivitas
* **Status:** ✅ **Sangat Baik**
* Menggambarkan proses audit Admin Utama, lengkap dengan opsi penyaringan/filter riwayat berdasarkan aksi atau entitas.

---

## 5. AUDIT MAPPING CHART (SWIMLANE DIAGRAM)

### 5.1. Mapping Chart Administrator
* **Temuan:** Pada kotak pilihan menu, tertulis:
  `pilih menu (Kategori & Penyelenggara / Beasiswa & Persyaratan / Pengumuman / Pengaturan Situs)`
* **Koreksi:** Hapus kata **`Pengaturan Situs`**. Administrator biasa hanya memiliki akses ke 3 modul: Kategori & Penyelenggara, Beasiswa & Persyaratan, dan Pengumuman.

### 5.2. Mapping Chart Admin Utama
* **Temuan:** Pada kotak pilihan menu, tertulis:
  `pilih menu (Menu Administrator + Kelola Akun Admin / Log Aktivitas)`
* **Penyempurnaan:** Tambahkan secara eksplisit modul **Pengaturan Situs**:
  `pilih menu (Kelola Akun Admin, Log Aktivitas, Pengaturan Situs, dan Konten Beasiswa)`

### 5.3. Mapping Chart Mahasiswa / Pengunjung
* **Penyempurnaan:** Tambahkan interaksi klik tombol **"Kunjungi Situs Resmi"** setelah melihat detail beasiswa, agar diagram menggambarkan fungsi jembatan pendaftaran eksternal.

---

## 6. TABEL MATRIKS REKAPITULASI EVALUASI & REVISI

| No | Komponen Dokumen | Bagian / Lokasi | Status | Tindakan Perbaikan Konkret |
| :---: | :--- | :--- | :---: | :--- |
| **1** | **ERD** | Entitas kotak kiri bawah | 🔴 **Kritis** | Ganti nama entitas `pengaturan_situs` menjadi **`log_aktivitas`**. |
| **2** | **ERD** | Entitas `persyaratan_beasiswa` | 🟡 Sedang | Hapus salah satu oval atribut `nama_persyaratan` yang duplikat. |
| **3** | **ERD** | Entitas `kategori_beasiswa` | 🟢 Minor | Hapus oval atribut `diperbarui_oleh (FK)` (tidak ada di tabel MySQL). |
| **4** | **DFD Level 1** | Aliran log pada Proses 2.0 & 6.0 | 🔴 **Kritis** | Balik mata panah log agar **mengarah ke Data Store `Log Aktivitas`**. |
| **5** | **DFD Level 1** | Aliran log pada Proses 7.0 | 🔴 **Kritis** | Balik mata panah log agar **mengarah ke Data Store `Log Aktivitas`**. |
| **6** | **DFD Level 1** | Entitas pemicu Proses 6.0 | 🟡 Sedang | Hubungkan Proses 6.0 (*Kelola Pengaturan Situs*) ke entitas **`Admin Utama`**. |
| **7** | **Flowchart 6** | Blok tampilan dashboard | 🔴 **Kritis** | Ubah teks `Display Dashboard Administrator` menjadi **`Display Dashboard Admin Utama`**. |
| **8** | **Flowchart 1** | Aliran setelah detail beasiswa | 💡 Saran | Tambahkan cabang keputusan: *Klik Link Pendaftaran Resmi $\rightarrow$ Dialihkan ke Web Mitra*. |
| **9** | **Mapping Chart** | Menu pilihan Administrator | 🟡 Sedang | Hapus *Pengaturan Situs* dari alur Administrator biasa. |
| **10**| **Mapping Chart** | Menu pilihan Admin Utama | 🟢 Minor | Cantumkan *Pengaturan Situs* ke dalam daftar wewenang Admin Utama. |

---

## 7. KESIMPULAN & REKOMENDASI UNTUK SEMHAS

1. Perancangan yang Anda susun **telah selaras dengan arsitektur modern** ScholarHub POLINELA.
2. Dengan melakukan revisi pada **10 poin dalam tabel matriks di atas**, seluruh dokumen perancangan Anda (ERD, DFD, Mapping Chart, dan Flowchart) akan **100% konsisten satu sama lain** dan **100% cocok dengan aplikasi nyata yang berjalan di localhost**.
3. Saat presentasi Semhas, Anda dapat dengan percaya diri menjelaskan bahwa:
   - Mahasiswa tidak memiliki akun login demi kemudahan akses publik.
   - Pendaftaran dilakukan langsung pada portal mitra resmi (eksternal) untuk menjamin keabsahan seleksi.
   - Hak akses admin terbagi tegas antara **Admin Konten** dan **Admin Utama** (dilengkapi audit trail otomatis di `log_aktivitas`).
