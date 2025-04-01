import React, { useState } from 'react';
import { MdEdit, MdDelete, MdOutlineOpenInNew } from "react-icons/md";
import DeleteModal from './DeleteModal';
import EditModal from "./EditModal";

const Table = ({ news, setRefresh }) => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState(null); // Track the news to delete
    const [editModal, setEditModal] = useState(false);
    const [newsToEdit, setNewsToEdit] = useState(null); // Track the news to edit

    const handleEdit = (newsId) => {
        setNewsToEdit(news.find(newsItem => newsItem.news_id === newsId));
        setEditModal(true); // Open the edit modal when a news item is selected
    };

    const handleDelete = (newsId, newsTitle) => {
        setNewsToDelete({ newsId, newsTitle });
        setDeleteModal(true);
    };

    const deleteModalClose = () => {
        setDeleteModal(false);
        setNewsToDelete(null);
    };

    const editModalClose = () => {
        setEditModal(false);
        setNewsToEdit(null);
    };

    const handleView = (newsId) => {
        window.open(`/admin/news/${newsId}`, '_blank');
    };
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options); // Format date to "30 March, 2025"
    };

    const headerStyle = 'px-2 py-2';
    const cellStyle = 'py-2 overflow-hidden text-ellipsis whitespace-nowrap';

    return (
        <div>
            <table className='text-center bg-white rounded-md place-self-center my-4 w-full table-fixed'>
                <thead>
                    <tr className='text-gray-600 border-b-2 border-gray-400'>
                        <th className={`${headerStyle}`}>News Title</th>
                        <th className={`${headerStyle} md:table-cell hidden`}>Publication Date</th>
                        <th className={`${headerStyle}`}>Author</th>
                        <th className={`${headerStyle}`}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {news.map((newsItem) => (
                        <tr key={newsItem.news_id} className='hover:bg-gray-200 cursor-pointer transition-all duration-150'>
                            <td className={`${cellStyle} pl-2`}>{newsItem.title}</td>
                            <td className={`${cellStyle}  md:table-cell hidden`}>{formatDate(newsItem.published_at)}</td>
                            <td className={`${cellStyle}`}>{newsItem.author?newsItem.author:"Not Available"}</td>
                            <td className={`${cellStyle} flex justify-center items-center gap-2`}>
                                <button
                                    className='hover:cursor-pointer transition-all duration-200 flex justify-center items-center bg-gray-400 p-1 rounded hover:bg-blue-500 text-white'
                                    onClick={() => handleView(newsItem.news_id)}
                                >
                                    <MdOutlineOpenInNew />
                                </button>
                                <button
                                    className='hover:cursor-pointer transition-all duration-200 flex justify-center items-center bg-gray-400 p-1 rounded hover:bg-black text-white'
                                    onClick={() => handleEdit(newsItem.news_id)}
                                >
                                    <MdEdit />
                                </button>
                                <button
                                    className='hover:cursor-pointer transition-all duration-200 flex justify-center items-center bg-gray-400 p-1 rounded hover:bg-red-500 text-white'
                                    onClick={() => handleDelete(newsItem.news_id, newsItem.title)}
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
                newsId={newsToDelete?.newsId}  // Pass newsId for deletion
                newsTitle={newsToDelete?.newsTitle}  // Pass news title for deletion confirmation
                setRefresh={setRefresh}
            />

            {/* Edit Modal */}
            <EditModal
                isOpen={editModal}
                onClose={editModalClose}
                newsItem={newsToEdit}  // Pass selected news item for editing
                setRefresh={setRefresh}
            />
        </div>
    );
};

export default Table;
