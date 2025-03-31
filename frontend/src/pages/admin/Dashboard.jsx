import { useEffect } from "react";

const Dashboard = () => {
    useEffect(() => {
        document.title = "SIT | Admin";
      }, []);
    const eventStyle = {
        container: 'flex flex-col justify-center items-center rounded-3xl md:px-4 px-2 md:py-6 py-3 bg-white hover:text-white hover:bg-gradient-to-b hover:from-[#12422b] hover:to-[#218054] transition-all duration-300 hover:cursor-pointer',
        p: 'md:text-2xl text-lg font-semibold',
        count: "md:text-4xl text-2xl mt-2",
        img: "md:h-[60px] h-[40px] group-hover:invert"
    };
    return (
        <div className="min-h-screen text-left md:p-5 p-3" style={{ fontFamily: 'Inter' }}>
            <p className="text-3xl font-semibold text-black">Hello, Admin</p>
            <p className="mt-4 text-[#454545] font-bold text-xl">Events</p>
            <div className="grid lg:grid-cols-4 grid-cols-2 mt-3 text-center md:gap-4 gap-2">
                <div className={`${eventStyle.container} group`}>
                    <img src='/Total.png' className={`${eventStyle.img}`} />
                    <p className={`${eventStyle.count}`}>24</p>
                    <p className={`${eventStyle.p}`}>Total Events</p>
                </div>
                <div className={`${eventStyle.container} group`}>
                    <img src='/OnGoing.png' className={`${eventStyle.img}`} />
                    <p className={`${eventStyle.count}`}>10</p>
                    <p className={`${eventStyle.p}`}>Ongoing Events</p>
                </div>
                <div className={`${eventStyle.container} group`}>
                    <img src='/Upcoming.png' className={`${eventStyle.img}`} />
                    <p className={`${eventStyle.count}`}>2</p>
                    <p className={`${eventStyle.p}`}>Upcoming Events</p>
                </div>
                <div className={`${eventStyle.container} group`}>
                    <img src='/Past.png' className={`${eventStyle.img}`} />
                    <p className={`${eventStyle.count}`}>12</p>
                    <p className={`${eventStyle.p}`}>Past Events</p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;