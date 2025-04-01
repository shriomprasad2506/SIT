import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { IoMdCloudUpload } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_API_URL;

const NonTeachingStaffForm = ({ onClose, setRefresh }) => {
    const [departmentName, setDepartmentName] = useState("");
    const [facultyName, setFacultyName] = useState("");
    const [designation, setDesignation] = useState("");
    const [email, setEmail] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!facultyName || !designation) {
            toast.error("Faculty Name and Designation are required.");
            return;
        }

        const formData = new FormData();
        formData.append("department_name", departmentName);
        formData.append("staff_name", facultyName);
        formData.append("designation", designation);
        formData.append("email", email);
        formData.append("additional_info", additionalInfo);

        setLoading(true);
        try {
            const token = sessionStorage.getItem("authToken");

            await axios.post(`${apiUrl}/api/faculty/non_teaching/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Non-Teaching Staff created successfully.");
            setRefresh(true);
            onClose();
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error creating non-teaching staff.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="facultyName" className="block font-medium text-[#737373]">
                    Staff Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="facultyName"
                    value={facultyName}
                    onChange={(e) => setFacultyName(e.target.value)}
                    placeholder="Staff Name"
                    className="mt-1 block w-full px-2 py-[6px] border border-gray-500 rounded-md shadow-sm bg-[#f7f7f7] outline-none"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="designation" className="block font-medium text-[#737373]">
                    Designation <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="designation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Designation"
                    className="mt-1 block w-full px-2 py-[6px] border border-gray-500 rounded-md shadow-sm bg-[#f7f7f7] outline-none"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="departmentName" className="block font-medium text-[#737373]">
                    Department Name
                </label>
                <input
                    type="text"
                    id="departmentName"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    placeholder="Department Name"
                    className="mt-1 block w-full px-2 py-[6px] border border-gray-500 rounded-md shadow-sm bg-[#f7f7f7] outline-none"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="email" className="block font-medium text-[#737373]">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="mt-1 block w-full px-2 py-[6px] border border-gray-500 rounded-md shadow-sm bg-[#f7f7f7] outline-none"
                />
            </div>

            <div className="mb-4 flex-1">
                <label htmlFor="additionalInfo" className="block font-medium text-[#737373]">
                    Additional Info
                </label>
                <textarea
                    id="additionalInfo"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Additional Info"
                    className="resize-none h-[100px] mt-1 block w-full px-2 py-[6px] border border-gray-500 rounded-md shadow-sm bg-[#f7f7f7] outline-none"
                />
            </div>

            <button
                // type="submit"
                className={`bg-[#0085ff] transition-all duration-200 text-white rounded-xl w-full text-center py-2 ${loading
                    ? "bg-gray-400 hover:cursor-not-allowed"
                    : "hover:bg-gray-800 hover:cursor-pointer"
                    }`}
                disabled={loading}
            >
                {loading ? (
                    <FaSpinner className="animate-spin place-self-center text-xl" />
                ) : (
                    "Create Non-Teaching Staff"
                )}
            </button>
        </form>
    );
};

export default NonTeachingStaffForm;
