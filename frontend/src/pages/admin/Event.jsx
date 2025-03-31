import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

const Event = () => {
    const navigate = useNavigate();

    const { eventId } = useParams(); // Get the eventId from the URL
    const [event, setEvent] = useState(null); // State to store the event data
    const [loading, setLoading] = useState(true); // State to track loading
    const [error, setError] = useState(null); // State to track any errors

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/events/${eventId}`);
                console.log(response);
                setEvent(response.data.event); // Store event data in state
            } catch (err) {
                setError(err.message || 'An error occurred');
                navigate('/not-found');
            } finally {
                setLoading(false); // Stop loading after the request is complete
            }
        };

        fetchEvent();
    }, [eventId]); // Re-fetch event when eventId changes

    useEffect(() => {
        if (event)
            document.title = `SIT | ${event?.event_name}`;
    }, [event]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    console.log(event);

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

    // Function to calculate the end time
    const calculateEndTime = (startDate, durationInMinutes) => {
        const startTime = new Date(startDate);
        startTime.setMinutes(startTime.getMinutes() + durationInMinutes); // Add duration to start time
        return formatDateTime(startTime);
    };

    // Function to combine event_date and event_time
    const getStartTime = (eventDate, eventTime) => {
        const date = new Date(eventDate);
        const timeParts = eventTime.split(':');
        date.setHours(timeParts[0], timeParts[1], timeParts[2]); // Set the time to the event_time
        return date;
    };

    // Combine event_date and event_time to get the start time
    const startTime = getStartTime(event?.event_date, event?.event_time);
    const formattedStartTime = formatDateTime(startTime);

    // Calculate the end time
    const endTime = calculateEndTime(startTime, event?.duration);

    return (
        <div className='my-10 mx-4 max-w-[800px] flex gap-3 justify-center items-center flex-col place-self-center' style={{ fontFamily: "Montserrat" }}>
            <h1 className='sm:text-6xl text-4xl font-black'>{event?.event_name}</h1>
            <img src={event?.image} className='w-full h-auto rounded-2xl' alt="Event" />
            <p className='text-white sm:text-xl text-lg mt-6'>{event?.description}</p>

            <div className='text-white mt-4 sm:text-lg flex flex-col gap-1'>
                <p><strong>Location:</strong> {event?.location}</p>
                <p><strong>Start Time:</strong> {formattedStartTime}</p>
                <p><strong>End Time:</strong> {endTime}</p>
                <p><strong>Created At:</strong> {formatDateTime(event?.created_at)}</p>
            </div>
        </div>
    );
};

export default Event;
