import { useState, useEffect } from "react";
import { MdDashboard } from "react-icons/md";
import { MdEmojiEvents } from "react-icons/md";
import { ImNewspaper } from "react-icons/im";
import { MdAnnouncement } from "react-icons/md";
import { IoIosPeople, IoMdClose } from "react-icons/io";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { FaChevronRight } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const [isExpanded, setIsExpanded] = useState(false); // Initially expanded
    const location = useLocation(); // Get current location (URL)
    const navigate = useNavigate()
    // Function to handle the screen size detection
    const checkScreenSize = () => {
        // If the screen width is less than 640px, set isExpanded to true
        if (window.innerWidth < 640) {
            setIsExpanded(true);
        } else if (window.innerWidth > 1280) {
            setIsExpanded(true);
        } else {
            setIsExpanded(false)
        }
    };

    // Run the checkScreenSize function on mount and when the window is resized
    useEffect(() => {
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        // Cleanup on unmount
        return () => {
            window.removeEventListener("resize", checkScreenSize);
        };
    }, []);

    const style1 = 'flex xl:flex-row flex-col text-[#B3C0B9] hover:text-black sm:text-3xl text-xl hover:cursor-pointer flex gap-1 items-center transition-all duration-200';
    const style2 = 'md:text-lg sm:text-base text-xs transition-all duration-300';
    const activeStyle = 'text-[#1c8252!important] border-l-3 border-[#1c8252]'; // Active link style

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    // Function to check if the current path matches the link
    const isActive = (path) => {
        return location.pathname.includes(path); // Ensure that 'path' corresponds to part of the route
    };

    const logOut = () => {
        sessionStorage.removeItem('authToken')
        navigate('/login')
        toast.success("Logged Out")
    }

    return (
        <div
            className={`sm:pl-2 pl-1 py-4 bg-[#F7F7F7] overflow-clip whitespace-nowrap sm:sticky fixed top-0 flex flex-col justify-between min-h-[380px] h-screen transition-all duration-200 ${isExpanded ? 'xl:w-[240px] sm:w-[250px] w-[100px]' : 'w-[50px]'}
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
            style={{ fontFamily: "Inter" }}
        >
            {/* <FaChevronRight
                className={`sm:block hidden xl:hidden hover:text-gray-600 text-3xl cursor-pointer transition-all duration-500 ${isExpanded ? 'rotate-180' : ''}`}
                onClick={toggleSidebar}
            /> */}
            <IoMdClose
                className="text-2xl sm:hidden cursor-pointer text-black absolute top-0 right-0"
                onClick={() => setIsSidebarOpen(false)}
            />
            <div className="gap-1 items-center justify-center hidden xl:flex">
                <img src='/sit.jpg' className="sm:size-12 size-6 rounded-full" />
                <p
                    className="sm:text-sm text-xs sm:ml-1 text-center"
                    style={{ fontFamily: "MuseoModerno" }}
                >
                    Siliguri Institute of<br/> Technology
                </p>
            </div>
            <div className="flex flex-col sm:gap-8 gap-4 my-4 relative">
                <a href='/dashboard' className={`${style1} ${isActive('/dashboard') ? activeStyle : ''}`}>
                    <MdDashboard />
                    {isExpanded && <span className={`${style2}`}>Dashboard</span>}
                </a>
                <a href='/events' className={`${style1} ${isActive('/events') ? activeStyle : ''}`}>
                    <MdEmojiEvents />
                    {isExpanded && <span className={`${style2}`}>Events</span>}
                </a>
                <a className={`${style1} ${isActive('/news') ? activeStyle : ''}`}>
                    <ImNewspaper />
                    {isExpanded && <span className={`${style2}`}>News</span>}
                </a>
                <a className={`${style1} ${isActive('/announcements') ? activeStyle : ''}`}>
                    <MdAnnouncement />
                    {isExpanded && <span className={`${style2}`}>Announcements</span>}
                </a>
                <a className={`${style1} ${isActive('/faculty') ? activeStyle : ''}`}>
                    <IoIosPeople />
                    {isExpanded && <span className={`${style2}`}>Faculty</span>}
                </a>


            </div>
            <div className="flex gap-1 items-center text-[#B3C0B9] hover:text-red-500 cursor-pointer transition-all duration-300" onClick={logOut}>
                <RiLogoutCircleRLine className="sm:text-3xl text-xl" />
                {isExpanded && <span className={`${style2}`}>Log Out</span>}
            </div>
        </div>
    );
};

export default Sidebar;
