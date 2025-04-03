import { useEffect, useState } from "react";
import Dropdown from "../components/DropDown";
import axios from 'axios'; // Import axios to handle form submission
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md"
const apiUrl = import.meta.env.VITE_API_URL;

const ContactUs = ({ className, onClose = false }) => {
    useEffect(() => {
        document.title = "SIT | Contact Us";
    }, []);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [address, setAddress] = useState('');
    const [schoolName, setSchoolName] = useState('');
    const [level, setLevel] = useState('');
    const [course, setCourse] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);  // Track form submission state

    const levels = [
        {
            value: 'UG Courses', label: 'UG Courses', courses: [
                { value: 'B.Tech in Computer Science & Engineering', label: 'B.Tech in Computer Science & Engineering' },
                { value: 'B.Tech in Computer Science & Engineering (AIML)', label: 'B.Tech in Computer Science & Engineering (AIML)' },
                { value: 'B.Tech in Electronics & Communication Engineering', label: 'B.Tech in Electronics & Communication Engineering' },
                { value: 'B.Tech in Electronics and Computer Science', label: 'B.Tech in Electronics and Computer Science' },
                { value: 'B.Tech in Electrical Engineering', label: 'B.Tech in Electrical Engineering' },
                { value: 'B.Tech in Information Technology', label: 'B.Tech in Information Technology' },
                { value: 'B.Tech in Civil Engineering', label: 'B.Tech in Civil Engineering' },
                { value: 'Bachelor in Computer Application (BCA)', label: 'Bachelor in Computer Application (BCA)' },
                { value: 'Bachelor of Business Administration (BBA)', label: 'Bachelor of Business Administration (BBA)' },
                { value: 'BBA in Hospital Management (BBA-HM)', label: 'BBA in Hospital Management (BBA-HM)' },
                { value: 'BBA in Accountancy, Taxation & Auditing (BBA-ATA)', label: 'BBA in Accountancy, Taxation & Auditing (BBA-ATA)' },
                { value: 'B.Sc. in Hospitality & Hotel Administration (BHHA)', label: 'B.Sc. in Hospitality & Hotel Administration (BHHA)' },
                { value: 'B.Sc. in Cyber Security', label: 'B.Sc. in Cyber Security' },
                { value: 'B.Sc. in Computer Science', label: 'B.Sc. in Computer Science' },
                { value: 'B.Sc. in Psychology', label: 'B.Sc. in Psychology' }
            ]
        },
        {
            value: 'PG Courses', label: 'PG Courses', courses: [
                { value: 'Masters in Business Administration', label: 'Masters in Business Administration' },
                { value: 'Masters in Computer Application', label: 'Masters in Computer Application' },
                { value: 'Lateral Program in Masters in Computer Application', label: 'Lateral Program in Masters in Computer Application' }
            ]
        },
        {
            value: 'Diploma Courses', label: 'Diploma Courses', courses: [
                { value: 'Computer Science & Technology', label: 'Computer Science & Technology' },
                { value: 'Civil Engineering', label: 'Civil Engineering' },
                { value: 'Electrical Engineering', label: 'Electrical Engineering' },
                { value: 'Electronics & Telecommunications Engineering', label: 'Electronics & Telecommunications Engineering' }
            ]
        }
    ];

    const [selectedLevelCourses, setSelectedLevelCourses] = useState([]);

    // Handle level selection and reset course
    const handleLevel = (selectedLevel) => {
        setLevel(selectedLevel);
        setCourse('');
        const levelCourses = levels.find(levelOption => levelOption.value === selectedLevel.value)?.courses || [];
        setSelectedLevelCourses(levelCourses);
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({
            name,
            email,
            number,
            address,
            school_name: schoolName,
            level,
            course,
            message
        });

        // Validate form fields
        if (!name || !email || !message) {
            toast.error("Name, Email, and Message are required.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post(`${apiUrl}/api/contact`, {
                name,
                email,
                number,
                address,
                school_name: schoolName,
                level: level,
                course: course,
                message
            });

            if (response.status === 201) {
                // Success: Reset form and display success message
                setName('');
                setEmail('');
                setNumber('');
                setAddress('');
                setSchoolName('');
                setLevel('');
                setCourse('');
                setMessage('');
                toast.success('Your message has been sent successfully!');
            }
        } catch (error) {
            // Handle error
            toast.error('There was an error submitting your form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className={`${className} mt-10 flex justify-center items-center flex-col p-1 w-[90%] place-self-center relative`} style={{ fontFamily: "Inter" }}>
            <h1 className="font-bold text-4xl mb-2" style={{ fontFamily: "Orbitron" }}>Get in Touch</h1>
            {
                onClose &&
                <MdClose className="absolute top-1 right-5 text-2xl" onClick={onClose} />
            }
            <p>Let's talk about how our expert can help.</p>
            <form className="w-full max-w-[600px] font-semibold" onSubmit={handleSubmit}>
                {/* Name input */}
                <div className="mb-4">
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className="mt-1 block w-full px-3 py-2 border-b border-gray-500 focus:outline-none focus:ring-gray-800 focus:border-black"
                    />
                </div>

                {/* Email input */}
                <div className="mb-4">
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="mt-1 block w-full px-3 py-2 border-b border-gray-500 focus:outline-none focus:ring-gray-800 focus:border-black"
                    />
                </div>

                {/* Phone input */}
                <div className="mb-4">
                    <input
                        type="number"
                        id="number"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="Mobile Number"
                        className="mt-1 block w-full px-3 py-2 border-b border-gray-500 focus:outline-none focus:ring-gray-800 focus:border-black"
                    />
                </div>

                {/* School Name input */}
                <div className="mb-4">
                    <input
                        type="text"
                        id="schoolName"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="School Name"
                        className="resize-none mt-1 block w-full px-3 py-2 border-b border-gray-500 focus:outline-none focus:ring-gray-800 focus:border-black"
                    />
                </div>

                {/* Address input */}
                <div className="mb-4">
                    <textarea
                        rows={2}
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Address"
                        className="resize-none mt-1 block w-full px-3 py-2 border-b border-gray-500 focus:outline-none focus:ring-gray-800 focus:border-black"
                    />
                </div>

                {/* Level dropdown */}
                <div className="mb-4">
                    <Dropdown
                        options={levels}
                        selected={level}
                        placeholder="Level"
                        onSelect={handleLevel}
                        className="w-full border-0 border-b rounded-[0!important] shadow-[0 0 #0000!important] border-gray-500"
                    />
                </div>

                {/* Course dropdown, displayed only if a level is selected */}
                {level && (
                    <div className="mb-4">
                        <Dropdown
                            options={selectedLevelCourses}
                            selected={course}
                            placeholder="Course"
                            onSelect={setCourse}
                            className="w-full border-0 border-b rounded-[0!important] shadow-[0 0 #0000!important] border-gray-500"
                        />
                    </div>
                )}

                {/* Message input */}
                <div className="mb-4">
                    <textarea
                        rows={4}
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Message"
                        className="resize-none mt-1 block w-full px-3 py-2 border-b border-gray-500 focus:outline-none focus:ring-gray-800 focus:border-black"
                    />
                </div>

                <button
                    type="submit"
                    className={`contact-us mx-auto group ${isSubmitting ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'}`}
                    disabled={isSubmitting}
                >
                    <div className="svg-wrapper-1">
                        <div className="svg-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path
                                    fill="currentColor"
                                    d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                    <span>{isSubmitting ? (
                        "Sending"
                    ) : (
                        "Send"
                    )}</span>
                </button>
            </form>
        </div>
    );
};

export default ContactUs;
