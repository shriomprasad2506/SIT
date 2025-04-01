import { IoMdClose } from "react-icons/io";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const DeleteModal = ({ isOpen, onClose, facultyId, facultyName, isTeaching=false, setRefresh }) => {
    if (!isOpen) return null;

    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    const handleDelete = async () => {
        try {
            const authToken = sessionStorage.getItem("authToken");
            if (!authToken) {
                console.error("No authentication token found");
                return;
            }
            console.log(isTeaching)
            const endpoint = isTeaching
                ? `${apiUrl}/api/faculty/teaching/${facultyId}`
                : `${apiUrl}/api/faculty/non_teaching/${facultyId}`;

            const response = await axios.delete(endpoint, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.status === 200) {
                console.log(`Deleted faculty ${facultyName} with ID: ${facultyId}`);
                setRefresh(true); // Refresh the faculty list
                onClose(); // Close modal after successful delete
            }
        } catch (error) {
            console.error("Error deleting faculty:", error);
            // Optionally show error to user
        }
    };

    return (
        <div
            className="fixed inset-0 items-center flex justify-center z-50"
            onClick={handleOutsideClick}
        >
            <div className="lg:m-20 sm:m-10 m-3 bg-gray-200 w-full max-h-[95vh] overflow-auto rounded-3xl sm:p-8 p-3 relative max-w-[400px]">
                <button
                    onClick={onClose}
                    className="text-2xl hover:cursor-pointer absolute top-4 right-4 text-black hover:text-red-500 rounded-full"
                >
                    <IoMdClose />
                </button>
                <p className="mt-4">
                    Are you sure you want to delete the {isTeaching ? "teaching" : "non-teaching"} faculty{" "}
                    <strong>{facultyName}</strong>?
                </p>

                <div className="flex justify-between mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
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
