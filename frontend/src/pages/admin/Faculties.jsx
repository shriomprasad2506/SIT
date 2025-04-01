import { useEffect, useState } from "react";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";

import Form from "../../components/admin/Faculty/Form";
import List from "../../components/admin/Faculty/List";

import Dropdown from "../../components/DropDown";

const apiUrl = import.meta.env.VITE_API_URL;

const Faculties = () => {
    useEffect(() => {
        document.title = "SIT | Events";
    }, []);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [department, setDepartment] = useState('')
    const [departments, setDepartments] = useState([]);
    const categories = [
        { value: '1', label: 'Teaching' },
        { value: '2', label: 'Non Teaching' },
    ];
    useEffect(() => {
        const fetchDepartments = async (category) => {
            setDepartment('')
            const response = await axios.get(`${apiUrl}/api/faculty/departments`)
            if (category.value == 1) {
                setDepartments(response.data.teachingDepartments)
                console.log(response.data.teachingDepartments)
            } else if (category.value == 2) {
                setDepartments(response.data.nonTeachingDepartments)
            } 
        }
        fetchDepartments(category)
    }, [category])
    const handleSelect = (option) => {
        setCategory(option);
    };
    const handleDepartment = (department)=>{
        setDepartment(department)
    }
    const [formModal, setFormModal] = useState(false);
    const formOpen = () => setFormModal(true);
    const formClose = () => setFormModal(false);
    const [refresh, setRefresh] = useState(false);
    return (
        <div className="md:p-5 p-3 w-full">
            <p className="text-3xl font-semibold text-black">Events</p>

            <div className="flex justify-between mt-5 gap-3">
                <Dropdown options={categories} selected={category} placeholder="Select an option" onSelect={handleSelect} className={`w-40`} />
                {
                    !category &&
                    <div className="w-60" />
                }
                {
                    category &&
                    <Dropdown options={departments} selected={department} placeholder="Department" onSelect={handleDepartment} className={`w-60`} />
                }
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
            <List department={department.label} category={category} refresh={refresh} setRefresh={setRefresh} searchTerm={searchTerm} />
            <Form isOpen={formModal} onClose={formClose} setRefresh={setRefresh} />
        </div>
    )
}
export default Faculties