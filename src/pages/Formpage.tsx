import React, { useEffect, useState } from 'react'
import RichTxtArea from '../components/RichTxtArea'

//Redux state
import type { RootState } from '../state/store';
import { useSelector } from 'react-redux';

//React
import { useNavigate } from 'react-router-dom';

function Formpage() {
    const navigate = useNavigate();

    // Get Current Session Owner

    // This is a static value, I dont need to change it
    const {userName, userId} = useSelector((state: RootState) => state.session)
    
    
    useEffect(()=>{
        
        if (!userId) {
            console.log("No User Id");
            navigate("/auth");
        } 
    }, [userId, navigate])

    // Need to add some data binding 

    const [blogTitle, setBlogTitle] = useState("");
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // need to make into datamodel
        


    }

    return (
        <div className='m-10'>
            <h1> Writer: {userName} with Id: {userId} </h1>
            <form>
                
                <label htmlFor="title"> Blog Name </label>
                <input type="text" name="title" onChange={(e)=> setBlogTitle(e.target.value)} value={blogTitle}/>

                {/** BLOG BODY */}
                <RichTxtArea />
                <button onClick={handleSubmit}> Submit </button>
            </form>
        </div>

    )
}

export default Formpage
