import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import Modal from "../../Modal";
import TeachingForm from "./TeachingForm";
import NonTeachingForm from "./NonTeachingForm";

const Form = ({ isOpen, onClose, setRefresh }) => {
    if (!isOpen) return null; // Don't render the modal if it's not open
    const [type, setType] = useState('');

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold mb-4 border-b-2 border-gray-100 pb-5">Create Faculty</h2>
            {
                !type ? (
                    <div className="flex flex-col gap-5 mt-4">
                        <div
                            onClick={() => setType('Teaching')}
                            className="border-2 border-gray-300 cursor-pointer hover:shadow-lg transition-all duration-200 shadow-md rounded-xl text-2xl px-4 py-3 flex justify-between items-center"
                        >
                            Teaching Staff <FaChevronRight />
                        </div>
                        <div
                            onClick={() => setType('Non Teaching')}
                            className="border-2 border-gray-300 cursor-pointer hover:shadow-lg transition-all duration-200 shadow-md rounded-xl text-2xl px-4 py-3 flex justify-between items-center"
                        >
                            Non Teaching Staff <FaChevronRight />
                        </div>
                    </div>
                ) : (
                    type === 'Teaching' ? (
                        <TeachingForm onClose={onClose} setRefresh={setRefresh} />
                    ) : (
                        <NonTeachingForm onClose={onClose} setRefresh={setRefresh} />
                    )
                )
            }
        </Modal>
    );
};

export default Form;
