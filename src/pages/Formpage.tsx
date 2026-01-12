import React from 'react'
import RichTxtArea from '../components/RichTxtArea'


function Formpage() {
    // Need to add some data binding 


    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    }

    return (
        <div className='m-10'>
            <form>
                
                <RichTxtArea />
                <button onClick={handleSubmit}> Submit </button>
            </form>
        </div>

    )
}

export default Formpage
