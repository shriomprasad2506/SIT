import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "../../Modal";

const apiUrl = import.meta.env.VITE_API_URL;

const ViewModal = ({ isOpen, onClose, user,setIsRefresh,setRefresh}) => {
    if (!isOpen) return null; // Don't render the modal if it's not open

    const token = sessionStorage.getItem("authToken");

    const [replyMessage, setReplyMessage] = useState(""); // State for storing reply message
    const [loading,setLoading]=useState(false)
    // Update status to "Seen" when the modal is opened
    useEffect(() => {
        if (isOpen && user.status === 'Unseen') {
            updateContactFormStatus(user.id, "Seen"); // Set status to "Seen" when modal opens
        }
    }, [isOpen, user?.id]);

    const updateContactFormStatus = async (contactId, status) => {
        try {
            // Ensure the token exists
            if (!token) {
                toast.error("No authentication token found.");
                return;
            }

            const response = await axios.put(
                `${apiUrl}/api/contact/status`,  // Correct endpoint
                {
                    contact_id: contactId,
                    status
                },
                {
                    headers: {
                        "Content-Type": "application/json",  // Correct content type
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                console.log(response.data.message); // Success message
                setIsRefresh(true)
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("An error occurred while updating the status.");
        }
    };

    // Handle reply submission
    const handleReply = async () => {
        if (!replyMessage.trim()) {
            toast.error("Please enter a reply.");
            return;
        }
        try {
            setLoading(true)
            // API call to send the reply
            const response = await axios.post(`${apiUrl}/api/contact/reply`, 
                { contact_id: user.id, message: replyMessage },
                {
                    headers: {
                        "Content-Type": "application/json",  // Correct content type
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.status)
            if (response.status === 200) {
                updateContactFormStatus(user.id, "Replied"); // Set status to "Replied" after reply
                setRefresh(true)
                toast.success(response.data.message); // Success message
                setReplyMessage(""); // Reset reply field
                onClose(); // Close the modal
            } else {
                toast.error("Failed to send the reply.");
            }
        } catch (error) {
            console.error("Error sending reply:", error);
            toast.error("Something went wrong. Please try again.");
        } finally{
            setLoading(false)
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold border-b pb-4 mb-6">Message Details</h2>

            <div className="space-y-4">
                <div>
                    <strong className="text-gray-700">From:</strong>
                    <p className="text-gray-600">{user.name}</p>
                </div>
                <div>
                    <strong className="text-gray-700">Email:</strong>
                    <p className="text-gray-600">{user.email}</p>
                </div>
                <div>
                    <strong className="text-gray-700">Message:</strong>
                    <p className="text-gray-600">{user.message}</p>
                </div>
                <div>
                    <strong className="text-gray-700">Status:</strong>
                    <p className="text-gray-600">{user.status}</p>
                </div>
                <div>
                    <strong className="text-gray-700">Received at:</strong>
                    <p className="text-gray-600">
                        {new Date(user.created_at).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Reply Section */}
            <div className="mt-6">
                <textarea
                    className="w-full p-4 border resize-none border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
                    rows="4"
                    placeholder="Write your reply..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                />
                <button
                    onClick={handleReply}
                    disabled={loading}
                    className={`${loading?'hover:cursor-not-allowed':'hover:cursor-pointer'} mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                    Reply
                </button>
            </div>
        </Modal>
    );
};

export default ViewModal;
