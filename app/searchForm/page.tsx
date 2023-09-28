"use client";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { channel } from "diagnostics_channel";
const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

function SearchForm() {
  const [newQuery, setNewQuery] = useState();
  const [queryList, setQueryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channels, setChannels] = useState();

  const fetchYouTubeChannels = async (channelName: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            q: channelName,
            key: apiKey,
            part: "snippet",
            maxResults: 5,
            type: "channel",
            // order: "videoCount", default is relevance
          },
        }
      );

      //5 items
      const items = response.data.items;
      const youtubers = [];
      items.forEach((youtuber) => {
        const title = youtuber.snippet.title;
        const channelID = youtuber.snippet.channelId;
        const publishedDate = youtuber.snippet.publishedAt;
        const thumbnail = youtuber.snippet.thumbnails.default.url;
        youtubers.push({ title, channelID, thumbnail });
      });

      return youtubers;
    } catch (error) {
      setError("Error fetching YouTube data. Please try again later.");
      console.error("Error fetching YouTube data:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchForUsernames = async () => {
    const response = await fetchYouTubeChannels(newQuery);
    console.log(newQuery);
    console.log(response);
  };

  const getIDFromUserName = () => {};
  const getVideosFromID = () => {};
  const getUploadFrequency = () => {};
  const getUploadDates = () => {};
  const getUploadTimes = () => {};

  const handleInputChange = (e: Event) => {
    setNewQuery(e.target.value);
    console.log(newQuery);
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  const handleSearch = (e: Event) => {
    e.preventDefault();
    //set the searchParams to all
  };

  const addToQuery = () => {
    if (newQuery.trim() !== "") {
      const newItem = {
        id: uuidv4(), // Generate a unique identifier
        query: newQuery,
      };
      setQueryList([...queryList, newItem]);
      setNewQuery("");
    }
  };

  const removeFromQuery = (itemId) => {
    const updatedQueryList = queryList.filter((item) => item.id !== itemId);
    setQueryList(updatedQueryList);
    console.log("hi");
  };

  const searchQuery = () => {};

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input type="text" onChange={handleInputChange} value={newQuery} />
        <div className="searchUsername" onClick={searchForUsernames}>
          Search
        </div>
        <div className="addToQuery" onClick={addToQuery}>
          Add
        </div>
        <div className="searchQuery" onClick={handleSearch}>
          Compare
        </div>
      </form>
      <div>
        {queryList &&
          queryList.map((item) => (
            <button className="btn btn-outline btn-info">
              <div key={item.id} onClick={() => removeFromQuery(item.id)}>
                {item.query}
              </div>
              <div>X</div>
            </button>
          ))}
      </div>
      <div>{}</div>
    </>
  );
}

export default SearchForm;
