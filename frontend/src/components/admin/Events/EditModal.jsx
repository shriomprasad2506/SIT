import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { IoMdCloudUpload } from "react-icons/io";
import { MdDelete } from "react-icons/md";

import Modal from "../../Modal";
import { FaSpinner } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_API_URL;

const EditModal = ({ isOpen, onClose, setRefresh, event }) => {
    if (!isOpen) return null; // Don't render the modal if it's not open

    const [title, setTitle] = useState(event?.event_name || '');
    const [date, setDate] = useState(event?.event_date ? new Date(event.event_date).toISOString().split('T')[0] : '');
    const [time, setTime] = useState(event?.event_time || '');
    const [hours, setHours] = useState(event?.duration ? Math.floor(event.duration / 60) : '');
    const [minutes, setMinutes] = useState(event?.duration ? event.duration % 60 : '');
    const [location, setLocation] = useState(event?.location || '');
    const [description, setDescription] = useState(event?.description || '');
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(event?.image || null);
    useEffect(() => {
        if (event) {
            setTitle(event.event_name || '');
            setDate(event?.event_date ? new Date(event.event_date).toISOString().split('T')[0] : '');
            setTime(event.event_time || '');
            const hours = event.duration ? Math.floor(event.duration / 60) : ''
            setHours(hours);
            if (hours === 0) {
                setHours('0')
            }
            const minutes = event.duration ? event.duration % 60 : ''
            setMinutes(minutes);
            if (minutes === 0) {
                setMinutes('0')
            }
            setLocation(event.location || '');
            setDescription(event.description || '');
            setImagePreview(event.image || '');
        }
    }, [event]);

    const [loading, setLoading] = useState(false);


    // Logic to check if the event is fully defined (all fields filled)
    const isEventDefined = date && time && hours && minutes;

    // Function to format the time in AM/PM format
    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(":");
        const hour = parseInt(hours);
        const suffix = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${formattedHour}:${minutes} ${suffix}`;
    };

    // Function to format the date in "Day Month DD, YYYY" format
    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };

    // Function to calculate end time based on start time and duration
    const calculateEndTime = () => {
        const [startHours, startMinutes] = time.split(":").map(num => parseInt(num));
        const totalMinutes = startHours * 60 + startMinutes + parseInt(hours) * 60 + parseInt(minutes);
        const endHours = Math.floor(totalMinutes / 60) % 24;
        const endMinutes = totalMinutes % 60;
        const endDayOffset = Math.floor(totalMinutes / 1440); // This calculates how many full days (24 hours) have passed

        const formattedEndTime = `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;

        return { formattedEndTime, endDayOffset };
    };

    // Function to calculate the end date based on the start date and the duration
    const calculateEndDate = () => {
        const startDate = new Date(date);  // Start date
        const { endDayOffset } = calculateEndTime();  // Get the number of days to add

        // Add days to the start date
        startDate.setDate(startDate.getDate() + endDayOffset);

        return formatDate(startDate);  // Format the new date
    };

    // Format the event description once all required fields are set
    const eventDescription = isEventDefined
        ? `✅ This event will take place on ${formatDate(date)} from ${formatTime(time)} until ${calculateEndDate()} at ${formatTime(calculateEndTime().formattedEndTime)}.`
        : "";

    // Handle input changes
    const handleInputChange = (e, setter) => {
        setter(e.target.value);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // Generate image preview
        if (selectedFile) {
            setImagePreview(URL.createObjectURL(selectedFile));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const totalMinutes = (Number(hours) * 60) + Number(minutes);
        // Perform validation
        if (!title) {
            toast.error("Please enter the event title.");
            return;
        }
        if (!date) {
            toast.error("Please select a date for the event.");
            return;
        }
        if (!time) {
            toast.error("Please select a time for the event.");
            return;
        }
        if (!totalMinutes || totalMinutes === 0) {
            toast.error("Please enter a valid duration for the event.");
            return;
        }
        if (!location) {
            toast.error("Please enter the event location.");
            return;
        }
        if (!description) {
            toast.error("Please enter a description for the event.");
            return;
        }

        // Create FormData to send the file along with other form data
        const formData = new FormData();
        formData.append("event_name", title);
        formData.append("event_date", date);
        formData.append("event_time", time);
        formData.append("duration", totalMinutes);
        formData.append("location", location);
        formData.append("description", description);
        formData.append("imgUrl", imagePreview)
        if (file) formData.append("image", file);

        setLoading(true);
        try {
            const token = sessionStorage.getItem('authToken');

            const response = await axios.put(`${apiUrl}/api/events/${event.event_id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}` // Pass the token in the Authorization header
                },
            });

            console.log(response.data);
            toast.success("Event Updated.");
            setRefresh(true)
            onClose();
        } catch (error) {
            console.error("Error submitting the form:", error);
            toast.error("An error occurred while creating the event.");
        } finally {
            setLoading(false);
        }
    };


    const removeImg = () => {
        setFile(null);
        setImagePreview('')
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold mb-4 border-b-2 border-gray-100 pb-5">Edit Event</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block font-medium text-[#737373]">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => handleInputChange(e, setTitle)}
                        placeholder="Event Title"
                        className="mt-1 block w-full px-2 py-[6px] border border-gray-500 rounded-md shadow-sm  bg-[#f7f7f7] outline-none"
                    />
                </div>
                <div className="flex flex-grow gap-2 mb-1 flex-wrap">
                    <div className="flex-1">
                        <label htmlFor="date" className="block font-medium text-[#737373]">
                            Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => handleInputChange(e, setDate)}
                            placeholder="Event Date"
                            className="mt-1 block w-full px-2 py-[6px] border border-gray-500 rounded-md shadow-sm  bg-[#f7f7f7] outline-none"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="time" className="block font-medium text-[#737373]">
                            Time
                        </label>
                        <input
                            type="time"
                            id="time"
                            value={time}
                            onChange={(e) => handleInputChange(e, setTime)}
                            placeholder="Event Time"
                            className="mt-1 block w-full px-2 py-[6px] border border-gray-500 rounded-md shadow-sm  bg-[#f7f7f7] outline-none"
                        />
                    </div>
                    <div className="flex-1 mt-1 min-w-[150px]">
                        <label htmlFor="duration" className="block font-medium text-[#737373]">
                            Duration
                        </label>
                        <div className="flex justify-center items-center bg-[#f7f7f7] border-gray-500 border rounded-md relative flex-grow">
                            <div className="flex justify-center items-center">
                                <input
                                    type="text"
                                    id="hours"
                                    value={hours ? `${hours}` : ''}
                                    onChange={(e) => {
                                        const newValue = e.target.value.replace(/[^\d]/g, ''); // Only allow numeric input
                                        setHours(newValue);
                                    }}
                                    placeholder="Hours"
                                    className="block flex-1 w-full pl-2 py-[6px] outline-none text-right"
                                /> {hours && <span className="ml-1">h</span>}
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="minutes"
                                    value={minutes}
                                    onChange={(e) => {
                                        const newValue = e.target.value.replace(/[^\d]/g, ''); // Only allow numeric input
                                        setMinutes(newValue);
                                    }}
                                    placeholder="Minutes"
                                    className="block flex-1 w-full pl-2 pr-[6px] outline-none text-left"
                                />
                                {minutes && (
                                    <span className="absolute top-0" style={{ left: `${minutes.toString().length * 9 + 10}px` }}>
                                        m
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <p className="mb-4 text-sm text-gray-400">{eventDescription}</p>
                <div className="mb-4">
                    <label htmlFor="description" className="block font-medium text-[#737373]">
                        Description
                    </label>
                    <textarea
                        type="text"
                        id="description"
                        rows={3}
                        value={description}
                        onChange={(e) => handleInputChange(e, setDescription)}
                        placeholder="Event Description"
                        className="mt-1 resize-none block w-full px-2 py-[6px] border border-gray-500 rounded-md shadow-sm  bg-[#f7f7f7] outline-none"
                    />
                </div>
                <div className="flex sm:gap-3 mb-3 sm:flex-row flex-col">
                    <div className="mb-4 flex-1">
                        <label htmlFor="location" className="block font-medium text-[#737373]">
                            Location
                        </label>
                        <textarea
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => handleInputChange(e, setLocation)}
                            placeholder="Location"
                            className="h-[100px] resize-none mt-1 block w-full px-2 py-[6px] border border-gray-500 rounded-md shadow-sm  bg-[#f7f7f7] outline-none"
                        />
                    </div>
                    <div className="flex-1 flex-grow">
                        <p htmlFor="file" className="block font-medium text-[#737373]">
                            Event Image
                        </p>
                        <input
                            type="file"
                            id="file"
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                            multiple={false}
                        />
                        <div className="mt-1 h-[100px] p-1 rounded-md flex justify-center items-center bg-[#f7f7f7] text-[#737373] border border-gray-500 relative">
                            {
                                imagePreview ? "" :
                                    <label htmlFor="file"
                                        type="button"
                                        className=" gap-2 py-2 px-4 w-full  flex justify-center items-center"
                                    >
                                        <IoMdCloudUpload className="text-xl" /> Choose Image
                                    </label>
                            }
                            {imagePreview && (
                                <div>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-w-full h-[100px] object-cover rounded-md shadow-sm p-1"
                                    />
                                    <MdDelete className="absolute top-0 right-0 text-xl text-red-400 hover:text-red-600 transition-all duration-200 hover:cursor-pointer z-[50]" onClick={removeImg} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    className={`bg-[#0085ff] transition-all duration-200 text-white rounded-xl w-full text-center py-2 ${loading ? 'bg-gray-400 hover:cursor-not-allowed' : 'hover:bg-gray-800 hover:cursor-pointer'
                        }`}
                    disabled={loading} // Disable the button when loading

                >
                    {loading ? (
                        <FaSpinner className="animate-spin place-self-center text-xl" />
                    ) : (
                        'Save Event'
                    )}
                </button>
            </form>
        </Modal>
    );
};

export default EditModal;
