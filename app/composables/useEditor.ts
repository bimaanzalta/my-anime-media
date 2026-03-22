import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

export function useTipTap(options?: { placeholder?: string; content?: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: options?.placeholder || 'Tulis di sini...' }),
    ],
    content: options?.content || '',
    editorProps: {
      attributes: { class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3' },
    },
  })

  onBeforeUnmount(() => editor.value?.destroy())

  return editor
}
