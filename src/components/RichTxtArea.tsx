import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'


interface ButtonStyles {
    onClick: () => void;
    isActive: (format: string) => boolean;
    children?: React.ReactNode;
}

const RichButton = (btnStyles : ButtonStyles) => {
    return (
        <button className={`px-3 py-2 mr-1 border border-gray-300 cursor-pointer ${
            btnStyles.isActive('bold') ? 
            'bg-gray-200 font-bold' : 
            'bg-white font-normal'}`}  
            
            onClick={(e) => {
                e.preventDefault();
                btnStyles.onClick();
            }}>
            {btnStyles.children}

        </button>
    )
}

const RichTxtArea = () => {
    
    const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World!</p>',
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