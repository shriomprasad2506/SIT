import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { IoMdCloudUpload } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_API_URL;

const TeachingStaffForm = ({ onClose, setRefresh }) => {
    const [departmentName, setDepartmentName] = useState("");
    const [departmentCode, setDepartmentCode] = useState("");
    const [facultyName, setFacultyName] = useState("");
    const [designation, setDesignation] = useState("");
    const [email, setEmail] = useState("");
    const [degrees, setDegrees] = useState("");
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setPhoto(selectedFile);

        if (selectedFile) {
            setPhotoPreview(URL.createObjectURL(selectedFile));
        }
    };

    const removePhoto = () => {
        setPhoto(null);
        setPhotoPreview("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!facultyName || !designation) {
            toast.error("Faculty Name and Designation are required.");
            return;
        }

        const formData = new FormData();
        formData.append("department_name", departmentName);
        formData.append("department_code", departmentCode);
        formData.append("faculty_name", facultyName);
        formData.append("designation", designation);
        formData.append("email", email);
        formData.append("degrees", degrees);
        if (photo) formData.append("photo", photo);

        setLoading(true);
        try {
            const token = sessionStorage.getItem("authToken");

            const response = await axios.post(`${apiUrl}/api/faculty/teaching/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Teaching Faculty created successfully.");
            setRefresh(true);
            onClose();
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error creating teaching faculty.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="facultyName" className="block font-medium text-[#737373]">
                    Faculty Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="facultyName"
                    value={facultyName}
                    onChange={(e) => setFacultyName(e.target.value)}
                    placeholder="Faculty Name"
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
            <div className="flex w-full sm:gap-2 flex-grow sm:flex-row flex-col">

                <div className="mb-4 flex-1">
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

                <div className="mb-4 flex-1">
                    <label htmlFor="departmentCode" className="block font-medium text-[#737373]">
                        Department Code
                    </label>
                    <input
                        type="text"
                        id="departmentCode"
                        value={departmentCode}
                        onChange={(e) => setDepartmentCode(e.target.value)}
                        placeholder="Department Code"
                        className="mt-1 block w-full px-2 py-[6px] border border-gray-500 rounded-md shadow-sm bg-[#f7f7f7] outline-none"
                    />
                </div>

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
            <div className="flex flex-grow sm:flex-row flex-col sm:gap-3">

                <div className="mb-4 flex-1">
                    <label htmlFor="degrees" className="block font-medium text-[#737373]">
                        Degrees
                    </label>
                    <textarea
                        id="degrees"
                        value={degrees}
                        onChange={(e) => setDegrees(e.target.value)}
                        placeholder="Degrees"
                        className="resize-none h-[100px] mt-1 block w-full px-2 py-[6px] border border-gray-500 rounded-md shadow-sm bg-[#f7f7f7] outline-none"
                    />
                </div>

                <div className="mb-4 flex-1">
                    <label htmlFor="photo" className="block font-medium text-[#737373]">
                        Photo
                    </label>
                    <input
                        type="file"
                        id="photo"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <div className="mt-1 h-[100px] p-1 rounded-md flex justify-center items-center bg-[#f7f7f7] text-[#737373] border border-gray-500 relative">
                        {photo ? (
                            <div >
                                <img
                                    src={photoPreview}
                                    alt="Preview"
                                    className="max-w-full h-[100px] object-cover rounded-md shadow-sm p-1"
                                />
                                <MdDelete
                                    className="absolute top-0 right-0 text-xl text-red-400 hover:text-red-600 transition-all duration-200 hover:cursor-pointer z-[50]"
                                    onClick={removePhoto}
                                />
                            </div>
                        ) : (
                            <label
                                htmlFor="photo"
                                type="button"
                                className="gap-2 py-2 px-4 w-full flex justify-center items-center"
                            >
                                <IoMdCloudUpload className="text-xl" /> Upload Photo
                            </label>
                        )}
                    </div>
                </div>
            </div>
            <button
                type="submit"
                className={`bg-[#0085ff] transition-all duration-200 text-white rounded-xl w-full text-center py-2 ${loading
                    ? "bg-gray-400 hover:cursor-not-allowed"
                    : "hover:bg-gray-800 hover:cursor-pointer"
                    }`}
                disabled={loading}
            >
                {loading ? (
                    <FaSpinner className="animate-spin place-self-center text-xl" />
                ) : (
                    "Create Teaching Faculty"
                )}
            </button>
        </form>
    );
};

export default TeachingStaffForm;
