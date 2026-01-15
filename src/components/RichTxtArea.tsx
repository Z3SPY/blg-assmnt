import { Editor, EditorContent } from '@tiptap/react'
import { RichButton } from './RichButton'
import { useRef, useState } from 'react'
import { Bold, List , Heading2, Heading1, Italic, Underline  } from 'lucide-react';


type Props = {
  editor: Editor
  isEditing: boolean
}

function RichTxtArea({ editor, isEditing }: Props) {
  if (!editor) return null

  return (
    <div className={`border-2 rounded-md ${isEditing ? 'border-neutral-600 px-5' : 'border-none'} pb-5 py-3 w-full`}>
      

      {/* EDITOR BUTTONS FROM TIP TAP */}
      <div className={`${isEditing ? '' : 'hidden'} mb-3`}>
        <RichButton isActive={() => editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={22} />
        </RichButton>

        <RichButton isActive={() => editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={22} />
        </RichButton>

        <RichButton isActive={() => editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <Underline size={22} />
        </RichButton>

        <RichButton isActive={() => editor.isActive('heading', { level: 1})}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            <Heading1  size={22} />
        </RichButton>

        <RichButton isActive={() => editor.isActive('heading', { level: 2})}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2  size={22} />
        </RichButton>

        
      </div>

      {/* MAIN TIP TAP TEXT AREA */}
      <div className={`border-2 ${isEditing ? 'border-neutral-600' : 'border-none'} rounded-md bg-white p-3 min-h-[300px]`}>
        <EditorContent
          editor={editor}
          className="focus:outline-none min-h-[300px]"
        />
      </div>
    </div>
  )
}

export default RichTxtArea