import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

import MyPdfViewer from '../../components/MyPdfViewer';

const apiUrl = import.meta.env.VITE_API_URL;

const Announcement = () => {
    const navigate = useNavigate();
    const downloadPDF = async (fileUrl) => {
        try {
            const response = await axios({
                url: fileUrl,
                method: 'GET',
                responseType: 'blob', // important: responseType as blob
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'filename.pdf'); // set desired file name here
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading PDF: ', error);
        }
    };
    const { announcementId } = useParams(); // Get the announcementId from the URL
    const [announcement, setAnnouncement] = useState(null); // State to store the announcement data
    const [loading, setLoading] = useState(true); // State to track loading
    const [error, setError] = useState(null); // State to track any errors

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/announcements/${announcementId}`);
                setAnnouncement(response.data.announcement); // Store announcement data in state
            } catch (err) {
                setError(err.message || 'An error occurred');
                navigate('/not-found');
            } finally {
                setLoading(false); // Stop loading after the request is complete
            }
        };

        fetchAnnouncement();
    }, [announcementId]); // Re-fetch announcement when announcementId changes

    useEffect(() => {
        if (announcement)
            document.title = `SIT | ${announcement?.title}`;
    }, [announcement]);

    if (loading) return <div className='text-5xl flex justify-center items-center mt-10'><FaSpinner className='animate-spin' /></div>;

    // Function to format a date object to "Month Day, Year at Hour:Minute AM/PM"
    const formatDateTime = (date) => {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return new Date(date).toLocaleString('en-US', options);
    };

    const announcedAt = formatDateTime(announcement?.announced_at);

    return (
        <div className='my-10 mx-4 max-w-[800px] w-full px-2 flex gap-3 flex-col place-self-center' style={{ fontFamily: "Montserrat" }}>
            <h1 className='sm:text-6xl text-4xl font-black text-center'>{announcement?.title}</h1>
            <p className='sm:text-xl text-lg mt-6'>{announcement?.content}</p>
            <div className='mt-4 sm:text-lg flex flex-col gap-1'>
                <p><strong>Announced At:</strong> {announcedAt}</p>
                <p><strong>Posted By:</strong> {announcement?.posted_by}</p>
                {announcement?.document && (
                    <button
                        onClick={()=>downloadPDF(announcement?.document)}
                        className='mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer'
                    >
                        Download Document
                    </button>
                )}
            </div>
            {
                announcement?.document && (
                    <MyPdfViewer document={announcement.document} />
                )
            }
        </div>
    );
};

export default Announcement;
