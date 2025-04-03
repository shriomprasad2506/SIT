import { useEffect, useState } from "react";
import axios from "axios"; // Import axios
const apiUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
    const [counts, setCounts] = useState({
        total_announcements: 0,
        total_events: 0,
        total_new_contacts: 0,
        total_news: 0,
        total_non_teachings: 0,
        total_ongoing: 0,
        total_past: 0,
        total_teachings: 0,
        total_upcoming: 0
    });

    // Set document title
    useEffect(() => {
        document.title = "SIT | Admin";
    }, []);

    // Fetch event count data from API using axios
    useEffect(() => {
        const fetchEventCounts = async () => {
            const token = sessionStorage.getItem("authToken");
            try {
                const response = await axios.get(`${apiUrl}/api/auth/count`, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCounts(response.data); // Update state with the fetched data
            } catch (error) {
                console.error("Error fetching event counts:", error);
            }
        };

        fetchEventCounts();
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    const style = {
        container: 'flex flex-col justify-center items-center rounded-3xl md:px-4 px-2 md:py-6 py-3 bg-white hover:text-white hover:bg-black  transition-all duration-300 hover:cursor-pointer',
        p: 'md:text-2xl text-lg font-semibold',
        count: "md:text-4xl text-2xl mt-2",
        img: "md:h-[60px] h-[40px] group-hover:invert"
    };

    return (
        <div className="min-h-screen text-left md:p-5 p-3" style={{ fontFamily: 'Inter' }}>
            <p className="text-3xl font-semibold text-black">Hello, Admin</p>
            <div className="grid lg:grid-cols-4 grid-cols-2 mt-6 text-center md:gap-4 gap-2">
                <div className={`${style.container} group`}>
                    <img src='/Total.png' className={`${style.img}`} />
                    <p className={`${style.count}`}>{counts.total_events}</p>
                    <p className={`${style.p}`}>Total Events</p>
                </div>
                <div className={`${style.container} group`}>
                    <img src='/OnGoing.png' className={`${style.img}`} />
                    <p className={`${style.count}`}>{counts.total_ongoing}</p>
                    <p className={`${style.p}`}>Ongoing Events</p>
                </div>
                <div className={`${style.container} group`}>
                    <img src='/Upcoming.png' className={`${style.img}`} />
                    <p className={`${style.count}`}>{counts.total_upcoming}</p>
                    <p className={`${style.p}`}>Upcoming Events</p>
                </div>
                <div className={`${style.container} group`}>
                    <img src='/Past.png' className={`${style.img}`} />
                    <p className={`${style.count}`}>{counts.total_past}</p>
                    <p className={`${style.p}`}>Past Events</p>
                </div>
                <div className={`${style.container} group`}>
                    <img src='/News.png' className={`${style.img}`} />
                    <p className={`${style.count}`}>{counts.total_news}</p>
                    <p className={`${style.p}`}>Total News</p>
                </div>
                <div className={`${style.container} group`}>
                    <img src='/Announcements.png' className={`${style.img}`} />
                    <p className={`${style.count}`}>{counts.total_announcements}</p>
                    <p className={`${style.p}`}>Total Announcements</p>
                </div>
                <div className={`${style.container} group`}>
                    <img src='/Teaching.png' className={`${style.img}`} />
                    <p className={`${style.count}`}>{counts.total_teachings}</p>
                    <p className={`${style.p}`}>Total Teaching Staff</p>
                </div>
                <div className={`${style.container} group`}>
                    <img src='/NonTeaching.png' className={`${style.img}`} />
                    <p className={`${style.count}`}>{counts.total_non_teachings}</p>
                    <p className={`${style.p}`}>Total Non Teaching Staff</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
