import React, { useState } from 'react';
import ViewModal from "./Modal"

const Table = ({ users, setRefresh }) => {
    const [modal, setModal] = useState(false);
    const [user, setUser] = useState(null); // Track the user to edit

    const [isRefresh,setIsRefresh]=useState(false)
    const handleEdit = (userId) => {
        setUser(users.find(user => user.id === userId));
        setModal(true); // Open the edit modal when a user is selected
    };

    const modalClose = () => {
        setModal(false);
        if(isRefresh){
            setRefresh(true)
        }
        setUser(null);
    };

    const headerStyle = 'px-2 py-2';
    const cellStyle = 'py-2 overflow-hidden text-ellipsis whitespace-nowrap';

    return (
        <div>
            <table className='text-center bg-white rounded-md place-self-center my-4 w-full table-fixed'>
                <thead>
                    <tr className='text-gray-600 border-b-2 border-gray-400'>
                        <th className='w-[40px]' />
                        <th className={`${headerStyle}`}>Name</th>
                        <th className={`${headerStyle} md:table-cell hidden`}>Email</th>
                        <th className={`${headerStyle} md:table-cell hidden`}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr
                            key={user.id}
                            className={`hover:bg-gray-200 cursor-pointer transition-all duration-150 ${user.status === 'Unseen' ? 'font-black text-black' : 'text-gray-900'}`}
                            onClick={() => handleEdit(user.id)}
                        >
                            <td>
                                <input checked={user.status==='Replied'} type='checkbox' readOnly className='w-[20px] size-5 px-2' />
                            </td>
                            <td className={`${cellStyle} px-2 text-left`}>{user.name}</td>
                            <td className={`${cellStyle} md:table-cell hidden`}>{user.email}</td>
                            <td className={`${cellStyle} md:table-cell hidden`}>{user.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Modal */}
            <ViewModal
                isOpen={modal}
                onClose={modalClose}
                user={user}  // Pass selected user for editing
                setRefresh={setRefresh}
                setIsRefresh={setIsRefresh}
            />
        </div>
    );
};

export default Table;
