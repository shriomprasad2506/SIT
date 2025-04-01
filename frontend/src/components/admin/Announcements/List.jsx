import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaAngleLeft, FaAngleRight, FaSpinner } from 'react-icons/fa';
import { TbRefresh } from "react-icons/tb";
const apiUrl = import.meta.env.VITE_API_URL;
import Table from './Table'; // Assuming Table is a generic component for listing items

const AnnouncementList = ({ refresh, setRefresh, searchTerm }) => {
    // State variables to store announcements and pagination info
    const [announcements, setAnnouncements] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total_count: 0,
        limit: 10,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);  // changed to null for clarity

    // Function to fetch announcements from the API
    const fetchAnnouncements = async (page = 1, search = '') => {
        setError(null);
        setLoading(true);
        setAnnouncements([]);
        try {
            const response = await axios.get(`${apiUrl}/api/announcements`, {
                params: {
                    page: page,
                    limit: pagination.limit,
                    search: search,  // Send the search term as a query parameter
                },
            });

            setAnnouncements(response.data.announcements);
            setPagination(response.data.pagination);
            setRefresh(false);
        } catch (err) {
            setError('Error fetching announcements');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements(1, searchTerm); // Trigger fetch on search term change
        setPagination((prev) => ({ ...prev, current_page: 1 }));
    }, [refresh, searchTerm]);

    // Effect to fetch announcements when the current page changes
    useEffect(() => {
        fetchAnnouncements(pagination.current_page); // Fetch announcements for the current page
    }, [pagination.current_page]); // Run effect when current page changes

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
                    {/* Only show if announcements are available */}
                    {announcements.length > 0 && (
                        <div>
                            <Table announcements={announcements} setRefresh={setRefresh} />
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
            {searchTerm && announcements.length <= 0 && !loading && (
                <div className='text-xl mt-8 text-center'>No Such Announcements Found.</div>
            )}
        </div>
    );
};

export default AnnouncementList;
