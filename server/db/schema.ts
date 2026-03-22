import {
  mysqlTable,
  int,
  varchar,
  text,
  longtext,
  timestamp,
  json,
  boolean,
  tinyint,
  decimal,
  mysqlEnum,
  unique,
} from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['guest', 'member', 'moderator', 'admin']).notNull().default('member'),
  avatar: varchar('avatar', { length: 500 }),
  bio: text('bio'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
})

export const profiles = mysqlTable('profiles', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  displayName: varchar('display_name', { length: 100 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  bio: text('bio'),
  socialLinks: json('social_links'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const anime = mysqlTable('anime', {
  id: int('id').primaryKey().autoincrement(),
  malId: int('mal_id').notNull().unique(),
  title: varchar('title', { length: 500 }).notNull(),
  titleEn: varchar('title_en', { length: 500 }),
  titleJp: varchar('title_jp', { length: 500 }),
  synopsis: text('synopsis'),
  mainPicture: json('main_picture'),
  mediaType: varchar('media_type', { length: 50 }),
  status: varchar('status', { length: 50 }),
  genres: json('genres'),
  studios: json('studios'),
  startDate: varchar('start_date', { length: 20 }),
  endDate: varchar('end_date', { length: 20 }),
  mean: decimal('mean', { precision: 4, scale: 2 }),
  popularity: int('popularity'),
  rank: int('rank'),
  relatedAnime: json('related_anime'),
  syncedAt: timestamp('synced_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const manga = mysqlTable('manga', {
  id: int('id').primaryKey().autoincrement(),
  malId: int('mal_id').notNull().unique(),
  title: varchar('title', { length: 500 }).notNull(),
  titleEn: varchar('title_en', { length: 500 }),
  titleJp: varchar('title_jp', { length: 500 }),
  synopsis: text('synopsis'),
  mainPicture: json('main_picture'),
  mediaType: varchar('media_type', { length: 50 }),
  status: varchar('status', { length: 50 }),
  genres: json('genres'),
  authors: json('authors'),
  startDate: varchar('start_date', { length: 20 }),
  endDate: varchar('end_date', { length: 20 }),
  mean: decimal('mean', { precision: 4, scale: 2 }),
  popularity: int('popularity'),
  rank: int('rank'),
  syncedAt: timestamp('synced_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const articleCategories = mysqlTable('article_categories', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const articles = mysqlTable('articles', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  categoryId: int('category_id').references(() => articleCategories.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 600 }).notNull().unique(),
  excerpt: text('excerpt'),
  body: longtext('body'),
  coverImage: varchar('cover_image', { length: 500 }),
  status: mysqlEnum('status', ['draft', 'published']).notNull().default('draft'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
})

export const articleTags = mysqlTable('article_tags', {
  id: int('id').primaryKey().autoincrement(),
  articleId: int('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  tag: varchar('tag', { length: 100 }).notNull(),
})

export const articleAnime = mysqlTable('article_anime', {
  id: int('id').primaryKey().autoincrement(),
  articleId: int('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  animeId: int('anime_id').notNull().references(() => anime.id, { onDelete: 'cascade' }),
})

export const reviews = mysqlTable('reviews', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 600 }).notNull().unique(),
  excerpt: text('excerpt'),
  body: longtext('body'),
  rating: tinyint('rating').notNull(),
  spoilerFlag: boolean('spoiler_flag').notNull().default(false),
  status: mysqlEnum('status', ['draft', 'published']).notNull().default('draft'),
  helpfulCount: int('helpful_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
})

export const reviewAnime = mysqlTable('review_anime', {
  id: int('id').primaryKey().autoincrement(),
  reviewId: int('review_id').notNull().references(() => reviews.id, { onDelete: 'cascade' }),
  animeId: int('anime_id').notNull().references(() => anime.id, { onDelete: 'cascade' }),
})

export const forumCategories = mysqlTable('forum_categories', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  order: int('order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const forumThreads = mysqlTable('forum_threads', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  forumCategoryId: int('forum_category_id').notNull().references(() => forumCategories.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 600 }).notNull().unique(),
  isPinned: boolean('is_pinned').notNull().default(false),
  isLocked: boolean('is_locked').notNull().default(false),
  viewCount: int('view_count').notNull().default(0),
  replyCount: int('reply_count').notNull().default(0),
  lastActivityAt: timestamp('last_activity_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const forumPosts = mysqlTable('forum_posts', {
  id: int('id').primaryKey().autoincrement(),
  threadId: int('thread_id').notNull().references(() => forumThreads.id, { onDelete: 'cascade' }),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  body: text('body').notNull(),
  isFirstPost: boolean('is_first_post').notNull().default(false),
  upvoteCount: int('upvote_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
})

export const forumThreadAnime = mysqlTable('forum_thread_anime', {
  id: int('id').primaryKey().autoincrement(),
  threadId: int('thread_id').notNull().references(() => forumThreads.id, { onDelete: 'cascade' }),
  animeId: int('anime_id').notNull().references(() => anime.id, { onDelete: 'cascade' }),
})

export const comments = mysqlTable('comments', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  commentableType: varchar('commentable_type', { length: 50 }).notNull(),
  commentableId: int('commentable_id').notNull(),
  parentId: int('parent_id'),
  body: text('body').notNull(),
  status: mysqlEnum('status', ['visible', 'hidden', 'deleted']).notNull().default('visible'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
})

export const commentReactions = mysqlTable('comment_reactions', {
  id: int('id').primaryKey().autoincrement(),
  commentId: int('comment_id').notNull().references(() => comments.id, { onDelete: 'cascade' }),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  reactionType: varchar('reaction_type', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => ({
  uniqueReaction: unique('unique_reaction').on(t.commentId, t.userId),
}))

export const notifications = mysqlTable('notifications', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(),
  data: json('data'),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const bookmarks = mysqlTable('bookmarks', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  bookmarkableType: varchar('bookmarkable_type', { length: 50 }).notNull(),
  bookmarkableId: int('bookmarkable_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => ({
  uniqueBookmark: unique('unique_bookmark').on(t.userId, t.bookmarkableType, t.bookmarkableId),
}))

export const reports = mysqlTable('reports', {
  id: int('id').primaryKey().autoincrement(),
  reporterId: int('reporter_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  reportableType: varchar('reportable_type', { length: 50 }).notNull(),
  reportableId: int('reportable_id').notNull(),
  reason: text('reason').notNull(),
  status: mysqlEnum('status', ['pending', 'reviewed', 'dismissed']).notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const malConnections = mysqlTable('mal_connections', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  malUserId: int('mal_user_id'),
  malUsername: varchar('mal_username', { length: 100 }),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
})

export const moderationLogs = mysqlTable('moderation_logs', {
  id: int('id').primaryKey().autoincrement(),
  moderatorId: int('moderator_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: varchar('action', { length: 100 }).notNull(),
  targetType: varchar('target_type', { length: 50 }).notNull(),
  targetId: int('target_id').notNull(),
  reason: text('reason'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
