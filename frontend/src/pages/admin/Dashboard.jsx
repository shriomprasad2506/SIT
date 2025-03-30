const Dashboard = () => {
    const eventStyle = {container:'rounded-3xl px-4 py-6 bg-white',p:'text-2xl font-semibold',count:"text-4xl text-center mt-2"};
    return (
        <div className="h-[1000px] text-left p-5" style={{fontFamily:'Inter'}}>
            <p className="text-3xl font-semibold text-black">Hello, Admin</p>
            <p className="mt-4 text-[#454545] font-bold text-xl">Events</p>
            <div className="grid lg:grid-cols-4 grid-cols-2 mt-3">
                <div className={`${eventStyle.container}`}>
                    <p className={`${eventStyle.p}`}>Total Events</p>
                    <p className={`${eventStyle.count}`}>24</p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard