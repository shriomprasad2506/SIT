import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa'; // Import the Chevron icon

const Dropdown = ({ placeholder, options, selected, onSelect, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        onSelect(option);
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`relative inline-block rounded ${className} bg-white`} ref={dropdownRef}>
            <div
                className="flex items-center justify-between p-2 border border-gray-300 rounded cursor-pointer w-full" // Set fixed width
                onClick={toggleDropdown}
            >
                <span className='w-full text-black whitespace-nowrap text-ellipsis overflow-hidden'>{selected ? selected.label : placeholder}</span>
                <FaChevronDown className="w-5 h-5 text-gray-500" />
            </div>
            {isOpen && options.length>0 && (
                <div className="absolute left-0 z-10 mt-1 bg-white border border-gray-300 rounded shadow-lg w-full">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
