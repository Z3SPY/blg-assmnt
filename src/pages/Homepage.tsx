import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

// Redux
import { type RootState, type AppDispatch} from '../state/store';
import { useSelector, useDispatch} from 'react-redux';
import { _rdxLogout } from '../state/session/session';
import { authService } from '../services/AuthServices';


import { Navbar01 } from '@/components/ui/shadcn-io/navbar-01';
import BlogFooter from '@/components/Footer';

//Styling
import "./css/Homepage.css";
import { Button } from '@/components/ui/button';
import CardGrid from '@/components/CardGrid';
import { blogRepository } from '@/repositories/BlogRepository';
import type { BlogType } from '@/types/stateTypes';

function Homepage() {

    const navigate = useNavigate();
    
    const {userName, userId} = useSelector((state: RootState) => state.session)
    const dispatch = useDispatch<AppDispatch>();

    // Blog List
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [blogs, setBlogs] = useState<BlogType[]>([]);

    useEffect(() => {
        const fetchPage = async () => {
            const result = await blogRepository.getAllBlogs(currentPage, 5); 
            setBlogs(result.data);
            const pages = Math.ceil(result.count / 5);
            setTotalPages(pages);
            
        };

        fetchPage();
    }, [currentPage])



    return (
        <>  
            <Navbar01 
                onSignInClick={() =>navigate('/login')} 
                onCtaClick={()=> navigate("/signup")} 
                onCreateClick={() => navigate("/form")}

                userIdSession = {userId}    

                wherePage = {"Home"}
            />


            {/** Need to Flow Scroll REMINDER: ILL DO IT LATER LOW PRIO */}
            <div id="#home" className="mb-12">
                <div className='body flex flex-col h-full font-sans'>
                    {/** MAIN BOX HERE  */}
                    <div className="overflow-hidden min-h-[70vh] mx-4 sm:mx-8 md:mx-12 lg:mx-20 px-4 sm:px-8 md:px-16 lg:px-28 py-6 md:py-10 my-3 rounded-2xl bg-neutral-900 shadow-slate-400 shadow-lg drop-shadow-md flex flex-col justify-start items-start">  
                        
                        {/** TEXTRUE */}
                        <div className="absolute inset-0 bg-[url('/HomeAssets/22627.jpg')] bg-no-repeat opacity-[0.05] z-0 bg-cover bg-center pointer-events-none text-white"></div>

                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full z-10'>
                            <h1 className='text-white text-4xl sm:text-5xl md:text-6xl lg:text-[5rem]'>JOTTED.</h1>
                            
                            <div className="text-neutral-500 font-bold text-xs sm:text-sm leading-tight">
                                Share <br />
                                Experience

                                <div className="my-1 w-6 h-[2px] bg-neutral-600"></div>

                                <span className="text-white">
                                    Jot Down <br />
                                    Ideas
                                </span>
                            </div>          

                            <div className="sm:ml-auto flex flex-row gap-4 sm:gap-6">
                                <div className="group w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/30 flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border border-white/60 rounded-full transition-transform duration-500 group-hover:rotate-180 group-hover:scale-50"></div>
                                </div>

                                <div className="group w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/30 flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border border-white/60 rounded-full transition-transform duration-500 group-hover:-rotate-180 group-hover:scale-50"></div>
                                </div>

                                <div className="group w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/30 flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border border-white/60 rounded-full transition-transform duration-500 group-hover:rotate-180 group-hover:scale-50"></div>
                                </div>
                            </div>              
                        </div>
                        
                        <div className='image-holder flex flex-col lg:flex-row justify-start relative bg-neutral-100 p-4 sm:p-6 w-full shadow-black shadow-xl mt-6 z-10'>
                            <div className="flex flex-col gap-2 px-4  lg:mb-0">
                                <h1 className="text-xl sm:text-2xl text-neutral-500 font-mono mt-4 font-bold">
                                    Crafted for storytellers by storytellers
                                </h1>
                                <p className="text-neutral-700 text-sm sm:text-md leading-relaxed max-w-md mb-16 sm:mb-20 lg:mb-0">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.  
                                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                                </p>

                                <Button asChild className='absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-10 lg:left-10 transition-all hover:translate-y-[5px] hover:bg-neutral-600 text-sm sm:text-base'>
                                    <a href="#about">Learn more about us</a>
                                </Button>
                            </div>

                            <div className="relative flex-grow min-h-[250px] sm:min-h-[300px] lg:min-h-[400px]">
                                <img className="rounded-lg w-full h-full object-cover" src="/HomeAssets/image2.webp" alt="" />

                                <span className="font-mono bg-neutral-100 text-black px-3 py-1.5 sm:px-4 sm:py-2 absolute right-0 bottom-0 text-right text-xs sm:text-sm">
                                    Explore your <br /> passion for writing
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="blogs" className=' pb-20 flex flex-col lg:flex-row'> 
                {/** Blogs List 3 In 1 page, with a more page section*/}
                <div className='min-h-[100vh] flex flex-col flex-grow px-4 sm:px-6 md:px-10 lg:px-16 '>
                    <h2 className="text-2xl font-bold font-mono text-neutral-800">
                        Latest Posts
                    </h2>
                    {/** LControl the PaGES */}
                    <div className="flex items-center gap-4 mt-8 pb-10">
                        <Button 
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                        >
                            Previous
                        </Button>

                        <span className="text-sm font-mono font-bold">
                            Page {currentPage}
                        </span>

                        <Button 
                            disabled={currentPage >= totalPages} 
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            Next
                        </Button>
                    </div>
                    
                    {/** Blogs here */}
                    <CardGrid className='gap-8' blogs={blogs} limit={5} ></CardGrid>
                
                    
                </div>
        

                {/** Text Detailss Here */}
                <div className=' max-w-screen lg:max-w-md border-t-2 mt-10 lg:border-l-2 lg:border-t-0 '>
                    <div className='flex flex-col px-10 mt-5'> 
                        <h1 className='text-[2rem] pb-2 font-bold font-sans '> Interested in Blogging? </h1>
                        <p className='text-[1.25rem] pb-2 italic opacity-50 font-mono'> why dont you checkout this button out! and lets explore the website together! </p>
                        { !userId ? <Button className="py-10 text-[1.5rem] mt-10 transition-all hover:translate-y-[5px] hover:bg-neutral-600" onClick={()=>navigate("/login")} variant={"default"}>  Let's Get You Started! </Button> : <Button  onClick={()=>navigate("/form")} variant={"default"}> Start Making A Blog Now! </Button>}
                    </div>
                </div>

                

            </div>

            <div id="about" className="h-screen pt-10 px-10 lg:px-56 bg-neutral-900 flex flex-col sm:flex-row items-center">
                {/* Text */}
                <div className="flex-1 flex flex-col text-white space-y-2 lg:space-y-6">
                    <h2 className="text-4xl font-bold font-sans  text-[2rem] md:text-[4rem]">About Us</h2>
                    <p className="text-lg text-gray-300 font-mono">
                    Jotted allows you to archive and share your own experiences into the web. Our Jotted team makes sure that storytellers have a place to go all out.
                    </p>
                    <p className="text-lg text-gray-300 font-mono">
                    Jotted's mission is to connect passionate and creative people through the web.
                    </p>
                </div>

                {/* Imayge */}
                <div className="flex-grow sm:flex-1 flex justify-center items-center ">
                    <img
                    src="/HomeAssets/image4.webp" // replace with your image
                    alt="Our Team"
                    className="rounded-lg shadow-xl w-full sm:w-3/4 max-w-lg "
                    />
                </div>
            </div>




            <BlogFooter />
        </>
    )
}

export default Homepage
