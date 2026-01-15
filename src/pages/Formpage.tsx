import React, { useEffect, useRef, useState, type ReactEventHandler } from 'react'
import RichTxtArea from '../components/RichTxtArea'

import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Markdown } from '@tiptap/markdown'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { TableKit } from '@tiptap/extension-table'
import type { RootState } from '@/state/store'

import "./css/Formpage.css";
import { Button } from '@/components/ui/button'
import { Navbar01 } from '@/components/ui/shadcn-io/navbar-01'
import BlogFooter from '@/components/Footer'


import { blogRepository } from '@/repositories/BlogRepository'
import { supabase } from '@/lib/supabase'
import type { BlogType } from '@/types/stateTypes'

function Formpage() {

  // Base Variables

  const navigate = useNavigate()
  const { userName, userId } = useSelector((state: RootState) => state.session)


  // Session Checker?
  useEffect(() => {
    if (!userId) navigate('/login')
  }, [userId, navigate])

  const [blogTitle, setBlogTitle] = useState('')
  const [isEditing, setIsEditing] = useState(false)


  // =============================================
  // File Upload SECTION
  const [fileIsLoading, setFileIsLoading] = useState(false);
  const [coverPath, setCoverPath] = useState<string | null>(null); // Chekjker 4 if we already have a loaded photo
  const file = useRef<HTMLInputElement>(null);
  const file2Upload = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TableKit,
      Markdown
    ],
    content: `

# Hello World

This is **Markdown**!

You can add more images:`,
    contentType: 'markdown',
    editable: isEditing,
  })

  useEffect(() => {
    if (editor) editor.setOptions({ editable: isEditing })
  }, [isEditing, editor])

  if (!editor) return null

  const handleSave = () => {
    const markdown = editor.getMarkdown()
    handleBlogUpload(markdown);
    //console.log('MARKDOWN:', markdown)
  }



  // Main Picture Uplaod    
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCoverSetUp = async ( e : any) => {
    const Max_Upload = 5 * 1024 * 1024;
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return; // null check

    console.log("SIZE: ", (selectedFile.size / (1024 * 1024)).toFixed(5)); // AS MB READER
    // Check the size!! It needs to be lower than 50mb for the Supbase free tier
    // NOTE: THIS LOGIC IS THE OPPOSITE REJECTS ALL GREATER THAN MB
    if (selectedFile.size > Max_Upload) {
        alert("File size too big, try to maintain within 50mb")
        return; 
    }

    // Others wise try to set a local upload
    try {
        setFileIsLoading(true);

        file2Upload.current = selectedFile;


        // We create some local url instance, for frontend only
        const localUrl = URL.createObjectURL(selectedFile);
        console.log(localUrl);
        setCoverPath(localUrl);

    } catch (error) {
        console.log("ERROR UPLOAD: ", error);
    } 
    finally {
        setFileIsLoading(false)
    }

  }


  // Blog Upload 
  const handleBlogUpload = async (markdown: string) => {
    // Do some data validation here for later, i might forget
    if (!blogTitle || !editor) {
        alert("Missing Values in Blog Instance");
        return;
    }

    try {
        

        setFileIsLoading(true);


        // Check if file2Upload is available
        if (file2Upload.current) {
            const file : File = file2Upload.current;
            
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData.user) throw new Error("User not authenticated");

            if (!userId) return;

            const newBlog: BlogType = {
                user_id: userData.user.id,
                title: blogTitle,
                content: markdown,
            };
            
            const data = blogRepository.createBlog( newBlog,file)

 
            console.log("New Blog Created", (await data).title);
            


        }

    } catch (error) {
        console.log("UPLOAD ERROR", error);
        alert("Upload Error");
    } finally {
        setFileIsLoading(false);
        navigate("/"); // after we then we navigate home
    }
  } 


  return (
    <>
    <div className='h-screen overflow-y-auto overflow-x-hidden '>
        <Navbar01 
            onSignInClick={() => {}} 
            onCtaClick={() => {}} 
            onCreateClick={() => {}}
            userIdSession = {userId}    
            onLogoClick={() => navigate("/")}

            wherePage = {"Forms"}
        />


        <div className="mx-5 md:mx-32 my-10 flex flex-col gap-3">
        
        <h1 className='text-[2rem] md:text-[3rem] font-bold'> Let's Start Blogging</h1>


        <input 
            type="file" 
            ref={file} 
            className="hidden" 
            accept="image/*" 
            onChange={handleCoverSetUp} 
        />

        <div 
            onClick={() => !fileIsLoading && file.current?.click()}
            className='relative bg-neutral-900 rounded-lg max-w-[200px] md:max-w-[300px] h-[7.5rem] flex flex-col justify-center items-center text-white shadow-black shadow-md cursor-pointer font-bold transition-all hover:translate-y-[1px] hover:bg-neutral-800 overflow-hidden'
        >
            {coverPath ? (
                <>
                    <img 
                        src={coverPath} 
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                        alt="Cover" 
                    />
                    <span className="relative z-10 text-xs drop-shadow-lg">Change Photo+</span>
                </>
            ) : (
                <span className="px-4 text-center">
                    {fileIsLoading ? "Uploading..." : "Add A Cover Photo +"}
                </span>
            )}
        </div>
        

        <div className="flex gap-2">
            <Button onClick={() => setIsEditing((s) => !s)} className='transition-all hover:translate-y-[5px] hover:bg-neutral-600'>
            {isEditing ? 'Preview' : 'Edit'}
            </Button>

            <Button onClick={handleSave} className='transition-all hover:translate-y-[5px] hover:bg-neutral-600'>
            Save Your Work
            </Button>
        </div>
        
        <div className="flex flex-col">
            <input
            className={`p-1 transition-all ${
                !isEditing 
                ? 'text-4xl font-bold border-b-2 border-neutral-300 bg-transparent outline-none' 
                : 'border-2 w-52 rounded-md border-neutral-600'
            }`}
            placeholder="Blog title"
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            readOnly={!isEditing}
            />


            {!isEditing && (
            <p className="text-sm text-neutral-600 mt-2">By {userName}</p>
            )}
        </div>

        <RichTxtArea editor={editor} isEditing={isEditing} />
        </div>

    </div>
    <BlogFooter />
    </>
    
  )
}

export default Formpage
