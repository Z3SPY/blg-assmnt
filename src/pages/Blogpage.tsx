import React from 'react'
import { useParams } from 'react-router-dom';


function Blogpage() {

    // Get Id from use Params

    // Call supabase repository to get blog by id

    return (
        <div>
            <h1>{title}</h1>
            <p>{content}</p>
        </div>
    )
}

export default Blogpage
