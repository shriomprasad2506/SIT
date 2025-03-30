import { IoMdMenu } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

const Navbar = ({ setIsSidebarOpen }) => {

    return (
        <div className="flex items-center justify-between w-full sm:py-2 sm:px-4 px-2">
            {/* Menu Icon (for mobile view) */}
            <IoMdMenu
                className="place-self-end sm:hidden text-black text-4xl cursor-pointer" style={{ placeSelf: "end" }}
                onClick={() => setIsSidebarOpen(true)}
            />
            <div className="flex gap-1 items-center justify-center xl:hidden">
                <img src='/sit.jpg' className="sm:size-12 size-6 rounded-full" />
                <p
                    className="sm:text-sm text-xs sm:ml-1 text-center"
                    style={{ fontFamily: "MuseoModerno" }}
                >
                    Siliguri Institute of Technology
                </p>
            </div>
            <div className="hidden md:flex relative w-[50%] ">

                <input type="text" className="p-2 rounded-3xl w-full border" placeholder="Search" />
                <CiSearch className="text-2xl absolute right-0 top-1/2 -translate-1/2" />
            </div>
            <div className="flex sm:gap-6 gap-2 items-center">
                <FaBell className="sm:text-3xl" />
                <div>
                    <img src='/admin.png' className="rounded-full sm:size-12 size-6" />
                </div>
            </div>
        </div>
    );
};

export default Navbar;