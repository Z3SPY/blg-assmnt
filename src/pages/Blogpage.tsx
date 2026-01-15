import BlogFooter from '@/components/Footer';
import { Navbar01 } from '@/components/ui/shadcn-io/navbar-01';
import { blogRepository } from '@/repositories/BlogRepository';
import { userRepositry } from '@/repositories/UserRepository';
import type { RootState } from '@/state/store';
import type { BlogType, ProfileType } from '@/types/stateTypes';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';


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
                    const authorData = await userRepositry.getUserById(blogData.user_id);
                    
                    //Ownership
                    isOwnProfile.current = blogData.user_id === userId;
                    
                    if (blogData && authorData) {
                        setBlogContent(blogData);
                        setAuthorData(authorData)
                    } else {
                        console.error("Blog not found");
                        navigate("/");
                    }
    
    
                   
                } catch (error) {
                    console.error("Error fetching profile:", error);
                } finally {
                    setIsLoading(false);
                }
            };
    
            fetchProfileData();
    
    
        }, [id, navigate])

    
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
                
            </div>

        </div>
    )
}

export default Blogpage
