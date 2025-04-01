import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";

import Form from "../../components/admin/Announcements/Form";
import List from "../../components/admin/Announcements/List";
const Announcements = () => {
    useEffect(() => {
        document.title = "SIT | Announcements";
    }, []);
    const [searchTerm, setSearchTerm] = useState('');

    const [formModal, setFormModal] = useState(false);
    const formOpen = () => setFormModal(true);
    const formClose = () => setFormModal(false);
    const [refresh, setRefresh] = useState(false);

    return (
        <div className="md:p-5 p-3">
            <p className="text-3xl font-semibold text-black">Announcements</p>
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
            <List refresh={refresh} setRefresh={setRefresh} searchTerm={searchTerm} />
            <Form isOpen={formModal} onClose={formClose} setRefresh={setRefresh} />
        </div>
    )
}
export default Announcements