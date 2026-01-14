import React from 'react'

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

function Homepage() {

    const navigate = useNavigate();
    
    const {userName, userId} = useSelector((state: RootState) => state.session)
    const dispatch = useDispatch<AppDispatch>();


    // Just passed it here instead
    function handleLogout() {
        authService.signOut(); // Kills the session from service
        dispatch(_rdxLogout()); // Complete Reset Redux
        navigate("/");
    }

    return (
        <>  
            <Navbar01 
                onSignInClick={() =>navigate('/login')} 
                onCtaClick={()=> navigate("/signup")} 
                onCreateClick={() => navigate("/form")}

                reduxFunc={handleLogout}
                userIdSession = {userId}    

                wherePage = {"Home"}
            />


            {/** Need to Flow Scroll */}
            <div id="#home" className="h-screen">
                <div className='body flex flex-col h-full'>
                    <div className=" bg-red-200 h-[65vh] mx-3 my-3 rounded-lg shadow-slate-400 shadow-lg drop-shadow-md ">  </div>
                    <div className='flex-1 bg-blue-500'> a </div>
                </div>
            </div>


            <BlogFooter />
        </>
    )
}

export default Homepage
