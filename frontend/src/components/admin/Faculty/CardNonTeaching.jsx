import React, { useState } from 'react';
import DeleteModal from './DeleteModal';
import EditNonTeaching from './EditNonTeaching';
import { MdEdit, MdDelete } from 'react-icons/md';

const CardTeaching = ({ facultyMembers, setRefresh }) => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [facultyToDelete, setFacultyToDelete] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [facultyToEdit, setFacultyToEdit] = useState(null);

    const handleEdit = (facultyId) => {
        setFacultyToEdit(facultyMembers.find(faculty => faculty.id === facultyId));
        setEditModal(true);
    };

    const handleDelete = (facultyId, facultyName) => {
        setFacultyToDelete({ facultyId, facultyName });
        setDeleteModal(true);
    };

    const deleteModalClose = () => {
        setDeleteModal(false);
        setFacultyToDelete(null);
    };

    const editModalClose = () => {
        setEditModal(false);
        setFacultyToEdit(null);
    };

    return (
        <div className="gap-4 px-4 w-full">
            <div>
                <table className='text-center bg-white rounded-md place-self-center my-4 w-full table-fixed'>
                    <thead>
                        <tr className='text-gray-600 border-b-2 border-gray-400'>
                            <th className='p-2'>Name</th>
                            <th className='p-2'>Designation</th>
                            <th className='p-2 sm:table-cell hidden'>Email</th>
                            <th className='p-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facultyMembers?.map((faculty) => (
                            <tr className='hover:bg-gray-200 cursor-pointer transition-all duration-150'>
                                <td className='p-2'>{faculty.staff_name}</td>
                                <td className='p-2'>{faculty.designation}</td>
                                <td className='p-2 sm:table-cell hidden'>{faculty.email === ''?'NA':faculty.email}</td>
                                <td className='p-2 flex justify-center items-center gap-2'>
                                    <button
                                        className='hover:cursor-pointer flex justify-center items-center bg-gray-400 p-1 rounded hover:bg-blue-500 text-white'
                                        onClick={() => handleEdit(faculty.id)}
                                    >
                                        <MdEdit />
                                    </button>
                                    <button
                                        className='hover:cursor-pointer flex justify-center items-center bg-gray-400 p-1 rounded hover:bg-red-500 text-white'
                                        onClick={() => handleDelete(faculty.id, faculty.staff_name)}
                                    >
                                        <MdDelete />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={deleteModal}
                onClose={deleteModalClose}
                facultyId={facultyToDelete?.facultyId}
                facultyName={facultyToDelete?.facultyName}
                setRefresh={setRefresh}
            />

            {/* Edit Modal */}
            <EditNonTeaching
                isOpen={editModal}
                onClose={editModalClose}
                faculty={facultyToEdit}
                setRefresh={setRefresh}
            />
        </div>
    );
};

export default CardTeaching;
