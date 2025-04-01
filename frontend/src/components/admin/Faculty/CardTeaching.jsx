import React, { useState } from 'react';
import DeleteModal from './DeleteModal';
import EditTeaching from './EditTeaching';
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {facultyMembers?.map((faculty) => (
                <div
                    key={faculty.id}
                    className="flex flex-col items-center shadow-md gap-4 p-4 rounded-2xl bg-white border-gray-400 hover:border-black transition-all duration-200 h-full"
                >
                    <img
                        src={faculty.photo_url || 'default-image.jpg'}
                        alt={faculty.faculty_name}
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <div className="text-center">
                        <h3 className="font-bold text-lg">{faculty.faculty_name}</h3>
                        <p className="text-sm text-gray-600">{faculty.designation}</p>
                        <a href={`mailto:${faculty.email}`} className="text-sm">{faculty.email}</a>
                        <p className="text-sm text-gray-500">{faculty.degrees}</p>
                    </div>

                    <div className="flex gap-2 mt-auto">
                        <button
                            onClick={() => handleEdit(faculty.id)}
                            className="hover:cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(faculty.id, faculty.faculty_name)}
                            className="hover:cursor-pointer px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                            Delete
                        </button>
                    </div>

                </div>
            ))}
            {/* Delete Modal */}
            <DeleteModal
                isOpen={deleteModal}
                onClose={deleteModalClose}
                facultyId={facultyToDelete?.facultyId}
                facultyName={facultyToDelete?.facultyName}
                setRefresh={setRefresh}
                isTeaching='true'
            />
            <EditTeaching
                isOpen={editModal}
                onClose={editModalClose}
                faculty={facultyToEdit}
                setRefresh={setRefresh}
            />
        </div>
    );
};

export default CardTeaching;
