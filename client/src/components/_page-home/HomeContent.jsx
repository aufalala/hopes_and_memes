import { useEffect, useRef, useState } from "react";
import { useClerkAuthFetch } from "../../hooks/useClerkAuthFetch";
import { apiGetRatedMemes } from "../../services/airtableAPI";

import MemeCards from "../__reuseables/MemeCards"

import styles from "./_HomeContent.module.css"

function HomeContent() {

  const { fetchWithAuth } = useClerkAuthFetch();

  const [ratedMemes, setRatedMemes] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);
  const initialFetchDone = useRef(false);

  const fetchMemes = async () => {
  if (loading || (cursor === null && ratedMemes.length > 0)) return;

  setLoading(true);
  try {
    const { records, cursor: newCursor } = await apiGetRatedMemes(fetchWithAuth, cursor);

    if (records.length > 0) {
      setRatedMemes(prev => [...prev, ...records]);
    }

    if (newCursor) {
      setCursor(newCursor);
    } else {
      setCursor(null);
    }
  } catch (err) {
    console.error("fetchMemes FAILED:", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (initialFetchDone.current) return;
  initialFetchDone.current = true;
  fetchMemes();
}, []);


  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && cursor && !loading) {
          fetchMemes();
        }
      },
      {
        root: null,
        threshold: 0.5,
        rootMargin: "1000px",
      }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [cursor, loading]);


  return (
    <div className={styles.HomeContent}>
      {ratedMemes.length>0 ?
      ratedMemes.map((meme, index) => (
        <MemeCards key={meme.postLink} meme={meme} rateType={"rated"}/>
      )) :
      <div>WOW NO MEMES?</div>
      }
        
      {<div ref={loaderRef}>Loading more...</div>}
    </div>
  );
}


export default HomeContent