import React from 'react'

interface Props {
    title: string;
    content: string;

}

function Blogpage(props: Props) {
    const {title, content} = props

    return (
        <div>
            <h1>{title}</h1>
            <p>{content}</p>
        </div>
    )
}

export default Blogpage
