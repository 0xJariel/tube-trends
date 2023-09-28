"use client";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

function SearchForm() {
  // when typed into input
  const [newQuery, setNewQuery] = useState();

  //   when search is clicked
  const [queryList, setQueryList] = useState([]);
  const [channelID, setChannelID] = useState();

  //   when getVideoFrequency is clicked
  const [videoList, setVideoList] = useState([]);
  const [fequencyByDay, setFreQuencyByDay] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateList, setDateList] = useState();
  const [timeList, setTimeList] = useState();

  //   gets 5 youtube channels that have the query string provided
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
    console.log(response);
    console.log(response[0].channelID);
    setChannelID(response[0].channelID);
  };

  const getWeekDay = (date: string) => {
    // Output the date string for debugging
    console.log("Date String:", date);

    // Create a Date object with the provided date string
    const dateObject = new Date(date);

    // Get the day of the week as a number (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = dateObject.getUTCDay();

    // Define an array of day names
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return daysOfWeek[dayOfWeek];
  };

  const fetchChannelVideos = async (channelID: string) => {
    console.log(channelID);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            key: apiKey,
            part: "snippet",
            channelId: channelID,
            maxResults: 50,
            order: "date",
            type: "video",
            videoType: "any",
          },
        }
      );

      const nextPageToken = response.data.nextPageToken;
      const videoList = response.data.items;

      return videoList;
    } catch (error) {
      setError("Error fetching YouTube data. Please try again later.");
      console.error("Error fetching YouTube data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUploadFrequencyByWeekDay = async () => {
    const response = await fetchChannelVideos(channelID);
    console.log(response);
    if (!response) {
      return;
    }
    setVideoList(response);
    const dayCount = {
      Sun: 0,
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
    };
    response.forEach((video) => {
      const weekDay = getWeekDay(video.snippet.publishedAt);
      console.log(weekDay);
      // Increment the count for the corresponding day of the week
      if (dayCount.hasOwnProperty(weekDay)) {
        dayCount[weekDay]++;
      }
    });
    console.log(dayCount);
    setFreQuencyByDay(dayCount);
    return dayCount;
  };

  const getIDFromUserName = () => {};
  const getVideosFromID = () => {};
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
        <div className="btn btn-primary" onClick={searchForUsernames}>
          Search
        </div>
        <button
          className="btn btn-primary"
          onClick={getUploadFrequencyByWeekDay}
        >
          getUploadFrequencyByWeekDay
        </button>
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
