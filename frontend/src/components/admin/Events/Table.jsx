import React, { useState } from 'react';
import { MdEdit, MdDelete, MdOutlineOpenInNew } from "react-icons/md";
import DeleteModal from './DeleteModal';
import EditModal from "./EditModal";

const Table = ({ events, setRefresh }) => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null); // Track the event to delete
    const [editModal, setEditModal] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null); // Track the event to edit
    console.log(events)
    const handleEdit = (eventId) => {
        setEventToEdit(events.find(event => event.event_id === eventId));
        setEditModal(true); // Open the edit modal when an event is selected
    };

    const handleDelete = (eventId, eventName) => {
        setEventToDelete({ eventId, eventName });
        setDeleteModal(true);
    };

    const deleteModalClose = () => {
        setDeleteModal(false);
        setEventToDelete(null);
    };

    const editModalClose = async () => {
        setEditModal(false);
        setEventToEdit(null);
    };

    const handleView = (eventId) => {
        window.open(`/admin/events/${eventId}`, '_blank');
    };

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options); // e.g., "4 April, 2025"
    };
    
    // Function to format the time
    const formatTime = (isoTime) => {
        const date = new Date(`1970-01-01T${isoTime}Z`); // This converts the isoTime to UTC first
    
        // Subtract 5 hours and 30 minutes
        date.setHours(date.getHours() - 5);
        date.setMinutes(date.getMinutes() - 30);
    
        const options = { hour: '2-digit', minute: '2-digit', hour12: true };
        return date.toLocaleTimeString('en-GB', options); // Converts to adjusted local time
    };

    const headerStyle = 'px-2 py-2';
    const cellStyle = 'py-2 overflow-hidden text-ellipsis whitespace-nowrap';

    return (
        <div>
            <table className='text-center bg-white rounded-md place-self-center my-4 w-full table-fixed'>
                <thead>
                    <tr className='text-gray-600 border-b-2 border-gray-400'>
                        <th className={`${headerStyle}`}>Event Name</th>
                        <th className={`${headerStyle}`}>Event Date</th>
                        <th className={`${headerStyle} md:table-cell hidden`}>Event Time</th>
                        <th className={`${headerStyle} lg:table-cell hidden`}>Duration (minutes)</th>
                        <th className={`${headerStyle} sm:table-cell hidden`}>Location</th>
                        <th className={`${headerStyle}`}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => (
                        <tr key={event.event_id} className='hover:bg-gray-200 cursor-pointer transition-all duration-150'>
                            <td className={`${cellStyle} pl-2`}>{event.event_name}</td>
                            <td className={`${cellStyle}`}>{formatDate(event.event_date)}</td>
                            <td className={`${cellStyle} md:table-cell hidden`}>{formatTime(event.event_time)}</td>
                            <td className={`${cellStyle} lg:table-cell hidden`}>{event.duration}</td>
                            <td className={`${cellStyle} sm:table-cell hidden`}>{event.location}</td>
                            <td className={`${cellStyle} flex justify-center items-center gap-2`}>
                                <button
                                    className='hover:cursor-pointer transition-all duration-200 flex justify-center items-center bg-gray-400 p-1 rounded hover:bg-blue-500 text-white'
                                    onClick={() => handleView(event.event_id)}
                                >
                                    <MdOutlineOpenInNew />
                                </button>
                                <button
                                    className='hover:cursor-pointer transition-all duration-200 flex justify-center items-center bg-gray-400 p-1 rounded hover:bg-black text-white'
                                    onClick={() => handleEdit(event.event_id)}
                                >
                                    <MdEdit />
                                </button>
                                <button
                                    className='hover:cursor-pointer transition-all duration-200 flex justify-center items-center bg-gray-400 p-1 rounded hover:bg-red-500 text-white'
                                    onClick={() => handleDelete(event.event_id, event.event_name)}
                                >
                                    <MdDelete />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={deleteModal}
                onClose={deleteModalClose}
                eventId={eventToDelete?.eventId}
                eventName={eventToDelete?.eventName}
                setRefresh={setRefresh}
            />

            {/* Edit Modal */}
            <EditModal
                isOpen={editModal}
                onClose={editModalClose}
                event={eventToEdit}
                setRefresh={setRefresh}
            />
        </div>
    );
};

export default Table;
