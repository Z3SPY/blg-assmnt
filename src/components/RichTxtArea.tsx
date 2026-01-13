import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown'
import { RichButton } from './RichButton'



const RichTxtArea = () => {
  
  Markdown.configure({
  indentation: {
    style: 'space', // 'space' or 'tab'
    size: 5, // Number of spaces or tabs
  },
})

  // Tip Tap Handler
  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    content: '# Hello World\n\nThis is **Markdown**!',
    contentType: 'markdown'
  })

  if (!editor) {
    return null 
  }

  return (
    <div>
      {/* Toolbar with buttons */}
      <div style={{ marginBottom: '10px' }}>
        <RichButton isActive={(format) => editor.isActive(format)} 
                    onClick={() => editor.chain().focus().toggleBold().run()} > B </RichButton>
        <RichButton isActive={(format) => editor.isActive(format)} 
                    onClick={() => editor.chain().focus().toggleItalic().run()}> I</RichButton>
        <RichButton isActive={(format) => editor.isActive(format)} 
                    onClick={() => editor.chain().focus().toggleUnderline().run()}> U </RichButton>

   
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}

export default RichTxtArea