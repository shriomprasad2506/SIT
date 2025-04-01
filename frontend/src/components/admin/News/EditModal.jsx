import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { IoMdCloudUpload } from "react-icons/io";
import { MdDelete } from "react-icons/md";

import Modal from "../../Modal";
import { FaSpinner } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_API_URL;

const EditModal = ({ isOpen, onClose, setRefresh, newsItem }) => {
    if (!isOpen) return null; // Don't render the modal if it's not open
    const [title, setTitle] = useState(newsItem?.title || '');
    const [content, setContent] = useState(newsItem?.content || '');
    const [author, setAuthor] = useState(newsItem?.author || '');
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(newsItem?.image || '');

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (newsItem) {
            setTitle(newsItem.title || '');
            setContent(newsItem.content || '');
            setAuthor(newsItem.author || '');
            setImagePreview(newsItem.image || '');
        }
    }, [newsItem]);

    // Handle input changes
    const handleInputChange = (e, setter) => {
        setter(e.target.value);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // Generate image preview
        if (selectedFile) {
            setImagePreview(URL.createObjectURL(selectedFile));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Perform validation
        if (!title) {
            toast.error("Please enter the news title.");
            return;
        }
        if (!content) {
            toast.error("Please enter the content for the news.");
            return;
        }

        // Create FormData to send the file along with other form data
        const formData = new FormData();
        formData.append("title", title);
        formData.append("author", author);
        formData.append("content", content);
        formData.append("imgUrl",imagePreview)
        if (file) formData.append("image", file);

        setLoading(true);
        try {
            const token = sessionStorage.getItem('authToken');

            const response = await axios.put(`${apiUrl}/api/news/${newsItem.news_id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}` // Pass the token in the Authorization header
                },
            });

            console.log(response.data);
            toast.success("News Updated.");
            setRefresh(true);
            onClose();
        } catch (error) {
            console.error("Error submitting the form:", error);
            toast.error("An error occurred while updating the news.");
        } finally {
            setLoading(false);
        }
    };

    const removeImg = () => {
        setFile(null);
        setImagePreview('');
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold mb-4 border-b-2 border-gray-100 pb-5">Edit News</h2>
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
                        placeholder="News Title"
                        className="mt-1 block w-full px-2 py-[6px] border border-gray-500 rounded-md shadow-sm bg-[#f7f7f7] outline-none"
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
                        placeholder="News Content"
                        className="mt-1 resize-none block w-full px-2 py-[6px] border border-gray-500 rounded-md shadow-sm bg-[#f7f7f7] outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="author" className="block font-medium text-[#737373]">
                        Author Name (optional)
                    </label>
                    <input
                        type="text"
                        id="author"
                        value={author}
                        onChange={(e) => handleInputChange(e, setAuthor)}
                        placeholder="News Author Name"
                        className="mt-1 block w-full px-2 py-[6px] border border-gray-500 rounded-md shadow-sm bg-[#f7f7f7] outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="file" className="block font-medium text-[#737373]">
                        News Image
                    </label>
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                        multiple={false}
                    />
                    <div className="mt-1 h-[100px] p-1 rounded-md flex justify-center items-center bg-[#f7f7f7] text-[#737373] border border-gray-500 relative">
                        {
                            imagePreview ? "" :
                                <label htmlFor="file"
                                    type="button"
                                    className="gap-2 py-2 px-4 w-full flex justify-center items-center"
                                >
                                    <IoMdCloudUpload className="text-xl" /> Choose Image
                                </label>
                        }
                        {imagePreview && (
                            <div>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-w-full h-[100px] object-cover rounded-md shadow-sm p-1"
                                />
                                <MdDelete className="absolute top-0 right-0 text-xl text-red-400 hover:text-red-600 transition-all duration-200 hover:cursor-pointer z-[50]" onClick={removeImg} />
                            </div>
                        )}
                    </div>
                </div>
                <button
                    type="submit"
                    className={`bg-[#0085ff] transition-all duration-200 text-white rounded-xl w-full text-center py-2 ${loading ? 'bg-gray-400 hover:cursor-not-allowed' : 'hover:bg-gray-800 hover:cursor-pointer'}`}
                    disabled={loading} // Disable the button when loading
                >
                    {loading ? (
                        <FaSpinner className="animate-spin place-self-center text-xl" />
                    ) : (
                        'Save News'
                    )}
                </button>
            </form>
        </Modal>
    );
};

export default EditModal;
