import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { userRepositry } from '@/repositories/UserRepository';
import { useNavigate } from 'react-router-dom';
import type { BlogType, ProfileType } from '@/types/stateTypes';
import { Navbar01 } from '@/components/ui/shadcn-io/navbar-01';
import BlogFooter from '@/components/Footer';
import type { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { ImageOff, Pencil } from 'lucide-react';
import { blogRepository } from '@/repositories/BlogRepository';


import ReactMarkdown from 'react-markdown';
import Card from '@/components/Card';

function Profilepage() {
    const { id } = useParams();
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [loading, setIsLoading] = useState<boolean>(true); // Start with loading
    const [isEditing, setIsEditing] = useState(false);

    
    const navigate = useNavigate();

    // Edit Values
    const file = useRef<HTMLInputElement>(null);
    const bioRef = useRef<HTMLTextAreaElement>(null);
    const file2Upload = useRef(null);
    const [profilePic, setProfilePic] = useState<string | null>(null);

    // Redux Checker
    // We check if params profile sent id is same with redux session id
    const { userId } = useSelector((state: RootState) => state.session);
    const isOwnProfile = id === userId;

    // Page Tester
    const [blogItems, setBlogItems] = useState<BlogType[] | null>(null);
    const pageNumber =  useRef<number>(0); // Should Change Depending on screen size // INDICATES
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);
    const [pageCur, setPageCur] = useState(1);

    // Items per page Definor 
    useEffect(() => {
    const updateCapacity = () => {
        if (window.innerWidth < 640) {
            setItemsPerPage(2); 
        } else if (window.innerWidth < 1024) {
            setItemsPerPage(3); 
        } else {
            setItemsPerPage(5);
        }
    };

    updateCapacity();
    window.addEventListener('resize', updateCapacity);
    return () => window.removeEventListener('resize', updateCapacity);
}, []);


    // First INIT use Effect
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
                const data = await userRepositry.getUserById(id!);
                const blogData = await blogRepository.getAllBlogsById(id!);

                
                if (data) {
                    setProfile(data);
                } else {
                    console.error("User not found");
                }

                if (blogData) {
                    setBlogItems(blogData);
                    pageNumber.current =  Math.ceil(blogData?.length / 5);

                } 

               
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();


    }, [id, navigate])
    

    const editToggle = () => {
        if (isEditing) {
            setProfilePic(null);
            file2Upload.current = null;
            bioRef.current = null;
        }
        setIsEditing(!isEditing)
    }

    const handleSaveChanges = async () => {
        if (!id) return;

        try {
            setIsLoading(true);
            
            // Get Value = no data validation for now
            const updatedBio = bioRef.current?.value || profile?.bio;

            const updatePayload: ProfileType = {
                ...profile!,
                id: id!,
                bio: updatedBio || ""
            };

            if (file2Upload.current) {
        
                const data = await userRepositry.updateUser(id, updatePayload, file2Upload.current);

                setProfile(data);
                console.log("Updated User");
            }

            


            // Clearzz
            setProfile((prev) => prev ? { ...prev, ...updatePayload } : null);
            setIsEditing(false);
            setProfilePic(null); 
            file2Upload.current = null;
            
            alert("Profile updated!");
        } catch (error) {
            console.error("Failed to save:", error);
            alert("Save failed. Please try again.");
        } finally {
            setIsLoading(false);
            window.location.reload();
        }

    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleProfile = async ( e : any) => {
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
            setIsLoading(true);



            // We create some local url instance, for frontend only

            const localUrl = URL.createObjectURL(selectedFile);
            console.log(localUrl);
            setProfilePic(localUrl);
            file2Upload.current = selectedFile;

        } catch (error) {
            console.log("ERROR UPLOAD: ", error);
        } 
        finally {
            setIsLoading(false)
        }

    }



    return (
        <div >
            <Navbar01 
                onSignInClick={() => {}} 
                onCtaClick={() => {}} 
                onCreateClick={() => {}}
                userIdSession = {id}    
                onLogoClick={() => navigate("/")}
            
                wherePage = {"Profile"}
            />
            

            <div className='h-screen flex-grow mx-5 md:mx-32 my-10'>
                
                {/** PROFILE SLICE */}
                <div className='profile-holder flex flex-col md:flex-row gap-8 items-start border-b-2 pb-10 mb-5 '> 
                    
                    {/* CLICKABLE PICTURE LOCATION */}
                    <div className='relative group'>
                        <input type="file" ref={file} className="hidden" accept="image/*" onChange={handleProfile} />
                        <div 
                            className={`pic-holder overflow-hidden border-4 border-neutral-200 rounded-xl bg-neutral-800 w-[200px] h-[200px] shadow-xl ${isOwnProfile ? 'cursor-pointer hover:opacity-80' : ''}`}
                        >
                            {profile?.avatar_url || profilePic ? (
                                <img 
                                    src={profilePic || profile?.avatar_url} 
                                    className="w-full h-full object-cover"
                                    alt="Profile"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-neutral-500 text-xs">No Image</div>
                            )}
                            
                            {isOwnProfile && isEditing && (
                                <>
                                    <div 
                                    onClick={() => file.current?.click()}
                                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-xs">Change Photo</p>
                                    </div>
                                </>

                                
                            )}
                        </div>
                    </div>
                            
                    {/** DETAILS NOT PICTURE NAME AND BIO*/}
                    <div className='profile-data flex flex-col flex-grow'>
                        <div className="flex justify-between items-center w-full">
                            <h1 className='text-[2.5rem] font-bold text-neutral-900'> 
                                {profile?.username || 'User'} 
                            </h1>
                            
                            {/* EDIT BUTTON LOGIC */}
                            {isOwnProfile && (
                                <Button 
                                    variant={isEditing ? "destructive" : "outline"} 
                                    onClick={() => editToggle()}
                                    className="gap-2"
                                >
                                    <Pencil size={16} />
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </Button>
                            )}
                        </div>

                        {isEditing ? (
                            <textarea 
                                ref={bioRef}
                                className="mt-4 p-3 border-2 border-neutral-300 rounded-md bg-transparent focus:border-black outline-none h-32"
                                defaultValue={profile?.bio}
                                placeholder="Tell us about yourself..."
                            />
                        ) : (
                            <p className='text-[1.2rem] text-neutral-600 mt-2 italic'>
                                {profile?.bio || "This user hasn't written a bio yet."}
                            </p>
                        )}
                        
                        {isEditing && (
                            <Button className="mt-4 self-end" onClick={handleSaveChanges} >
                                Save Changes
                            </Button>
                        )}
                    </div>
                </div> 
                
                {/** BLOGS SLICE */}
                <div>
                    <h2 className='text-[1.25rem] italic'> {profile?.username}'s Blogs </h2>
                    
                    <div className='profile-blog-holder  shadow-[inset_0_1px_10px_rgba(0,0,0,0.3)] mt-5 w-full p-4 bg-neutral-50 '>

                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-2'>
                            {/* Reduce my overflow Usage needs some form of pagination*/}
                            {/** USE A CARD COMPONENT HERE CREATE one */}
                            {isOwnProfile && pageCur == 1 ? 
                                <div onClick={()=>navigate("/form")} className='transition-all hover:translate-y-[5px] hover:bg-neutral-600
                                                                                cursor-pointer shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)] min-h-[300px]  bg-neutral-700 rounded-md border-2 flex justify-center items-center text-white font-semibold'>
                                    Create A Blog + 
                                </div> : <></>
                            }

                            {/* Should include create but offset dont load*/}
                            {blogItems && blogItems
                            .slice((pageCur - 1) * itemsPerPage, (pageCur - 1) * itemsPerPage + (isOwnProfile && pageCur === 1 ? itemsPerPage - 1 : itemsPerPage)) // 0 - 5 || 5 - 10  what if 0 - 4, 4 - 9| 10 - 14
                            .map((blog, index) => {

                                return <Card key={blog.id} blog={blog}></Card>
                            })}

                            {/** Map Something Here Always End With a spacing Flex*/}

                            {/** BIGGG NOTE, DONT FORGET TO REPLACE THIS WITH A OBJECT ITERATOR ONCE THE DB IS DONE */}
                            
                        </div>
                        
                            <div className='page-holder gap-1 flex flex-row shadow-[inset_0_1px_10px_rgba(0,0,0,0.3)] mt-5 w-full p-4 bg-neutral-50'>
                                {Array.from({length: pageNumber.current}).map((_, index) => {
                                    const pageNum = index + 1;
                                    return( 
                                        <button
                                            key={pageNum}
                                            onClick={() => setPageCur(pageNum)}
                                            className={`px-4 py-2 rounded-md transition-all ${
                                                pageCur === pageNum 
                                                ? 'bg-neutral-800 text-white shadow-md ' 
                                                : 'bg-white text-neutral-600 hover:bg-neutral-200 border-neutral-500 border-[1px]'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    )
                                })}
                            </div>
                        
                        



                    </div>
                    

                </div>

            </div>

            <BlogFooter />


        </div>
    )
}

export default Profilepage
