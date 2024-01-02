import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [currentPage, setCurrentPage] = useState(0);
  const [studentData, setStudentData] = useState(null);
  const [isLastStudent, setIsLastStudent] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios(`https://100090.pythonanywhere.com/training_test/?format=json&limit=1&offset=${currentPage}&type=get_data`);
        if (result.data.success && Object.keys(result.data.response).length > 0) {
          const studentKey = Object.keys(result.data.response)[0];
          setStudentData(result.data.response[studentKey]);
          setIsLastStudent(false);
        } else {
          setIsLastStudent(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLastStudent(false);
      }
    };
    fetchData();
  }, [currentPage]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        {/* Student Info and Messages */}
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
        Training Test&nbsp;
          <code className="font-mono font-bold">fetch,display data and use pagination</code>
        </p>
        {isLastStudent ? (
          <p>This is the last student.</p>
        ) : (
          studentData && (
            <div className="student-info">
              <h2>{studentData.full_name}</h2>
              <p>First Name: {studentData.first_name}</p>
              <p>Last Name: {studentData.last_name}</p>
              <p>Age: {studentData.age}</p>
              <p>Date of Birth: {studentData.date_of_birth}</p>
              <p>Address: {`${studentData.address.street}, ${studentData.address.city}, ${studentData.address.state}, ${studentData.address.zip_code}`}</p>
              <p>Class: {studentData.class}</p>
              <p>Grade: {studentData.grade}</p>
              <p>Subjects: {studentData.subjects.join(', ')}</p>
            </div>
          )
        )}
</div>
        {/* Pagination Controls */}
        <div className="pagination-controls mt-5">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>Previous</button>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={isLastStudent} className='ml-5'>Next</button>
        </div>

        {/* Message for First Student */}
        {currentPage === 0 && (
          <p>This is the first student.</p>
        )}
      </div>
    </main>
  );
}
