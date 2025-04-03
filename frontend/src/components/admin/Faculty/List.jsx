import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import { TbRefresh } from "react-icons/tb";
import CardTeaching from './CardTeaching';
import CardNonTeaching from './CardNonTeaching';

const apiUrl = import.meta.env.VITE_API_URL;

const FacultyList = ({ category, refresh, setRefresh, searchTerm, department }) => {
    const [teachingFaculty, setTeachingFaculty] = useState({});
    const [nonTeachingFaculty, setNonTeachingFaculty] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchFaculty = async (search = '') => {
        setError(null);
        setLoading(true);
        try {
            if (!category) {
                const response1 = await axios.get(`${apiUrl}/api/faculty/teaching`, {
                    params: { department, search },
                });
                setTeachingFaculty(response1.data.data);
                const response2 = await axios.get(`${apiUrl}/api/faculty/non_teaching`, {
                    params: { department, search },
                });
                setNonTeachingFaculty(response2.data.data);
            } else if (category.value == 1) {
                const response1 = await axios.get(`${apiUrl}/api/faculty/teaching`, {
                    params: { department, search },
                });
                setTeachingFaculty(response1.data.data);
                setNonTeachingFaculty({})
            } else if (category.value == 2) {
                const response2 = await axios.get(`${apiUrl}/api/faculty/non_teaching`, {
                    params: { search, department },
                });
                setNonTeachingFaculty(response2.data.data);
                setTeachingFaculty({});
            }
        } catch (err) {
            setError('Error fetching faculty data');
            console.error(err);
        } finally {
            setLoading(false);
            setRefresh(false);
        }
    };

    useEffect(() => {
        fetchFaculty(searchTerm);
    }, [category, refresh, searchTerm, department]);

    const noFacultyFound = Object.keys(teachingFaculty).length === 0 && Object.keys(nonTeachingFaculty).length === 0;

    return (
        <div>
            {error && (
                <TbRefresh
                    className={`hover:cursor-pointer text-red-500 ${refresh ? 'animate-spin' : ''}`}
                    size={50}
                    onClick={() => setRefresh(true)}
                />
            )}

            {loading ? (
                <div className="flex justify-center items-center mt-10">
                    <FaSpinner className="animate-spin" size={50} />
                </div>
            ) : (
                <div>
                    {Object.keys(teachingFaculty).length > 0 ? (
                        <>
                            <p className='mt-10 text-2xl font-black'>Teaching Staff</p>
                            {Object.entries(teachingFaculty).map(([department, facultyMembers]) => (
                                <div key={department} className="mb-6">
                                    <h2 className="text-lg font-bold my-4 pl-5">{department}</h2>
                                    <CardTeaching facultyMembers={facultyMembers} setRefresh={setRefresh} />
                                </div>
                            ))}
                        </>
                    ) : null}


                    {Object.keys(nonTeachingFaculty).length > 0 ? (
                        <>
                            <p className='mt-10 text-2xl font-black'>Non-Teaching Staff</p>
                            {Object.entries(nonTeachingFaculty).map(([department, facultyMembers]) => (
                                <div key={department} className="mb-6">
                                    <h2 className="text-lg font-bold my-4 pl-5">{department}</h2>
                                    <CardNonTeaching isTeaching='false' facultyMembers={facultyMembers} setRefresh={setRefresh} />
                                </div>
                            ))}
                        </>
                    ) : null}

                    {noFacultyFound && (
                        <div className="text-xl mt-8 text-center">
                            No Faculty Found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FacultyList;
