import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { IoMdCloudUpload } from "react-icons/io";
import { MdDelete } from "react-icons/md";

import Modal from "../../Modal";
import { FaSpinner } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_API_URL;

const EditAnnouncementModal = ({ isOpen, onClose, setRefresh, announcement }) => {
    if (!isOpen) return null; // Don't render the modal if it's not open

    const [title, setTitle] = useState(announcement?.title || '');
    const [content, setContent] = useState(announcement?.content || '');
    const [postedBy, setPostedBy] = useState(announcement?.posted_by || '');
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(announcement?.document || null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (announcement) {
            setTitle(announcement.title || '');
            setContent(announcement.content || '');
            setPostedBy(announcement.posted_by || '');
            setFilePreview(announcement.document || '');
        }
    }, [announcement]);

    // Handle input changes
    const handleInputChange = (e, setter) => {
        setter(e.target.value);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // Generate file preview (e.g., for PDFs, you may want to display the file name)
        if (selectedFile) {
            setFilePreview(selectedFile.name);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Perform validation
        if (!title) {
            toast.error("Please enter the announcement title.");
            return;
        }
        if (!postedBy) {
            toast.error("Please enter the Posted By.");
            return;
        }
        if (!content) {
            toast.error("Please enter content for the announcement.");
            return;
        }

        // Create FormData to send the file along with other form data
        const formData = new FormData();
        formData.append("title", title);
        formData.append("posted_by", postedBy);
        formData.append("content", content);
        formData.append("documentUrl",filePreview)
        if (file) formData.append("document", file);

        setLoading(true);
        try {
            const token = sessionStorage.getItem('authToken');

            const response = await axios.put(`${apiUrl}/api/announcements/${announcement.announcement_id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}` // Pass the token in the Authorization header
                },
            });

            console.log(response.data);
            toast.success("Announcement Updated.");
            setRefresh(true);
            onClose();
        } catch (error) {
            console.error("Error submitting the form:", error);
            toast.error("An error occurred while updating the announcement.");
        } finally {
            setLoading(false);
        }
    };

    const removeFile = () => {
        setFile(null);
        setFilePreview(null);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold mb-4 border-b-2 border-gray-100 pb-5">Edit Announcement</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block font-medium text-[#737373]">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => handleInputChange(e, setTitle)}
                        placeholder="Announcement Title"
                        className="mt-1 block w-full px-2 py-[6px] border border-gray-500 rounded-md shadow-sm  bg-[#f7f7f7] outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="content" className="block font-medium text-[#737373]">
                        Content
                    </label>
                    <textarea
                        id="content"
                        rows={5}
                        value={content}
                        onChange={(e) => handleInputChange(e, setContent)}
                        placeholder="Announcement Content"
                        className="mt-1 resize-none block w-full px-2 py-[6px] border border-gray-500 rounded-md shadow-sm  bg-[#f7f7f7] outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="postedBy" className="block font-medium text-[#737373]">
                        Posted By
                    </label>
                    <input
                        type="text"
                        id="postedBy"
                        value={postedBy}
                        onChange={(e) => handleInputChange(e, setPostedBy)}
                        placeholder="Posted By"
                        className="mt-1 resize-none block w-full px-2 py-[6px] border border-gray-500 rounded-md shadow-sm  bg-[#f7f7f7] outline-none"
                    />
                </div>

                <div className="mb-4 flex items-center gap-2">
                    <p htmlFor="file" className="block font-medium text-[#737373]">
                        Supporting Document
                    </p>
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="application/pdf"
                        multiple={false}
                    />
                    <div className="mt-1 flex-1 rounded-md flex justify-center items-center bg-[#f7f7f7] text-[#737373] border border-gray-500 relative">
                        {!file && !filePreview && (
                            <label
                                htmlFor="file"
                                type="button"
                                className="gap-2 py-2 px-4 w-full flex justify-center items-center"
                            >
                                <IoMdCloudUpload className="text-xl" /> Choose Document (PDF)
                            </label>
                        )}
                        {(file || filePreview) && (
                            <div className="flex py-2 px-4 items-center justify-between w-full">
                                <a href={filePreview} target="_blank" className="hover:cursor-pointer"><span className="text-gray-700">{announcement.title}</span></a>
                                <MdDelete
                                    className="text-xl text-red-400 hover:text-red-600 transition-all duration-200 hover:cursor-pointer"
                                    onClick={removeFile}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    className={`bg-[#0085ff] transition-all duration-200 text-white rounded-xl w-full text-center py-2 ${loading ? 'bg-gray-400 hover:cursor-not-allowed' : 'hover:bg-gray-800 hover:cursor-pointer'
                        }`}
                    disabled={loading} // Disable the button when loading
                >
                    {loading ? (
                        <FaSpinner className="animate-spin place-self-center text-xl" />
                    ) : (
                        'Save Announcement'
                    )}
                </button>
            </form>
        </Modal>
    );
};

export default EditAnnouncementModal;
