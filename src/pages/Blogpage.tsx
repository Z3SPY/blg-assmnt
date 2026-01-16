import BlogFooter from '@/components/Footer';
import { Navbar01 } from '@/components/ui/shadcn-io/navbar-01';
import { blogRepository } from '@/repositories/BlogRepository';
import { userRepositry } from '@/repositories/UserRepository';
import type { RootState } from '@/state/store';
import type { BlogType, commentPayload, ProfileType } from '@/types/stateTypes';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { commentRepository } from '@/repositories/CommentRepository';
import Comment from '@/components/Comment';
import { ImagePlus, Loader, Loader2, X } from 'lucide-react';


function Blogpage() {

    // Get Id from use Params
    const { id } = useParams();
    const navigate = useNavigate();

    const {userName, userId} = useSelector((state: RootState) => state.session)
    const [isLoading, setIsLoading] = useState(false);
    const isOwnProfile = useRef(false);

    // Blog Content
    const [blogContent, setBlogContent] = useState<BlogType | null>(null);
    const [authorContent, setAuthorData] = useState<ProfileType | null>(null);


    // Comment Holder
    const [comments, setComments] = useState([]);
    const [myComment, setMyComment] = useState("");
    
    
    useEffect(() => {
            // cant access no id
            if (!id) {
                alert("Invalid Session Id Redirecting to home");
                navigate("/");
                return;
            }
    
            const fetchProfileData = async () => {
                try {
                    setIsLoading(true);
                    {/** NOTE THIS IS BLOG ID NOT USER ID */}
                    const blogData = await blogRepository.getBlogById(id!);
                    if (!blogData) throw new Error("Blog not found");

                    const authorData = await userRepositry.getUserById(blogData.user_id);
                    const commentData = await commentRepository.getCommentsByBlogId(id);
                    
                    //Ownership
                    isOwnProfile.current = blogData.user_id === userId;
                    
                    setBlogContent(blogData);
                    setAuthorData(authorData)
                    setComments(commentData);
    
                   
                } catch (error) {
                                
                    console.error("Error fetching profile:", error);
                    navigate("/");
                } finally {
                    setIsLoading(false);
                }
            };
    
            fetchProfileData();
    
    
        }, [id, navigate, userId])

    //BLOG HANDLES
    const HandleDelete = async () => {
        const isConfirmed = confirm("Are you sure you want to delete this blog? This action cannot be undone.");
    
        if (!isConfirmed) return;

        try {
            setIsLoading(true);
            await blogRepository.deleteBlog(id); // Where id is Use params id;
            alert("Blog deleted successfully");
            navigate("/");


        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const HandleEdit = async () => {
        // OnClick just navigate and pass params
        navigate(`/form/${id}`);
    }

    // Call supabase repository to get blog by id


    // COMMENTS AND INTERACTIONS HANDLES
    const [selectedFile, setSelectedFile] = useState<File | null>();
    const [imageView, setImageView] = useState<string | null>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setImageView(URL.createObjectURL(file)); // Create local preview
        }
    };

    const clearImage = () => {
        setSelectedFile(null);
        setImageView(null);
    };

    const HandleComment = async () => {

        if (!userId) {
            alert("Please login to comment");
            return;
        }


        if (isLoading) return;
        
        try {
            setIsLoading(true);
            //Simple data validation
            const newCommentObject : commentPayload = {
                blog_id: id,
                user_id: userId,
                username: userName ||"Anonyomous",
                content: myComment
            }
           const data =  await commentRepository.create(newCommentObject, selectedFile);
           if (!data) return;
           // append
            setComments(prev => [data, ...prev]);
            setMyComment(""); // reset
            clearImage();
        } catch (error) {
            console.log(error);
            alert("Could not post Comment. Please try again later")
        } finally {
            setIsLoading(false);
        }
            
            
        
    }

    const onCommentDelete = async (id: string) => {
        const isConfirmed = confirm("Are you sure you want to delete this comment?");
        if (!isConfirmed) return;

        try {
            await commentRepository.delete(id);
            
            setComments((prev) => prev.filter((c) => c.id !== id));
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("Failed to delete comment. Please try again.");
        }
    };

    const onCommentUpdate = async (id: string, updatedContent: string, newFile?: File | null) => {
        if (!updatedContent.trim()) return;


        try {
            const updatedComment = await commentRepository.update(id, updatedContent, newFile); 
            setComments((prev) => 
                prev.map((c) => (c.id === id ? updatedComment : c))
            );
        } catch (error) {
            console.error("Error updating comment:", error);
            alert("Failed to save changes.");
        } 
    };


    return (
        <div>
            <Navbar01 
                    onSignInClick={() =>navigate('/login')} 
                    onCtaClick={()=> navigate("/signup")} 
                    onCreateClick={() => navigate("/form")}
            
                    userIdSession = {userId}    
            
                    wherePage = {"Blog"}/>

            
            {/* THIS IS MY IMAGE HODLDER*/}
            <div className='relative w-full h-[50vh] md:h-[60vh] bg-neutral-900 overflow-hidden'>
                {blogContent?.cover_path ? (
                    <img 
                        src={blogContent.cover_path}  
                        alt={blogContent.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        No cover image
                    </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

            </div>


            {/* CONTENT */}
            <div className='max-w-5xl mx-auto px-6 md:px-12 py-8 md:py-12'>
            
                <div className="flex flex-col items-start text-neutral-600 mb-8 pb-6 border-b">
                    {/* Title Overlay */}
                    <div className="w-full">
                        <h1 className="text-3xl md:text-5xl font-bold text-neutral-800 max-w-5xl mx-auto">
                            {blogContent?.title || 'Untitled'}
                        </h1>
                    </div>


                    <div 
                        className="gap-2 cursor-pointer hover:text-black"
                        onClick={() => navigate(`/profile/${authorContent?.id}`)}
                    >
                        <span className="font-semibold">by: {authorContent?.username || 'Anonymous'}</span>
                    </div>
                    
                    {blogContent?.created_at && (
                        <span>
                            {new Date(blogContent.created_at).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                    )}
                </div>

                <article className="text-lg leading-relaxed text-neutral-800 whitespace-pre-wrap">
                    <ReactMarkdown>
                        {blogContent?.content || 'No content available.'}
                    </ReactMarkdown>
                </article>
                
                <div className='buttons flex flex-row justify-between'> 
                    <Button
                    onClick={() => navigate(-1)}
                    className="mt-12 px-6 py-3  text-white rounded-lg hover:bg-neutral-800 transition-all hover:translate-y-[5px]"
                    >
                        Back
                    </Button>

                    {isOwnProfile.current == true ? 
                        <div className='flex gap-2'> 
                            <Button
                                onClick={() => HandleEdit()}
                                className="mt-12 px-6 py-3 text-white rounded-lg hover:bg-neutral-800 transition-all hover:translate-y-[5px]"
                            >
                                Edit
                            </Button> 

                            <Button
                                variant={"destructive"}
                                onClick={() => HandleDelete()}
                                className="mt-12 px-6 py-3 text-white rounded-lg hover:bg-neutral-800 transition-all hover:translate-y-[5px]"
                            >
                                Delete
                            </Button> 
                        </div>
                        : null
                    } 
                    

                </div>
                
                 {/** Attached to the bottom */}
                <div className='mt-10'>
                    {imageView && (
                        <div className="relative w-20 h-20 mb-2 border rounded-md overflow-hidden group">
                            <img src={imageView} className="w-full h-full object-cover" />
                            <button 
                                onClick={clearImage}
                                className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-md"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    )}

                    <div className="flex gap-2 mb-8">
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
                            onClick={() => fileInputRef.current?.click()}
                            className="border-neutral-900"
                        >
                            <ImagePlus size={18} />
                        </Button>
                        <input 
                            type="text" 
                            className="flex-1 border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 border-neutral-900"
                            placeholder='Add a comment...' 
                            value={myComment}
                            onChange={(e) => setMyComment(e.target.value)} 
                        />
                        <Button onClick={()=>HandleComment()} disabled={!myComment.trim() || isLoading}> {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"} </Button>
                    </div>
                    
                    {/** Comment Holder */}
                    <div className="space-y-4">
                        {comments.length > 0 ? (
                            comments.map((c) => (
                                <Comment key={c.id} 
                                        comment={c} 
                                        userId={userId}
                                        onDelete={onCommentDelete}
                                        onUpdate={onCommentUpdate}
                                        />
                            ))
                        ) : (
                            <p className="text-neutral-400 text-sm italic">No comments yet. Be the first to say something!</p>
                        )}
                    </div>
                </div>
            </div>

           

        </div>
    )
}

export default Blogpage
