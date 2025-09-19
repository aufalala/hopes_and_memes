import { useEffect, useState } from "react"
import { getUnratedMemes } from "../../utils/redisAPI.js"

import { useClerkAuthFetch } from "../../hooks/useClerkAuthFetch";


function UnseenContent() {

  const { fetchWithAuth } = useClerkAuthFetch();

  const [unratedMemes, setUnratedMemes] = useState([]);

  useEffect(() => {
    (async function pageLoad() {
      try {
        const result = await getUnratedMemes(fetchWithAuth);
        setUnratedMemes(result);
      } catch (e) {
        console.error("getUnratedMemes FAILED:", e);
      }
    })();

  }, [])

  return (
    <div>
      asdas
      {unratedMemes.map((meme, index) => (
        <div key={index}>
          <img src={meme.url}  ></img>
        </div>
      ))}
    </div>
  )
}

export default UnseenContent