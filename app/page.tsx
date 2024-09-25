'use client'; // Marks the component as a Client Component

import React, { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState<string>(''); // State to hold string data
  const [error, setError] = useState<string | null>(null); // State to handle errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3001/Hello');
        
        // Check if the response is OK (status 200-299)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const text = await res.text();
        setData(text);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // Set error message if an error occurs
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Fetched Data (Client-side)</h1>
      {error ? <p>Error: {error}</p> : <p>{data}</p>}
    </div>
  );
}