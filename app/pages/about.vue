<template>
  <div class="min-h-screen" style="background: var(--bg-base); color: var(--text-primary);">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-24">
      <div class="mb-12">
        <span class="text-[#7c3aed] text-xs font-bold tracking-[0.25em] uppercase">Tentang Kami</span>
        <h1 class="text-4xl md:text-5xl font-black tracking-tight mt-4 mb-6" style="color: var(--text-primary);">
          Apa itu <span class="text-[#8b5cf6]">Ani</span>Verse?
        </h1>
        <p class="text-lg leading-relaxed" style="color: var(--text-secondary);">
          AniVerse adalah platform media anime &amp; manga berbahasa Indonesia — tempat kamu membaca berita terkini,
          menulis review mendalam, dan berdiskusi bersama komunitas yang aktif.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div class="p-6 rounded-2xl border" style="background: var(--bg-card); border-color: var(--border-subtle);">
          <div class="text-3xl font-black text-[#8b5cf6] mb-1">50+</div>
          <div class="text-sm" style="color: var(--text-muted);">Artikel dipublikasikan</div>
        </div>
        <div class="p-6 rounded-2xl border" style="background: var(--bg-card); border-color: var(--border-subtle);">
          <div class="text-3xl font-black text-[#8b5cf6] mb-1">120+</div>
          <div class="text-sm" style="color: var(--text-muted);">Review komunitas</div>
        </div>
        <div class="p-6 rounded-2xl border" style="background: var(--bg-card); border-color: var(--border-subtle);">
          <div class="text-3xl font-black text-[#8b5cf6] mb-1">300+</div>
          <div class="text-sm" style="color: var(--text-muted);">Thread diskusi aktif</div>
        </div>
      </div>

      <div class="space-y-8 leading-relaxed" style="color: var(--text-secondary);">
        <p>
          Kami percaya bahwa anime dan manga bukan sekadar hiburan — melainkan medium seni yang layak dibahas secara serius,
          dengan perspektif lokal yang otentik.
        </p>
        <p>
          AniVerse dibangun oleh penggemar anime Indonesia, untuk penggemar anime Indonesia.
          Bergabunglah, tulis opinimu, dan jadilah bagian dari komunitas yang terus berkembang.
        </p>
      </div>

      <div class="mt-16">
        <NuxtLink
          to="/auth/register"
          class="inline-flex items-center gap-2 px-8 py-3.5 bg-[#7c3aed] hover:bg-[#8b5cf6] text-white rounded-full font-semibold transition-all duration-300"
        >
          Bergabung Sekarang
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
