import React from 'react';
import { IoMdClose } from "react-icons/io";
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className='fixed inset-0 flex justify-center items-center z-50 backdrop-blur-2xl'>
            <div className="lg:m-20 sm:m-10 m-3 bg-white w-full max-h-[95vh] overflow-auto rounded-3xl sm:p-8 p-3 relative max-w-[800px]">
                <button
                    onClick={onClose}
                    className="text-2xl hover:cursor-pointer absolute top-4 right-4 text-black hover:text-red-500 rounded-full"
                >
                    <IoMdClose />
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
