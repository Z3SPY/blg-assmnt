
import type { CommentType } from '@/types/stateTypes'
import React, { useRef, useState } from 'react'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ImagePlus, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { commentRepository } from '@/repositories/CommentRepository';

interface CommentProps {
  comment: CommentType;
  userId?: string;  

  onUpdate: (id: string, content: string, file: File) => void;
  onDelete: (id: string) => void;

}

function Comment({ comment, userId, onUpdate, onDelete}: CommentProps) {

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [localFile, setLocalFile] = useState<File | null>(null);

    const c = comment
    console.log("Comment: ", c.id);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
    
        if (file) {
            
            setLocalFile(file);
        }
    };
    

    const handleSave = async () => {
    try {
        await onUpdate(comment.id, editContent, localFile);
        setIsEditing(false);
        setLocalFile(null); 
    } catch (err) {
        console.error("Save failed", err);
    }
};
    
    const toggleEdit = () => {
        setIsEditing((prev) => !prev);
        if (isEditing) setEditContent(comment.content);
    };

    return (
        <div key={c.id} className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
            <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm">{c.username}</span>
                <div className="text-xs text-neutral-400 flex items-center ">
                    { c.user_id === userId ?  
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-neutral-200">
                                <MoreVertical size={14} />
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-32 p-1" align="end">
                            <Button 
                                variant="ghost" 
                                className="w-full justify-start h-8 text-xs font-normal"
                                onClick={() => toggleEdit()}
                            >
                                <Pencil size={12} className="mr-2" /> Edit
                            </Button>
                            <Button 
                                variant="ghost" 
                                className="w-full justify-start h-8 text-xs font-normal text-destructive hover:text-destructive"
                                onClick={() => onDelete(comment.id)}
                            >
                                <Trash2 size={12} className="mr-2" /> Delete
                            </Button>
                            </PopoverContent>
                        </Popover>

                        : <></> 
                    }
                    
                    <span>
                    {new Date(c.created_at).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/** EDIT TOGGLE */}
            {isEditing ? (
                <div className="mt-2 space-y-2">
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                    />

                    <Button 
                        variant="outline" 
                        size="icon" 
                        type="button"
                        className="shrink-0 border-neutral-900"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <ImagePlus size={18} />
                    </Button>
                    <textarea 
                        className="w-full border rounded-md p-2 text-sm text-neutral-700 outline-none focus:ring-2 focus:ring-blue-500"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        autoFocus
                    />
                    <div className="flex gap-2">
                        <Button size="sm" className="h-7 text-xs" onClick={handleSave}>
                            Save
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <>

                    {/** Show me an Image OR ELSE !!! none */}
                    {c.image_url && (
                        <div className="mt-3 overflow-hidden mb-10 border-neutral-200">
                            <img 
                            src={c.image_url} 
                            alt="Attachment" 
                            className="max-h-[300px] w-auto object-contain cursor-zoom-in"
                            onClick={() => window.open(c.image_url, '_blank')} 
                            />
                        </div>
                    )}
                    <p className="text-neutral-700 text-sm whitespace-pre-wrap">{c.content}</p>
                </>

            )}
        </div>
    )
}

export default Comment
