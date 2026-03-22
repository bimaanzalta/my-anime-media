import 'dotenv/config'
import mysql from 'mysql2/promise'
import { drizzle } from 'drizzle-orm/mysql2'
import bcrypt from 'bcryptjs'
import * as schema from './schema'

const {
  users,
  profiles,
  articleCategories,
  forumCategories,
  anime,
  articles,
  articleTags,
  articleAnime,
  reviews,
  reviewAnime,
  forumThreads,
  forumPosts,
} = schema

async function main() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'my_anime_media',
    multipleStatements: true,
  })

  const db = drizzle(pool, { schema, mode: 'default' })

  console.log('🌱 Seeding database...')

  // ───────────────────────────────────────
  // USERS
  // ───────────────────────────────────────
  console.log('  → users')
  const password = await bcrypt.hash('password123', 12)

  await db.insert(users).values([
    {
      username: 'admin',
      email: 'admin@aniverse.id',
      passwordHash: password,
      role: 'admin',
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=admin',
      bio: 'Administrator AniVerse.',
    },
    {
      username: 'moderator',
      email: 'mod@aniverse.id',
      passwordHash: password,
      role: 'moderator',
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=mod',
      bio: 'Moderator komunitas AniVerse.',
    },
    {
      username: 'sakura_review',
      email: 'sakura@aniverse.id',
      passwordHash: password,
      role: 'member',
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=sakura',
      bio: 'Penggemar anime isekai dan slice of life. Suka nulis review panjang.',
    },
    {
      username: 'ryuusei',
      email: 'ryuusei@aniverse.id',
      passwordHash: password,
      role: 'member',
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ryuusei',
      bio: 'Otaku sejati. Spesialis shounen dan action.',
    },
  ]).onDuplicateKeyUpdate({ set: { role: schema.users.role } })

  const allUsers = await db.select().from(users)
  const adminUser = allUsers.find(u => u.username === 'admin')!
  const modUser = allUsers.find(u => u.username === 'moderator')!
  const sakura = allUsers.find(u => u.username === 'sakura_review')!
  const ryuusei = allUsers.find(u => u.username === 'ryuusei')!

  // ───────────────────────────────────────
  // PROFILES
  // ───────────────────────────────────────
  console.log('  → profiles')
  await db.insert(profiles).values([
    { userId: adminUser.id, displayName: 'AniVerse Admin', bio: 'Membangun komunitas anime Indonesia.' },
    { userId: sakura.id, displayName: 'Sakura 🌸', bio: 'Reviewer anime dan manga.' },
    { userId: ryuusei.id, displayName: 'Ryuusei ⚡', bio: 'Action & Shounen enthusiast.' },
  ]).onDuplicateKeyUpdate({ set: { displayName: profiles.displayName } })

  // ───────────────────────────────────────
  // ARTICLE CATEGORIES
  // ───────────────────────────────────────
  console.log('  → article_categories')
  await db.insert(articleCategories).values([
    { name: 'Berita', slug: 'berita', description: 'Berita terkini seputar anime dan manga.' },
    { name: 'Editorial', slug: 'editorial', description: 'Opini dan ulasan mendalam dari tim redaksi.' },
    { name: 'Seasonal Guide', slug: 'seasonal-guide', description: 'Panduan anime per musim tayang.' },
    { name: 'Rekomendasi', slug: 'rekomendasi', description: 'Rekomendasi anime dan manga pilihan.' },
    { name: 'Behind the Scene', slug: 'behind-the-scene', description: 'Di balik layar produksi anime.' },
  ]).onDuplicateKeyUpdate({ set: { name: articleCategories.name } })

  const allCats = await db.select().from(articleCategories)
  const catBerita = allCats.find(c => c.slug === 'berita')!
  const catEditorial = allCats.find(c => c.slug === 'editorial')!
  const catSeasonal = allCats.find(c => c.slug === 'seasonal-guide')!
  const catReko = allCats.find(c => c.slug === 'rekomendasi')!

  // ───────────────────────────────────────
  // FORUM CATEGORIES
  // ───────────────────────────────────────
  console.log('  → forum_categories')
  await db.insert(forumCategories).values([
    { name: 'Anime', slug: 'anime', description: 'Diskusi umum seputar anime.', order: 1 },
    { name: 'Manga', slug: 'manga', description: 'Diskusi seputar manga dan manhwa.', order: 2 },
    { name: 'News Talk', slug: 'news-talk', description: 'Diskusi berita dan pengumuman terbaru.', order: 3 },
    { name: 'Rekomendasi', slug: 'rekomendasi-forum', description: 'Minta dan beri rekomendasi anime/manga.', order: 4 },
    { name: 'Seasonal', slug: 'seasonal', description: 'Diskusi anime yang sedang tayang musim ini.', order: 5 },
    { name: 'Off-Topic', slug: 'off-topic', description: 'Ngobrol santai di luar topik anime.', order: 6 },
  ]).onDuplicateKeyUpdate({ set: { name: forumCategories.name } })

  const allForumCats = await db.select().from(forumCategories)
  const fcAnime = allForumCats.find(c => c.slug === 'anime')!
  const fcSeasonal = allForumCats.find(c => c.slug === 'seasonal')!
  const fcReko = allForumCats.find(c => c.slug === 'rekomendasi-forum')!
  const fcNewsTalk = allForumCats.find(c => c.slug === 'news-talk')!

  // ───────────────────────────────────────
  // ANIME (sample local cache dari MAL)
  // ───────────────────────────────────────
  console.log('  → anime')
  await db.insert(anime).values([
    {
      malId: 52991,
      title: 'Sousou no Frieren',
      titleEn: 'Frieren: Beyond Journey\'s End',
      titleJp: '葬送のフリーレン',
      synopsis: 'The adventure is over but life goes on for an elf mage just beginning to learn what living is all about. Elf mage Frieren and her courageous fellow adventurers have defeated the Demon King...',
      mainPicture: { medium: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg', large: 'https://cdn.myanimelist.net/images/anime/1015/138006l.jpg' },
      mediaType: 'tv',
      status: 'finished_airing',
      genres: JSON.stringify(['Adventure', 'Drama', 'Fantasy', 'Slice of Life']),
      studios: JSON.stringify(['Madhouse']),
      startDate: '2023-09-29',
      endDate: '2024-03-22',
      mean: '9.38',
      popularity: 87,
      rank: 1,
      relatedAnime: JSON.stringify([]),
      syncedAt: new Date(),
    },
    {
      malId: 44511,
      title: 'Chainsaw Man',
      titleEn: 'Chainsaw Man',
      titleJp: 'チェンソーマン',
      synopsis: 'Denji has a simple dream—to live a happy and peaceful life, spending time with a girl he likes. This is a far cry from reality, however, as Denji is forced by the yakuza into killing devils in order to pay off his father\'s debt...',
      mainPicture: { medium: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg', large: 'https://cdn.myanimelist.net/images/anime/1806/126216l.jpg' },
      mediaType: 'tv',
      status: 'finished_airing',
      genres: JSON.stringify(['Action', 'Adventure', 'Gore', 'Supernatural']),
      studios: JSON.stringify(['MAPPA']),
      startDate: '2022-10-12',
      endDate: '2022-12-28',
      mean: '8.70',
      popularity: 30,
      rank: 82,
      relatedAnime: JSON.stringify([]),
      syncedAt: new Date(),
    },
    {
      malId: 40748,
      title: 'Jujutsu Kaisen',
      titleEn: 'Jujutsu Kaisen',
      titleJp: '呪術廻戦',
      synopsis: 'Idly indulging in baseless paranormal activities with the Occult Club, high schooler Yuuji Itadori spends his days at either the clubroom or the hospital...',
      mainPicture: { medium: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg', large: 'https://cdn.myanimelist.net/images/anime/1171/109222l.jpg' },
      mediaType: 'tv',
      status: 'finished_airing',
      genres: JSON.stringify(['Action', 'Award Winning', 'Horror', 'Supernatural']),
      studios: JSON.stringify(['MAPPA']),
      startDate: '2020-10-03',
      endDate: '2021-03-27',
      mean: '8.64',
      popularity: 5,
      rank: 103,
      relatedAnime: JSON.stringify([]),
      syncedAt: new Date(),
    },
    {
      malId: 51009,
      title: 'Kimetsu no Yaiba: Katanakaji no Sato-hen',
      titleEn: 'Demon Slayer: Kimetsu no Yaiba Swordsmith Village Arc',
      titleJp: '鬼滅の刃 刀鍛冶の里編',
      synopsis: 'Tanjiro, Nezuko, Genya, Mitsuri, and Muichiro face off against Upper Ranks Four and Five in the Swordsmith Village.',
      mainPicture: { medium: 'https://cdn.myanimelist.net/images/anime/1765/135099.jpg', large: 'https://cdn.myanimelist.net/images/anime/1765/135099l.jpg' },
      mediaType: 'tv',
      status: 'finished_airing',
      genres: JSON.stringify(['Action', 'Award Winning', 'Historical', 'Supernatural']),
      studios: JSON.stringify(['ufotable']),
      startDate: '2023-04-09',
      endDate: '2023-06-18',
      mean: '8.86',
      popularity: 16,
      rank: 35,
      relatedAnime: JSON.stringify([]),
      syncedAt: new Date(),
    },
    {
      malId: 57334,
      title: 'Dungeon Meshi',
      titleEn: 'Delicious in Dungeon',
      titleJp: 'ダンジョン飯',
      synopsis: 'When young adventurer Laios and his party are attacked by a dragon deep in a dungeon, his sister Falin is devoured. With their money gone, Laios decides to defeat the dragon using the ingredients found in the dungeon...',
      mainPicture: { medium: 'https://cdn.myanimelist.net/images/anime/1913/141390.jpg', large: 'https://cdn.myanimelist.net/images/anime/1913/141390l.jpg' },
      mediaType: 'tv',
      status: 'finished_airing',
      genres: JSON.stringify(['Adventure', 'Comedy', 'Fantasy']),
      studios: JSON.stringify(['Trigger']),
      startDate: '2024-01-04',
      endDate: '2024-06-27',
      mean: '8.68',
      popularity: 24,
      rank: 93,
      relatedAnime: JSON.stringify([]),
      syncedAt: new Date(),
    },
  ]).onDuplicateKeyUpdate({ set: { syncedAt: new Date() } })

  const allAnime = await db.select().from(anime)
  const frieren = allAnime.find(a => a.malId === 52991)!
  const chainsawMan = allAnime.find(a => a.malId === 44511)!
  const jjk = allAnime.find(a => a.malId === 40748)!
  const dungeon = allAnime.find(a => a.malId === 57334)!

  // ───────────────────────────────────────
  // ARTICLES
  // ───────────────────────────────────────
  console.log('  → articles')
  await db.insert(articles).values([
    {
      userId: adminUser.id,
      categoryId: catSeasonal.id,
      title: 'Panduan Anime Winter 2024: Yang Wajib Kamu Tonton',
      slug: 'panduan-anime-winter-2024',
      excerpt: 'Musim dingin 2024 menjadi salah satu season terkuat dalam beberapa tahun terakhir. Dari Delicious in Dungeon hingga Mashle Season 2, simak daftar lengkapnya di sini.',
      body: '<h2>Winter 2024 — Season Terkuat?</h2><p>Anime musim dingin 2024 menghadirkan lineup yang luar biasa. Di puncak daftar ada <strong>Dungeon Meshi (Delicious in Dungeon)</strong> dari studio Trigger yang langsung meledak sejak episode pertama.</p><h3>Must Watch</h3><ul><li><strong>Dungeon Meshi</strong> — Adventure + kuliner fantasi yang unik</li><li><strong>Mashle: Magic and Muscles S2</strong> — Komedi action yang semakin gila</li><li><strong>Metallic Rouge</strong> — Sci-fi orisinal dari Bones</li></ul><p>Jangan lewatkan satu pun dari daftar ini!</p>',
      status: 'published',
      publishedAt: new Date('2024-01-05'),
    },
    {
      userId: adminUser.id,
      categoryId: catBerita.id,
      title: 'Frieren: Beyond Journey\'s End Raih Anime of the Year di Crunchyroll Awards 2024',
      slug: 'frieren-raih-anime-of-the-year-crunchyroll-2024',
      excerpt: 'Sousou no Frieren berhasil menyapu bersih penghargaan di Crunchyroll Anime Awards 2024, termasuk gelar bergengsi Anime of the Year.',
      body: '<p><strong>Sousou no Frieren</strong> atau <em>Frieren: Beyond Journey\'s End</em> berhasil meraih gelar <strong>Anime of the Year</strong> pada Crunchyroll Anime Awards 2024. Anime garapan Madhouse ini juga memenangkan sejumlah kategori lain termasuk Best Drama dan Best Fantasy.</p><p>Frieren menceritakan seorang penyihir elf yang melakukan perjalanan setelah mengalahkan Demon King, merenungkan makna kehidupan dan perpisahan. Adaptasi manga karya Kanehito Yamada ini mendapat pujian luas atas kedalaman narasinya dan kualitas animasi dari Madhouse.</p>',
      status: 'published',
      publishedAt: new Date('2024-03-10'),
    },
    {
      userId: modUser.id,
      categoryId: catEditorial.id,
      title: 'Mengapa MAPPA Mendominasi Anime Action Modern',
      slug: 'mengapa-mappa-mendominasi-anime-action-modern',
      excerpt: 'Dari Attack on Titan hingga Chainsaw Man dan Jujutsu Kaisen, MAPPA tampil sebagai studio paling konsisten menghadirkan anime action berkualitas tinggi.',
      body: '<p>Dalam kurun waktu kurang dari satu dekade, <strong>MAPPA</strong> telah mengukuhkan dirinya sebagai salah satu studio animasi paling berpengaruh di industri anime modern.</p><h2>Portofolio yang Mengesankan</h2><p>Lihat saja rekam jejaknya: <em>Shingeki no Kyojin Final Season</em>, <em>Jujutsu Kaisen</em>, <em>Chainsaw Man</em>, hingga <em>Hell\'s Paradise</em>. Semua hadir dengan produksi yang memukau dan narasi yang kuat.</p><h2>Tantangan di Balik Layar</h2><p>Namun kesuksesan ini bukan tanpa kontroversi. Banyak laporan terkait kondisi kerja animator yang berat menjadi isu yang tidak bisa diabaikan...</p>',
      status: 'published',
      publishedAt: new Date('2024-02-20'),
    },
    {
      userId: sakura.id,
      categoryId: catReko.id,
      title: '5 Anime Slice of Life Terbaik untuk Relaksasi di Akhir Pekan',
      slug: '5-anime-slice-of-life-terbaik-relaksasi',
      excerpt: 'Lelah setelah seminggu bekerja? Lima anime slice of life ini cocok menemanimu bersantai di akhir pekan.',
      body: '<p>Setelah seminggu penuh tekanan, terkadang kita butuh hiburan yang menenangkan. Anime <em>slice of life</em> hadir untuk kebutuhan itu.</p><ol><li><strong>Frieren: Beyond Journey\'s End</strong> — Perjalanan penuh makna</li><li><strong>Mushishi</strong> — Atmosfer tenang dan misterius</li><li><strong>Non Non Biyori</strong> — Kehidupan pedesaan yang damai</li><li><strong>Barakamon</strong> — Tentang menemukan kembali semangat berkarya</li><li><strong>Yotsuba&!</strong> (manga) — Kepolosan anak kecil yang menghangatkan hati</li></ol>',
      status: 'published',
      publishedAt: new Date('2024-04-01'),
    },
    {
      userId: ryuusei.id,
      categoryId: catBerita.id,
      title: 'Chainsaw Man Season 2 Resmi Diumumkan — Apa yang Perlu Kita Harapkan?',
      slug: 'chainsaw-man-season-2-resmi-diumumkan',
      excerpt: 'MAPPA akhirnya mengumumkan produksi Chainsaw Man Season 2. Arc apa yang akan diadaptasi dan kapan tanggal rilisnya?',
      body: '<p>Para penggemar Chainsaw Man akhirnya mendapat kabar yang ditunggu-tunggu. <strong>MAPPA</strong> secara resmi mengumumkan produksi <strong>Chainsaw Man Season 2</strong>.</p><p>Season kedua kemungkinan besar akan mengadaptasi arc Jusuf yang penuh ketegangan, setelah season pertama menutup arc Public Safety.</p><h2>Yang Perlu Dipersiapkan</h2><p>Bagi yang belum membaca manga, bersiaplah untuk twist yang lebih gila dari sebelumnya. Arc berikutnya membawa karakter-karakter baru yang kompleks dan intensitas yang meningkat drastis.</p>',
      status: 'published',
      publishedAt: new Date('2024-05-15'),
    },
  ]).onDuplicateKeyUpdate({ set: { status: articles.status } })

  const allArticles = await db.select().from(articles)

  // Article tags
  console.log('  → article_tags')
  await db.insert(articleTags).values([
    { articleId: allArticles[0].id, tag: 'winter-2024' },
    { articleId: allArticles[0].id, tag: 'seasonal' },
    { articleId: allArticles[0].id, tag: 'guide' },
    { articleId: allArticles[1].id, tag: 'frieren' },
    { articleId: allArticles[1].id, tag: 'award' },
    { articleId: allArticles[1].id, tag: 'crunchyroll' },
    { articleId: allArticles[2].id, tag: 'mappa' },
    { articleId: allArticles[2].id, tag: 'studio' },
    { articleId: allArticles[2].id, tag: 'editorial' },
    { articleId: allArticles[3].id, tag: 'slice-of-life' },
    { articleId: allArticles[3].id, tag: 'rekomendasi' },
    { articleId: allArticles[4].id, tag: 'chainsaw-man' },
    { articleId: allArticles[4].id, tag: 'mappa' },
    { articleId: allArticles[4].id, tag: 'season-2' },
  ])

  // Article anime relations
  console.log('  → article_anime')
  await db.insert(articleAnime).values([
    { articleId: allArticles[0].id, animeId: dungeon.id },
    { articleId: allArticles[1].id, animeId: frieren.id },
    { articleId: allArticles[2].id, animeId: chainsawMan.id },
    { articleId: allArticles[2].id, animeId: jjk.id },
    { articleId: allArticles[3].id, animeId: frieren.id },
    { articleId: allArticles[4].id, animeId: chainsawMan.id },
  ])

  // ───────────────────────────────────────
  // REVIEWS
  // ───────────────────────────────────────
  console.log('  → reviews')
  await db.insert(reviews).values([
    {
      userId: sakura.id,
      title: 'Frieren: Sebuah Mahakarya tentang Waktu dan Perpisahan',
      slug: 'frieren-review-mahakarya-waktu-dan-perpisahan',
      excerpt: 'Frieren bukan sekadar anime fantasy biasa. Ini adalah renungan mendalam tentang makna hidup, kehilangan, dan bagaimana kita mengingat mereka yang telah pergi.',
      body: '<p>Saat pertama kali mendengar premis <strong>Frieren: Beyond Journey\'s End</strong>, saya mengira ini hanyalah anime fantasy petualangan biasa. Betapa salahnya saya.</p><h2>Narasi yang Mendalam</h2><p>Frieren menceritakan perjalanan seorang elf yang hidup jauh melampaui sahabat-sahabatnya. Konsep ini sederhana, namun pengeksekusiannya luar biasa. Setiap episode terasa seperti membaca prosa yang indah.</p><h2>Animasi Madhouse</h2><p>Studio Madhouse tidak main-main. Setiap frame terasa seperti lukisan. Pertarungan magis divisualisasikan dengan cara yang elegan, jauh dari kekerasan berlebihan.</p><h2>Verdict</h2><p>Frieren adalah anime yang akan kamu kenang bertahun-tahun. Rating: <strong>5/5</strong>.</p>',
      rating: 5,
      spoilerFlag: false,
      status: 'published',
      helpfulCount: 47,
    },
    {
      userId: ryuusei.id,
      title: 'Chainsaw Man vs Jujutsu Kaisen: Dua Raksasa Shounen MAPPA',
      slug: 'chainsaw-man-vs-jujutsu-kaisen-review-perbandingan',
      excerpt: 'Dua anime action terbaik dari MAPPA diadu. Mana yang lebih unggul dari sisi cerita, animasi, dan karakter?',
      body: '<p>MAPPA menghadirkan dua anime action monster dalam waktu berdekatan: <strong>Jujutsu Kaisen</strong> dan <strong>Chainsaw Man</strong>. Sebagai penggemar berat keduanya, izinkan saya memberi perspektif.</p><h2>Cerita</h2><p><em>JJK</em> lebih terstruktur dengan world-building yang solid. <em>Chainsaw Man</em> lebih chaotic tapi punya keberanian naratif yang langka di genre shounen.</p><h2>Animasi</h2><p>Keduanya luar biasa. JJK unggul di fight choreography, CSM unggul di sinematografi dan pilihan warna.</p><h2>Karakter</h2><p>Denji adalah salah satu protagonis shounen paling unik yang pernah ada. Itadori lebih relatable tapi kurang memorable.</p><h2>Kesimpulan</h2><p>Tidak ada pemenang — keduanya wajib tonton dengan alasan berbeda.</p>',
      rating: 5,
      spoilerFlag: false,
      status: 'published',
      helpfulCount: 32,
    },
    {
      userId: sakura.id,
      title: 'Dungeon Meshi: Ketika Makanan dan Petualangan Menjadi Satu',
      slug: 'dungeon-meshi-review-makanan-dan-petualangan',
      excerpt: 'Delicious in Dungeon berhasil membuktikan bahwa konsep memasak monster di dalam dungeon bisa menjadi premis anime yang benar-benar jenius.',
      body: '<p><strong>Dungeon Meshi</strong> atau <em>Delicious in Dungeon</em> adalah bukti nyata bahwa premis yang aneh sekalipun bisa menjadi anime luar biasa jika dieksekusi dengan benar.</p><h2>Konsep Segar</h2><p>Siapa yang pernah berpikir bahwa "memasak dan memakan monster dungeon" bisa jadi plot utama yang menarik? Ryoko Kui ternyata bisa, dan hasilnya menakjubkan.</p><h2>Karakter yang Kuat</h2><p>Laios, Marcille, Chilchuck, dan Senshi adalah ensemble yang sempurna. Dinamika mereka terasa natural dan menghibur.</p><h2>Studio Trigger</h2><p>Trigger menghadirkan animasi yang colorful dan ekspresif, sangat cocok dengan tone komedi petualangan manga aslinya.</p>',
      rating: 4,
      spoilerFlag: false,
      status: 'published',
      helpfulCount: 28,
    },
  ]).onDuplicateKeyUpdate({ set: { status: reviews.status } })

  const allReviews = await db.select().from(reviews)

  // Review anime relations
  console.log('  → review_anime')
  await db.insert(reviewAnime).values([
    { reviewId: allReviews[0].id, animeId: frieren.id },
    { reviewId: allReviews[1].id, animeId: chainsawMan.id },
    { reviewId: allReviews[1].id, animeId: jjk.id },
    { reviewId: allReviews[2].id, animeId: dungeon.id },
  ])

  // ───────────────────────────────────────
  // FORUM THREADS + POSTS
  // ───────────────────────────────────────
  console.log('  → forum_threads')
  await db.insert(forumThreads).values([
    {
      userId: adminUser.id,
      forumCategoryId: fcAnime.id,
      title: 'Official Discussion: Sousou no Frieren',
      slug: 'official-discussion-sousou-no-frieren',
      isPinned: true,
      isLocked: false,
      viewCount: 1240,
      replyCount: 3,
      lastActivityAt: new Date('2024-04-10'),
    },
    {
      userId: ryuusei.id,
      forumCategoryId: fcSeasonal.id,
      title: '[Winter 2024] Anime Season — Share Your Impressions!',
      slug: 'winter-2024-anime-season-share-impressions',
      isPinned: false,
      isLocked: false,
      viewCount: 873,
      replyCount: 4,
      lastActivityAt: new Date('2024-04-08'),
    },
    {
      userId: sakura.id,
      forumCategoryId: fcReko.id,
      title: 'Rekomendasi anime mirip Frieren yang bikin nangis',
      slug: 'rekomendasi-anime-mirip-frieren-bikin-nangis',
      isPinned: false,
      isLocked: false,
      viewCount: 562,
      replyCount: 3,
      lastActivityAt: new Date('2024-04-05'),
    },
    {
      userId: modUser.id,
      forumCategoryId: fcNewsTalk.id,
      title: 'MAPPA Umumkan Lineup 2025 — Apa yang Paling Ditunggu?',
      slug: 'mappa-umumkan-lineup-2025',
      isPinned: false,
      isLocked: false,
      viewCount: 421,
      replyCount: 3,
      lastActivityAt: new Date('2024-04-12'),
    },
  ]).onDuplicateKeyUpdate({ set: { viewCount: forumThreads.viewCount } })

  const allThreads = await db.select().from(forumThreads)
  const threadFrieren = allThreads.find(t => t.slug === 'official-discussion-sousou-no-frieren')!
  const threadWinter = allThreads.find(t => t.slug === 'winter-2024-anime-season-share-impressions')!
  const threadReko = allThreads.find(t => t.slug === 'rekomendasi-anime-mirip-frieren-bikin-nangis')!
  const threadMappa = allThreads.find(t => t.slug === 'mappa-umumkan-lineup-2025')!

  console.log('  → forum_posts')
  await db.insert(forumPosts).values([
    // Thread Frieren
    {
      threadId: threadFrieren.id,
      userId: adminUser.id,
      body: 'Thread diskusi resmi untuk Sousou no Frieren. Silakan share pendapatmu tentang episode, karakter, teori, atau apapun yang berkaitan dengan anime ini. Harap hindari spoiler tanpa tag!',
      isFirstPost: true,
    },
    {
      threadId: threadFrieren.id,
      userId: sakura.id,
      body: 'Episode 28 literally made me sob. Adegan Frieren mengingat Himmel di depan makamnya adalah salah satu scene paling emosional yang pernah saya tonton dalam anime. Madhouse benar-benar tidak main-main.',
      isFirstPost: false,
      upvoteCount: 23,
    },
    {
      threadId: threadFrieren.id,
      userId: ryuusei.id,
      body: 'Yang bikin Frieren beda dari isekai biasa adalah pendekatannya yang post-adventure. Kita tidak ikut perjalanan heroik-nya, tapi aftermath-nya. Itu yang membuat emotional impact-nya jauh lebih kuat.',
      isFirstPost: false,
      upvoteCount: 18,
    },
    // Thread Winter 2024
    {
      threadId: threadWinter.id,
      userId: ryuusei.id,
      body: 'Winter 2024 lineup: Dungeon Meshi, Mashle S2, Metallic Rouge, Solo Leveling. Mana yang paling kamu tunggu? Personally saya sudah hype banget sama Dungeon Meshi setelah baca manganya.',
      isFirstPost: true,
    },
    {
      threadId: threadWinter.id,
      userId: sakura.id,
      body: 'Dungeon Meshi ep 1 sudah membuktikan bahwa hype-nya justified. Studio Trigger literally perfect buat source material ini. Character design Laios dan kawan-kawan akurat banget!',
      isFirstPost: false,
      upvoteCount: 15,
    },
    {
      threadId: threadWinter.id,
      userId: modUser.id,
      body: 'Solo Leveling sebagai adaptasi manhwa pertama yang besar menarik buat diikuti. A-1 Pictures kelihatannya serius garap ini. Opening song-nya juga banger.',
      isFirstPost: false,
      upvoteCount: 12,
    },
    // Thread Rekomendasi
    {
      threadId: threadReko.id,
      userId: sakura.id,
      body: 'Abis nonton Frieren dan ngerasa kosong? Saya juga! Coba Mushishi — vibes-nya beda tapi sama-sama punya kedalaman emosional yang luar biasa. Seri yang sangat underrated.',
      isFirstPost: true,
    },
    {
      threadId: threadReko.id,
      userId: ryuusei.id,
      body: 'Kalau mau yang masih ada elemen adventure-nya: Spice and Wolf. Nuansa medieval fantasy, karakter yang kompleks, dialog yang cerdas. Remake-nya juga bagus!',
      isFirstPost: false,
      upvoteCount: 9,
    },
    // Thread MAPPA
    {
      threadId: threadMappa.id,
      userId: modUser.id,
      body: 'MAPPA mengumumkan beberapa proyek besar untuk 2025 termasuk Chainsaw Man arc baru dan kemungkinan proyek orisinal. Yang mana yang paling kalian tunggu?',
      isFirstPost: true,
    },
    {
      threadId: threadMappa.id,
      userId: ryuusei.id,
      body: 'Chainsaw Man arc Jusuf. Saya sudah baca sampai sana di manga dan kalau MAPPA garap dengan serius, itu bakal jadi salah satu anime paling disturbing sekaligus brilliant yang pernah ada.',
      isFirstPost: false,
      upvoteCount: 14,
    },
  ])

  console.log('\n✅ Seeding selesai!')
  console.log('\nAkun yang bisa digunakan:')
  console.log('  Admin   : admin@aniverse.id / password123')
  console.log('  Mod     : mod@aniverse.id / password123')
  console.log('  Member  : sakura@aniverse.id / password123')
  console.log('  Member  : ryuusei@aniverse.id / password123')

  await pool.end()
  process.exit(0)
}

main().catch((e) => {
  console.error('❌ Seeding gagal:', e)
  process.exit(1)
})
