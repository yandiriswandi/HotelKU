import {
  pgTable,
  varchar,
  text,
  timestamp,
  uuid,
  integer,
  pgEnum,
  decimal,
  numeric,
} from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['admin', 'customer'])

export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar({ length: 100 }).notNull(),
  password: text().notNull(),
  role: userRoleEnum('role').notNull().default('customer'),
  full_name: text('full_name').notNull(),
  phone: varchar('phone').notNull(),
  address: text('address'), // Tambahkan alamat
  image_url: text('image_url'), // Tidak dibatasi panjang dan boleh NULL // Tambahkan URL gambar atau nama file
  created_at: timestamp({ withTimezone: true }).defaultNow(),
  updated_at: timestamp({ withTimezone: true }).defaultNow(),
})

export const roomTable = pgTable('rooms', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  discount: numeric('discount'),
  description: text('description'),
  total_room: integer('total_room').notNull().default(1), // ⬅️ jumlah unit tersedia
  created_at: timestamp({ withTimezone: true }).defaultNow(),
  updated_at: timestamp({ withTimezone: true }).defaultNow(),
  deleted_at: timestamp(),
})

export const roomVideosTable = pgTable('room_videos', {
  id: uuid('id').defaultRandom().primaryKey(),
  room_id: uuid('room_id')
    .notNull()
    .references(() => roomTable.id, { onDelete: 'cascade' }),
  title: text('title'),
  description: text('description'),
  video_url: text('video_url').notNull(),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
  updated_at: timestamp({ withTimezone: true }).defaultNow(),
})

export const roomImageTable = pgTable('room_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  room_id: uuid('room_id')
    .notNull()
    .references(() => roomTable.id, { onDelete: 'cascade' }),
  image_url: text('image_url').notNull(),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
  updated_at: timestamp({ withTimezone: true }).defaultNow(),
})

export const reservationTable = pgTable('reservations', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(),
  arrival: timestamp({ withTimezone: true }).defaultNow(),
  departure: timestamp({ withTimezone: true }).defaultNow(),
  room_id: uuid('room_id')
    .notNull()
    .references(() => roomTable.id, { onDelete: 'cascade' }),
  user_id: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  note: text('note'),
  total_room: integer('total_room').notNull().default(1), // ⬅️ jumlah unit tersedia
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  discount: integer('discount'),
  total_price: decimal('total_price', { precision: 12, scale: 2 }).notNull(),
  status: integer('status'),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
  updated_at: timestamp({ withTimezone: true }).defaultNow(),
})

export const reservationLogsTable = pgTable('reservation_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  reservation_id: uuid('reservation_id').references(() => reservationTable.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  status: integer('status'),
  note: text('note').notNull(),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
})

export const roomReviewTable = pgTable('room_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  room_id: uuid('room_id')
    .notNull()
    .references(() => roomTable.id, { onDelete: 'cascade' }),
  reservation_id: uuid('reservation_id')
    .notNull()
    .references(() => reservationTable.id, { onDelete: 'cascade' }),
  user_id: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  rating: numeric('rating') // misal skala 1-5
    .notNull(),
  comment: text('comment'), // bisa null jika hanya kasih rating saja
  created_at: timestamp({ withTimezone: true }).defaultNow(),
})

// INSERT INTO users (full_name,phone,email, password, role) VALUES ('admin','085951393322','admin@mail.com', '$2a$12$WrVGbnSYAQr.RpVIISQExepfZnNVpkTkd8o7Fh.JuacCN9O2/Jjmy', 'admin');

// 📘 Catatan Status Reservasi
// 1. pending
// Status awal saat reservasi dibuat, tetapi belum dilakukan pembayaran.
// Biasanya ada batas waktu tertentu agar pembayaran dilakukan sebelum dianggap kadaluarsa.

// 2. confirmed
// Reservasi sudah dibayar dan dikonfirmasi oleh sistem.
// Tamu sudah mendapatkan jaminan bahwa kamar tersedia pada tanggal yang dipesan.

// 3. checked_in
// Tamu sudah tiba di hotel/penginapan dan melakukan proses check-in.
// Status ini mengindikasikan bahwa masa inap sudah dimulai.

// 4. checked_out
// Tamu sudah selesai menginap dan check-out dari kamar.
// Biasanya setelah status ini, kamar akan tersedia kembali untuk pemesanan berikutnya.

// 5. cancelled
// Reservasi dibatalkan, bisa oleh tamu atau admin.
// Pembayaran bisa dikembalikan atau tidak tergantung kebijakan refund.

// 6. expired
// Reservasi tidak dibayar dalam waktu tertentu, sehingga dibatalkan otomatis oleh sistem.
// Biasanya status ini digunakan untuk mencegah kamar terus-menerus ditahan oleh reservasi yang tidak valid.

// 7. refunded
// Reservasi yang sudah dibatalkan, dan uangnya telah dikembalikan ke tamu.
// Status ini muncul jika proses refund berhasil dilakukan.

// 8. no_show
// Tamu tidak datang pada hari check-in tanpa memberikan konfirmasi.
// Biasanya dianggap hangus dan tidak bisa refund.
