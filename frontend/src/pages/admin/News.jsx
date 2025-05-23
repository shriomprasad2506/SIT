import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";

import NewsForm from "../../components/admin/News/NewsForm";
import NewsList from "../../components/admin/News/NewsList";
const News = () => {
    useEffect(() => {
        document.title = "SIT | News";
    }, []);
    const [searchTerm, setSearchTerm] = useState('');

    const [formModal, setFormModal] = useState(false);
    const formOpen = () => setFormModal(true);
    const formClose = () => setFormModal(false);
    const [refresh, setRefresh] = useState(false);

    return (
        <div className="md:p-5 p-3">
            <p className="text-3xl font-semibold text-black">Events</p>
            <div className="flex justify-between mt-5 gap-3">
                <div className="flex relative w-[90%]">
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
            <NewsList refresh={refresh} setRefresh={setRefresh} searchTerm={searchTerm} />
            <NewsForm isOpen={formModal} onClose={formClose} setRefresh={setRefresh} />
        </div>
    )
}
export default News