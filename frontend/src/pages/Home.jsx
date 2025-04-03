import { useEffect, useState } from "react";

const Home = () => {
    const [theme, setTheme] = useState(null);

    useEffect(() => {
        // Check if a theme is saved in localStorage or if the system theme preference exists
        const savedTheme = localStorage.getItem("theme");

        // Apply the theme immediately based on localStorage or system preference
        const currentTheme = savedTheme;

        setTheme(currentTheme);
        document.documentElement.classList.add(currentTheme === 'dark' ? 'dark-theme' : 'light-theme');
    }, []);
    useEffect(() => {
        if (theme) {
            if (theme === "dark") {
                document.documentElement.classList.add("dark-theme");
            } else {
                document.documentElement.classList.remove("dark-theme");
            }
        }
        localStorage.setItem("theme", theme);
    }, [theme]);
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    };
    return (
        <div className="w-screen h-screen" style={{background:'var(--bg)', color:'var(--text)'}}>
            {/* Theme Switch Button */}
            <div>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={theme === "dark"}
                        onChange={toggleTheme}
                    />
                    <div className="slider round">
                        <div className="sun-moon">
                            <svg viewBox="0 0 100 100" className="moon-dot" id="moon-dot-1">
                                <circle r="50" cy="50" cx="50"></circle>
                            </svg>
                            <svg viewBox="0 0 100 100" className="moon-dot" id="moon-dot-2">
                                <circle r="50" cy="50" cx="50"></circle>
                            </svg>
                            <svg viewBox="0 0 100 100" className="moon-dot" id="moon-dot-3">
                                <circle r="50" cy="50" cx="50"></circle>
                            </svg>
                            <svg viewBox="0 0 100 100" className="light-ray" id="light-ray-1">
                                <circle r="50" cy="50" cx="50"></circle>
                            </svg>
                            <svg viewBox="0 0 100 100" className="light-ray" id="light-ray-2">
                                <circle r="50" cy="50" cx="50"></circle>
                            </svg>
                            <svg viewBox="0 0 100 100" className="light-ray" id="light-ray-3">
                                <circle r="50" cy="50" cx="50"></circle>
                            </svg>

                            <svg viewBox="0 0 100 100" className="cloud-dark" id="cloud-1">
                                <circle r="50" cy="50" cx="50"></circle>
                            </svg>
                            <svg viewBox="0 0 100 100" className="cloud-dark" id="cloud-2">
                                <circle r="50" cy="50" cx="50"></circle>
                            </svg>
                            <svg viewBox="0 0 100 100" className="cloud-dark" id="cloud-3">
                                <circle r="50" cy="50" cx="50"></circle>
                            </svg>
                            <svg viewBox="0 0 100 100" className="cloud-light" id="cloud-4">
                                <circle r="50" cy="50" cx="50"></circle>
                            </svg>
                            <svg viewBox="0 0 100 100" className="cloud-light" id="cloud-5">
                                <circle r="50" cy="50" cx="50"></circle>
                            </svg>
                            <svg viewBox="0 0 100 100" className="cloud-light" id="cloud-6">
                                <circle r="50" cy="50" cx="50"></circle>
                            </svg>
                        </div>
                        <div className="stars">
                            <svg viewBox="0 0 20 20" className="star" id="star-1">
                                <path
                                    d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                                ></path>
                            </svg>
                            <svg viewBox="0 0 20 20" className="star" id="star-2">
                                <path
                                    d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                                ></path>
                            </svg>
                            <svg viewBox="0 0 20 20" className="star" id="star-3">
                                <path
                                    d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                                ></path>
                            </svg>
                            <svg viewBox="0 0 20 20" className="star" id="star-4">
                                <path
                                    d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                </label>
            </div>

            <div>

            </div>
        </div>
    )
}

export default Home