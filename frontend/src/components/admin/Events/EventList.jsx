import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaAngleLeft, FaAngleRight, FaSpinner } from 'react-icons/fa';
import { TbRefresh } from "react-icons/tb";
const apiUrl = import.meta.env.VITE_API_URL;
import Table from './Table';

const EventList = ({ category, refresh, setRefresh, searchTerm }) => {
    // State variables to store events and pagination info
    const [events, setEvents] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total_count: 0,
        limit: 10,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);  // changed to null for clarity

    // Function to fetch events from the API
    const fetchEvents = async (page = 1, category = 'all', search = '') => {
        setError(null);
        setLoading(true);
        setEvents([]);
        try {
            const response = await axios.get(`${apiUrl}/api/events`, {
                params: {
                    page: page,
                    limit: pagination.limit,
                    category: category,
                    search: search,  // Send the search term as a query parameter
                },
            });

            setEvents(response.data.events);
            setPagination(response.data.pagination);
            setRefresh(false);
        } catch (err) {
            setError('Error fetching events');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents(1, category, searchTerm); // Trigger fetch on category or search term change
        setPagination((prev) => ({ ...prev, current_page: 1 }));
    }, [category, refresh, searchTerm]);

    // Effect to fetch events when the current page changes
    useEffect(() => {
        fetchEvents(pagination.current_page, category); // Fetch events for the current page
    }, [pagination.current_page, category]); // Run effect when current page changes

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

    // Rendering the events
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
                    {/* Only show if events are available */}
                    {events.length > 0 && (
                        <div>
                            <Table events={events} setRefresh={setRefresh} />
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
            {searchTerm && events.length<=0 && !loading && (
                <div className='text-xl mt-8 text-center'>No Events Found with Such Name</div>
            )}
        </div>
    );
};

export default EventList;
