import type { BlogType } from '@/types/stateTypes'
import { ImageOff } from 'lucide-react';
import React from 'react'
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';


interface CardProps {
    blog: BlogType;
}

export function Card({blog}: CardProps) {
    const navigate = useNavigate();

    const preview = (blog.content ?? "")
                    .replace(/\s*\n+\s*/g, " ")
                    .trim().substring(0, 150) + "...";

    const parsedTime = new Date(blog.created_at!).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })

    const parsedTitle = blog.title ? ( blog.title.length > 50 ? (blog.title).charAt(0).toUpperCase()  + blog.title.substring(1,50) +  "..."
                                    : (blog.title).charAt(0).toUpperCase() + (blog.title)?.slice(1)
    )  : "Untitled"
    
    

    return (
        <div key={blog.id} className="transition-all hover:translate-y-[5px] hover:bg-neutral-200 cursor-pointer
                                        min-h-[300px]bg-white border rounded-md shadow-sm p-4" onClick={()=>navigate(`/blog/${blog.id}`)}>
            {/** This is image loc */}
            <div className="w-full h-40 bg-neutral-200 flex items-center justify-center overflow-hidden">
                {blog.cover_path ? (
                    <img 
                        src={blog.cover_path} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-neutral-400">
                        <ImageOff size={32} />
                        <span className="text-xs mt-2">No image</span>
                    </div>
                )}
            </div>

            {/** This is text loc */}
            <h4 className="font-bold text-[1.75rem]">{parsedTitle}</h4>
            <p className='border-b-2 border-neutral-300 text-opacity-50 italic text-black '> {parsedTime}</p>
            <ReactMarkdown>{preview}</ReactMarkdown>
        </div>
    )
}

export default Card
