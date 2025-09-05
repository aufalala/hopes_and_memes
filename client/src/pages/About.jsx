import React, { useEffect, useState } from 'react'
import { fetchTestImage } from '../utils/airtableAPI';
import { useClerkAuthFetch } from "../hooks/useClerkAuthFetch";

function About() {
  
  const { fetchWithAuth } = useClerkAuthFetch();

  const [testImage, setTestImage] = useState("") 
  
  useEffect(() => {
    async function getTestImage() {
      try {
        const data = await fetchTestImage(fetchWithAuth);
        if (data.status === "success") {
          setTestImage(data.imageUrl);
        } else {
          setTestImage(`???`);
        }
      } catch {
          setTestImage(`???????`);
      }
    }
    getTestImage();
  }, []);

  return (
    <>
    {testImage ? (
      <img src={testImage} alt="Test from Airtable" />
    ) : (
      <p>Loading image...</p>
    )}
    </>
  )
}

export default About