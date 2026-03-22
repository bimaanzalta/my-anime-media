<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

const props = defineProps<{ modelValue: string; placeholder?: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const editor = useEditor({
  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder: props.placeholder || 'Tulis konten di sini...' }),
  ],
  content: props.modelValue,
  editorProps: {
    attributes: { class: 'prose-anime max-w-none focus:outline-none min-h-[300px] p-4' },
  },
  onUpdate: ({ editor }) => emit('update:modelValue', editor.getHTML()),
})

watch(() => props.modelValue, (val) => {
  if (editor.value && editor.value.getHTML() !== val) {
    editor.value.commands.setContent(val, false)
  }
})

onBeforeUnmount(() => editor.value?.destroy())
</script>

<template>
  <div class="rounded-xl border overflow-hidden" style="background: var(--bg-surface); border-color: var(--border-color);">
    <!-- Toolbar -->
    <div class="flex flex-wrap gap-1 p-2 border-b" style="background: var(--bg-card); border-color: var(--border-color);">
      <button
        type="button"
        @click="editor?.chain().focus().toggleBold().run()"
        :class="editor?.isActive('bold') ? 'bg-violet-600 text-white' : ''"
        class="px-2 py-1 rounded text-sm font-bold transition toolbar-btn"
        style="color: var(--text-primary);"
      >B</button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleItalic().run()"
        :class="editor?.isActive('italic') ? 'bg-violet-600 text-white' : ''"
        class="px-2 py-1 rounded text-sm italic transition toolbar-btn"
        style="color: var(--text-primary);"
      >I</button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="editor?.isActive('heading', { level: 2 }) ? 'bg-violet-600 text-white' : ''"
        class="px-2 py-1 rounded text-xs transition toolbar-btn"
        style="color: var(--text-primary);"
      >H2</button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="editor?.isActive('heading', { level: 3 }) ? 'bg-violet-600 text-white' : ''"
        class="px-2 py-1 rounded text-xs transition toolbar-btn"
        style="color: var(--text-primary);"
      >H3</button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleBulletList().run()"
        :class="editor?.isActive('bulletList') ? 'bg-violet-600 text-white' : ''"
        class="px-2 py-1 rounded text-sm transition toolbar-btn"
        style="color: var(--text-primary);"
      >• List</button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleOrderedList().run()"
        :class="editor?.isActive('orderedList') ? 'bg-violet-600 text-white' : ''"
        class="px-2 py-1 rounded text-sm transition toolbar-btn"
        style="color: var(--text-primary);"
      >1. List</button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleBlockquote().run()"
        :class="editor?.isActive('blockquote') ? 'bg-violet-600 text-white' : ''"
        class="px-2 py-1 rounded text-sm transition toolbar-btn"
        style="color: var(--text-primary);"
      >&ldquo; Quote</button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleCodeBlock().run()"
        :class="editor?.isActive('codeBlock') ? 'bg-violet-600 text-white' : ''"
        class="px-2 py-1 rounded text-sm transition toolbar-btn font-mono"
        style="color: var(--text-primary);"
      >Code</button>
      <button
        type="button"
        @click="editor?.chain().focus().setHorizontalRule().run()"
        class="px-2 py-1 rounded text-sm transition toolbar-btn"
        style="color: var(--text-primary);"
      >&#8212;</button>
      <button
        type="button"
        @click="editor?.chain().focus().undo().run()"
        class="px-2 py-1 rounded text-sm transition toolbar-btn ml-auto"
        style="color: var(--text-primary);"
      >&#8617;</button>
      <button
        type="button"
        @click="editor?.chain().focus().redo().run()"
        class="px-2 py-1 rounded text-sm transition toolbar-btn"
        style="color: var(--text-primary);"
      >&#8618;</button>
    </div>
    <EditorContent :editor="editor" />
  </div>
</template>

<style scoped>
.toolbar-btn {
  cursor: pointer;
}
.toolbar-btn:hover:not(.bg-violet-600) {
  background: var(--hover-bg);
}
</style>
