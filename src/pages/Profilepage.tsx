import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { userRepositry } from '@/repositories/UserRepository';
import { useNavigate } from 'react-router-dom';
import type { ProfileType } from '@/types/stateTypes';
import { Navbar01 } from '@/components/ui/shadcn-io/navbar-01';
import BlogFooter from '@/components/Footer';
import type { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

function Profilepage() {
    const { id } = useParams();
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [loading, setIsLoading] = useState<boolean>(true); // Start with loading
    const [isEditing, setIsEditing] = useState(false);

    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Redux Checker
    // We check if params profile sent id is same with redux session id
    const { userId } = useSelector((state: RootState) => state.session);
    const isOwnProfile = id === userId;

    // Page Tester
    const blogItems = 12;
    const pageNumber =  Math.ceil(blogItems / 5); // Should Change Depending on screen size
    const [pageCur, setPageCur] = useState(1);


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
                
                if (data) {
                    setProfile(data);
                } else {
                    console.error("User not found");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();


    }, [id, navigate])
    

    const handleImageClick = () => {
        return;
    }


    return (
        <div >
            <Navbar01 
                onSignInClick={() => {}} 
                onCtaClick={() => {}} 
                onCreateClick={() => {}}
                reduxFunc={() => {}}
                userIdSession = {id}    
                onLogoClick={() => navigate("/")}
            
                wherePage = {"Profile"}
            />
            

            <div className='h-screen flex-grow mx-5 md:mx-32 my-10'>
                
                {/** PROFILE SLICE */}
                <div className='profile-holder flex flex-col md:flex-row gap-8 items-start border-b-2 pb-10 mb-5 '> 
                    
                    {/* CLICKABLE PICTURE LOCATION */}
                    <div className='relative group'>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
                        <div 
                            onClick={handleImageClick}
                            className={`pic-holder overflow-hidden border-4 border-neutral-200 rounded-xl bg-neutral-800 w-[200px] h-[200px] shadow-xl ${isOwnProfile ? 'cursor-pointer hover:opacity-80' : ''}`}
                        >
                            {profile?.avatar_url ? (
                                <img 
                                    src={profile.avatar_url} 
                                    className="w-full h-full object-cover"
                                    alt="Profile"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-neutral-500 text-xs">No Image</div>
                            )}
                            
                            {isOwnProfile && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <p className="text-white text-xs">Change Photo</p>
                                </div>
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
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="gap-2"
                                >
                                    <Pencil size={16} />
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </Button>
                            )}
                        </div>

                        {isEditing ? (
                            <textarea 
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
                            <Button className="mt-4 self-end" >
                                Save Changes
                            </Button>
                        )}
                    </div>
                </div> 
                
                {/** BLOGS SLICE */}
                <div>
                    <h2 className='text-[1.25rem] italic'> {profile?.username}'s Blogs </h2>
                    
                    <div className='profile-blog-holder  shadow-[inset_0_1px_10px_rgba(0,0,0,0.3)] mt-5 w-full p-4 bg-neutral-50 '>

                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2'>
                            {/* Reduce my overflow Usage needs some form of pagination*/}
                            {/** USE A CARD COMPONENT HERE CREATE one */}
                            {isOwnProfile && pageCur == 1 ? 
                                <div onClick={()=>navigate("/form")} className='transition-all hover:translate-y-[5px] hover:bg-neutral-600
                                                                                cursor-pointer shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)] min-h-[300px]  bg-neutral-700 rounded-md border-2 flex justify-center items-center text-white font-semibold'>
                                    Create A Blog + 
                                </div> : <></>
                            }

                            {/* Should include create but offset dont load*/}
                            {Array.from({ length: blogItems })
                            .slice((pageCur - 1) * 5, (pageCur - 1) * 5 + (isOwnProfile && pageCur === 1 ? 4 : 5)) // 0 - 5 || 5 - 10  what if 0 - 4, 4 - 9| 10 - 14
                            .map((_, index) => {

                                // NOTE ISSUES WITH RERENDERS ILL FIX LATER
                                // We use a real index based on the slice
                                const actualIndex = ((pageCur - 1) * 5) + index + 1;

                                // NOTE WE CAN USE COMPONENT HERE
                                return (
                                    <div key={actualIndex} className="min-h-[300px] bg-white border rounded-md shadow-sm p-4">
                                        <h4 className="font-bold">Test Blog #{actualIndex}</h4>
                                        <p className="text-sm text-gray-500">Placeholder for page {pageCur}.</p>
                                    </div>
                                );
                            })}

                            {/** Map Something Here Always End With a spacing Flex*/}

                            {/** BIGGG NOTE, DONT FORGET TO REPLACE THIS WITH A OBJECT ITERATOR ONCE THE DB IS DONE */}
                            
                        </div>
                        
                            <div className='page-holder gap-1 flex flex-row shadow-[inset_0_1px_10px_rgba(0,0,0,0.3)] mt-5 w-full p-4 bg-neutral-50'>
                                {Array.from({length: pageNumber}).map((_, index) => {
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
