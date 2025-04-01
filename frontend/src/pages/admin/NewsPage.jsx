import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const apiUrl = import.meta.env.VITE_API_URL;

const NewsPage = () => {
    const navigate = useNavigate();

    const { newsId } = useParams(); // Get the eventId from the URL
    const [news, setNews] = useState(null); // State to store the event data
    const [loading, setLoading] = useState(true); // State to track loading
    const [error, setError] = useState(null); // State to track any errors

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/news/${newsId}`);
                setNews(response.data.news); // Store event data in state
            } catch (err) {
                setError(err.message || 'An error occurred');
                navigate('/not-found');
            } finally {
                setLoading(false); // Stop loading after the request is complete
            }
        };

        fetchNews();
    }, [newsId]); // Re-fetch event when eventId changes

    useEffect(() => {
        if (news)
            document.title = `SIT | ${news?.title}`;
    }, [news]);

    if (loading) return <div className='text-5xl flex justify-center items-center mt-10'><FaSpinner className='animate-spin' /></div>;

    // Function to format a date object to "Month Day, Year at Hour:Minute AM/PM"
    const formatDateTime = (date) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Date(date).toLocaleString('en-US', options);
    };

    return (
        <div className='my-10 mx-4 max-w-[800px] flex gap-3 justify-center items-center flex-col place-self-center' style={{ fontFamily: "Montserrat" }}>
            <h1 className='sm:text-6xl text-4xl font-black'>{news?.title}</h1>
            <div className='flex sm:flex-row flex-col justify-between w-full'>
                <p className='text-left'>By {news?.author}</p>
                <p>Published At: {formatDateTime(news?.published_at)}</p>
            </div>
            {
                news?.image &&
                <img src={news?.image} className='w-full h-auto rounded-2xl' alt="Event" />
            }
            <p className='text-white sm:text-xl text-lg mt-6'>{news?.content}</p>
        </div>
    );
};

export default NewsPage;
