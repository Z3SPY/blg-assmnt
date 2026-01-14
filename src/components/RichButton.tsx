
interface ButtonStyles {
    onClick: () => void;
    isActive: (format: string) => boolean;
    children?: React.ReactNode;
}


export const RichButton = (btnStyles : ButtonStyles) => {
    return (
        <button className={`px-2 py-1 mr-1 border rounded-sm shadow-neutral-800 shadow-sm border-gray-300 cursor-pointer ${
            btnStyles.isActive('bold') ? 
            'bg-gray-200 font-bold' : 
            'bg-white font-normal'}`}  
            
            onClick={(e) => {
                e.preventDefault();
                btnStyles.onClick();
            }}>
            {btnStyles.children}

        </button>
    )
}