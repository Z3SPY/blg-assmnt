
interface ButtonStyles {
    onClick: () => void;
    isActive: (format: string) => boolean;
    children?: React.ReactNode;
}


export const RichButton = (btnStyles : ButtonStyles) => {
    return (
        <button className={`px-3 py-2 mr-1 border border-gray-300 cursor-pointer ${
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