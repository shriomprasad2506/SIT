import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";

import EventForm from "../../components/admin/Events/EventForm";
import EventList from "../../components/admin/Events/EventList";
const Events = () => {
    useEffect(() => {
        document.title = "SIT | Events";
    }, []);
    const [category, setCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [formModal, setFormModal] = useState(false);
    const formOpen = () => setFormModal(true);
    const formClose = () => setFormModal(false);
    const [refresh, setRefresh] = useState(false);
    const translate = () => {
        if (category === 'all') {
            return 'left-0';
        }
        if (category === 'ongoing') {
            return 'left-[70px] sm:left-[100px] lg:left-[125px]'
        }
        if (category === 'upcoming') {
            return 'left-[140px] sm:left-[200px] lg:left-[250px]'
        }
        if (category === 'past') {
            return 'left-[210px] sm:left-[300px] lg:left-[375px]'
        }
    }
    return (
        <div className="md:p-5 p-3">
            <p className="text-3xl font-semibold text-black">Events</p>

            <div className="flex justify-between mt-5 gap-3">
                <div className="bg-white text-[#A1A1A1] flex justify-center items-center gap-2 flex-grow max-w-[280px] sm:max-w-[400px] lg:max-w-[500px] rounded-xl relative sm:text-base text-sm">
                    <div
                        className={`bg-[#0E613B] flex-1 absolute top-0 h-full rounded-xl 
                    ${translate()} ${category ? 'w-[70px] sm:w-[100px] lg:w-[125px]' : 'w-0'}
                    transition-all duration-200`}

                    />
                    <button className={`flex-1 hover:cursor-pointer z-[0] ${category === 'all' ? 'text-white' : ''}`}
                        onClick={() => {setCategory('all'); setSearchTerm('')}}
                    >
                        All
                    </button>
                    <button className={`flex-1 hover:cursor-pointer z-[0] ${category === 'ongoing' ? 'text-white' : ''}`}
                        onClick={() => {setCategory('ongoing'); setSearchTerm('')}}
                    >
                        Ongoing
                    </button>
                    <button className={`flex-1 hover:cursor-pointer z-[0] ${category === 'upcoming' ? 'text-white' : ''}`}
                        onClick={() => {setCategory('upcoming'); setSearchTerm('')}}
                    >
                        Upcoming
                    </button>
                    <button className={`flex-1 hover:cursor-pointer z-[0] ${category === 'past' ? 'text-white' : ''}`}
                        onClick={() => {setCategory('past'); setSearchTerm('')}}
                    >
                        Past
                    </button>
                </div>
                <div className="hidden md:flex relative flex-1">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`px-4 py-2 rounded-2xl w-full outline-none bg-white`}
                        placeholder="Search"
                    />
                    <CiSearch className={`text-2xl absolute right-0 top-1/2 -translate-1/2`} />
                </div>
                <button
                    className="bg-white hover:cursor-pointer rounded-full flex justify-center items-center size-10"
                    onClick={formOpen}
                >
                    <FaPlus />
                </button>
            </div>
            <div className="flex md:hidden relative w-[100%] mt-5">
                <input type="text" className={`px-4 py-2 rounded-2xl w-full outline-none bg-white`} placeholder="Search" />
                <CiSearch className={`text-2xl absolute right-0 top-1/2 -translate-1/2`} />
            </div>
            <EventList category={category} refresh={refresh} setRefresh={setRefresh} searchTerm={searchTerm} />
            <EventForm isOpen={formModal} onClose={formClose} setRefresh={setRefresh} />
        </div>
    )
}
export default Events