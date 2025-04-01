import React, { useState } from 'react';
import { MdEdit, MdDelete, MdOutlineOpenInNew } from "react-icons/md";
import DeleteModal from './DeleteModal';
import EditModal from "./EditModal";

const Table = ({ announcements, setRefresh }) => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState(null); // Track the announcement to delete
    const [editModal, setEditModal] = useState(false);
    const [announcementToEdit, setAnnouncementToEdit] = useState(null); // Track the announcement to edit

    const handleEdit = (announcementId) => {
        setAnnouncementToEdit(announcements.find(announcement => announcement.announcement_id === announcementId));
        setEditModal(true); // Open the edit modal when an announcement is selected
    };

    const handleDelete = (announcementId, announcementTitle) => {
        setAnnouncementToDelete({ announcementId, announcementTitle });
        setDeleteModal(true);
    };

    const deleteModalClose = () => {
        setDeleteModal(false);
        setAnnouncementToDelete(null);
    };

    const editModalClose = async () => {
        setEditModal(false);
        setAnnouncementToEdit(null);
    };

    const handleView = (announcementId) => {
        window.open(`/admin/announcements/${announcementId}`, '_blank');
    };

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options); // e.g., "4 April, 2025"
    };
    
    const headerStyle = 'px-2 py-2';
    const cellStyle = 'py-2 overflow-hidden text-ellipsis whitespace-nowrap';

    return (
        <div>
            <table className='text-center bg-white rounded-md place-self-center my-4 w-full table-fixed'>
                <thead>
                    <tr className='text-gray-600 border-b-2 border-gray-400'>
                        <th className={`${headerStyle}`}>Title</th>
                        <th className={`${headerStyle}`}>Posted By</th>
                        <th className={`${headerStyle} md:table-cell hidden`}>Announced At</th>
                        <th className={`${headerStyle}`}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {announcements.map((announcement) => (
                        <tr key={announcement.announcement_id} className='hover:bg-gray-200 cursor-pointer transition-all duration-150'>
                            <td className={`${cellStyle} pl-2`}>{announcement.title}</td>
                            <td className={`${cellStyle}`}>{announcement.posted_by?announcement.posted_by:'Not Available'}</td>
                            <td className={`${cellStyle} md:table-cell hidden`}>{formatDate(announcement.announced_at)}</td>
                            <td className={`${cellStyle} flex justify-center items-center gap-2`}>
                                <button
                                    className='hover:cursor-pointer transition-all duration-200 flex justify-center items-center bg-gray-400 p-1 rounded hover:bg-blue-500 text-white'
                                    onClick={() => handleView(announcement.announcement_id)}
                                >
                                    <MdOutlineOpenInNew />
                                </button>
                                <button
                                    className='hover:cursor-pointer transition-all duration-200 flex justify-center items-center bg-gray-400 p-1 rounded hover:bg-black text-white'
                                    onClick={() => handleEdit(announcement.announcement_id)}
                                >
                                    <MdEdit />
                                </button>
                                <button
                                    className='hover:cursor-pointer transition-all duration-200 flex justify-center items-center bg-gray-400 p-1 rounded hover:bg-red-500 text-white'
                                    onClick={() => handleDelete(announcement.announcement_id, announcement.announcement_title)}
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
                announcementId={announcementToDelete?.announcementId}
                announcementTitle={announcementToDelete?.announcementTitle}
                setRefresh={setRefresh}
            />

            {/* Edit Modal */}
            <EditModal
                isOpen={editModal}
                onClose={editModalClose}
                announcement={announcementToEdit}
                setRefresh={setRefresh}
            />
        </div>
    );
};

export default Table;
