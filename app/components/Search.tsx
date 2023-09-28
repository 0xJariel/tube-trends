import React, { useState } from "react";
import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

interface Video {
  // Define the structure of a video
}

interface SearchParams {
  q?: string;
  regionCode?: "US" | "CA" | "UK" | "AU" | "DE";
  location?: [number, number];
  locationRadius?: `${number}${"m" | "km" | "ft" | "mi"}`;
  videoCategoryId?: number;
  videoDuration?: string;
}

const Search: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchYouTubeVideos = async (params: SearchParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            key: apiKey,
            part: "snippet",
            maxResults: 5,
            ...params, // Spread the search parameters
          },
        }
      );

      setVideos(response.data.items);
    } catch (error) {
      setError("Error fetching YouTube data. Please try again later.");
      console.error("Error fetching YouTube data:", error);
    } finally {
      setLoading(false);
    }
  };

  const testQuery: SearchParams = { q: "yoga" };

  const fetchData = async () => {
    await fetchYouTubeVideos(testQuery);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter search query"
        onChange={(e) => (testQuery.q = e.target.value)}
      />
      <button onClick={fetchData} disabled={loading}>
        Fetch YouTube Data
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {videos.length > 0 && (
        <div>
          {/* Render the fetched videos */}
          {videos.map((video) => (
            <div key={video.id}>{video.snippet.title}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
