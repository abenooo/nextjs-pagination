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
        {isLastStudent ? (
          <p>This is the last student.</p>
        ) : (
          studentData && (
            <div className="student-info">
              <h2>{studentData.full_name}</h2>
              {/* Render other student details here */}
            </div>
          )
        )}

        {/* Pagination Controls */}
        <div className="pagination-controls">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>Previous</button>
          <button className='ml-5' onClick={() => setCurrentPage(currentPage + 1)} disabled={isLastStudent}>Next</button>
        </div>

        {/* Message for First Student */}
        {currentPage === 0 && (
          <p>This is the first student.</p>
        )}
      </div>
    </main>
  );
}
