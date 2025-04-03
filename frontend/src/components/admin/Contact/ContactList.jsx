import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaAngleLeft, FaAngleRight, FaSpinner } from 'react-icons/fa';
import { TbRefresh } from "react-icons/tb";
const apiUrl = import.meta.env.VITE_API_URL;
import Table from './Table'; // Assuming a similar Table component for displaying contacts

const ContactList = ({ refresh, setRefresh }) => {
    // State variables to store contact data and pagination info
    const [contacts, setContacts] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total_count: 0,
        limit: 10,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch contact data from the API
    const fetchContacts = async (page = 1) => {
        setError(null);
        setLoading(true);
        setContacts([]);  // Clear previous contact data before fetching new data
        try {
            const token = sessionStorage.getItem("authToken");

            const response = await axios.get(`${apiUrl}/api/contact`, {
                params: {
                    page: page,
                    limit: pagination.limit,
                },
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            // Assuming the contacts are in response.data.contacts
            setContacts(response.data.contactForms); 
            setPagination(response.data.pagination);
            setRefresh(false);
        } catch (err) {
            setError('Error fetching contacts');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts(1); // Fetch contacts for the first page initially
        setPagination((prev) => ({ ...prev, current_page: 1 }));
    }, [refresh]);

    // Effect to fetch contacts when the current page changes
    useEffect(() => {
        fetchContacts(pagination.current_page); // Fetch contacts for the current page
    }, [pagination.current_page]);

    // Handle page change (pagination)
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.total_pages) {
            setPagination((prev) => ({
                ...prev,
                current_page: newPage,
            }));
        }
    };

    // Calculate total pages and range of pages
    const totalPages = pagination.total_pages;
    let pageNumbers = [];

    if (totalPages <= 3) {
        pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
    } else if (pagination.current_page <= 2) {
        pageNumbers = [1, 2, 3];
    } else if (pagination.current_page >= totalPages - 1) {
        pageNumbers = [totalPages - 2, totalPages - 1, totalPages];
    } else {
        pageNumbers = [pagination.current_page - 1, pagination.current_page, pagination.current_page + 1];
    }

    return (
        <div>
            {/* Error handling */}
            {error && (
                <TbRefresh
                    className={`hover:cursor-pointer text-red-500 ${refresh ? 'animate-spin' : ''}`}
                    size={50}
                    onClick={() => setRefresh(true)}
                />
            )}

            {/* Loading state */}
            {loading ? (
                <div className="flex justify-center items-center mt-10">
                    <FaSpinner className="animate-spin" size={50} />
                </div>
            ) : (
                <div>
                    {/* Only show if contacts are available */}
                    {contacts.length > 0 && (
                        <div>
                            <Table users={contacts} setRefresh={setRefresh} />
                            <div className="flex justify-center items-center mt-4 gap-2">
                                <button
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                    disabled={pagination.current_page === 1}
                                    className="disabled:opacity-50 hover:cursor-pointer"
                                >
                                    <FaAngleLeft />
                                </button>
                                {pageNumbers.map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`py-2 mx-1 hover:cursor-pointer ${pagination.current_page === pageNumber
                                            ? 'text-white font-bold text-[17px]'
                                            : 'text-white hover:underline'
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                    disabled={pagination.current_page === totalPages}
                                    className="disabled:opacity-50 hover:cursor-pointer"
                                >
                                    <FaAngleRight />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* No contacts found */}
            {contacts.length <= 0 && !loading && (
                <div className='text-xl mt-8 text-center'>No Contacts Found</div>
            )}
        </div>
    );
};

export default ContactList;
