import { IoMdClose } from "react-icons/io";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const DeleteModal = ({ isOpen, onClose, newsId, newsTitle, setRefresh }) => {
    if (!isOpen) return null;

    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();  // Close the modal if the user clicks outside
        }
    };

    const handleDelete = async () => {
        try {
            // Replace the URL below with your actual API endpoint
            const authToken = sessionStorage.getItem('authToken');

            // Check if token exists, if not handle accordingly
            if (!authToken) {
                console.error("No authentication token found");
                return;
            }

            // Replace 'apiUrl' with your actual API URL for news
            const response = await axios.delete(`${apiUrl}/api/news/${newsId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}` // Add the token in the Authorization header
                }
            });

            if (response.status === 200) {
                console.log(`Deleted news item ${newsTitle} with ID: ${newsId}`);
                // You can trigger a state update or refresh the news list here if needed
                setRefresh(true);
                onClose(); // Close modal after successful delete
            }
        } catch (error) {
            console.error('Error deleting news item:', error);
            // You can show an error message to the user here if necessary
        }
    };

    return (
        <div
            className="fixed inset-0 items-center flex justify-center z-50"
            onClick={handleOutsideClick}  // Adding event to handle click outside
        >
            <div className="lg:m-20 sm:m-10 m-3 bg-gray-200 w-full max-h-[95vh] overflow-auto rounded-3xl sm:p-8 p-3 relative max-w-[400px]">
                <button
                    onClick={onClose}
                    className="text-2xl hover:cursor-pointer absolute top-4 right-4 text-black hover:text-red-500 rounded-full"
                >
                    <IoMdClose />
                </button>
                <p>Are you sure you want to delete the news item titled "{newsTitle}"?</p>
                <div className="flex justify-between mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete} // Call handleDelete on button click
                        className="px-4 py-2 bg-red-500 text-white rounded hover:cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
