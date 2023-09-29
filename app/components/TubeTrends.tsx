"use client";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import QueryItems from "./QueryItems";
import FrequencyChart from "./FrequencyChart";
const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

const TubeTrends = () => {
  // when typed into input
  const [input, setInput] = useState("");

  //   when search is clicked
  const [queryList, setQueryList] = useState([]);
  const [channelID, setChannelID] = useState();

  //   when getVideoFrequency is clicked
  const [videoList, setVideoList] = useState([]);
  const [fequencyByDay, setFreQuencyByDay] = useState({});

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  //   gets the closest match in relevance || need to make exact matched work
  const fetchYouTubeChannel = async (channelName: string) => {
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
            // maxResults: 5,
            type: "channel",
            // order: "videoCount", default is relevance
          },
        }
      );
      const youtubeChannel = response.data.items[0].snippet;

      return youtubeChannel;
    } catch (error) {
      setError("Error fetching YouTube data. Please try again later.");
      console.error("Error fetching YouTube data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannelVideos = async (channelID: string) => {
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

  const createYoutuber = (youtubeChannel) => {
    console.log(youtubeChannel);

    const title = youtubeChannel.title;
    const channelID = youtubeChannel.channelId;
    const publishedDate = youtubeChannel.publishedAt;
    const thumbnail = youtubeChannel.thumbnails.default.url;
    const youtuber = { title, channelID, publishedDate, thumbnail };

    return youtuber;
  };

  const addToQueryList = async (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      const channel = await fetchYouTubeChannel(input);
      const youtuber = createYoutuber(channel);
      console.log(youtuber);

      const newQueryItem = {
        id: uuidv4(), // Generate a unique identifier
        query: input,
        title: youtuber?.title,
        channelID: youtuber?.channelID,
        thumbnail: youtuber?.thumbnail,
      };

      console.log(`new query item: ${JSON.stringify(newQueryItem)}`);

      setQueryList([...queryList, newQueryItem]);
      setInput("");
    }
  };

  const getWeekDayLog = (date: string) => {
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

  const searchQueryInputs = async () => {
    if (!queryList) return;

    for (const query of queryList) {
      try {
        const channelVideos = await fetchChannelVideos(query.channelID);
        console.log(channelVideos);
      } catch (error) {}
      // Process channelVideos here
    }
  };

  const analyzeVideos = (videoList) => {
    setVideoList(videoList);
    const dayCount = {
      Sun: 0,
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
    };
    videoList.forEach((video) => {
      const weekDay = getWeekDayLog(video.snippet.publishedAt);
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

  return (
    <>
      <form>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <button className="btn " onClick={addToQueryList}>
          Add to query
        </button>
        <button className="btn " onClick={searchQueryInputs}>
          Search Query
        </button>
      </form>
      <QueryItems queryList={queryList} setQueryList={setQueryList} />
      <FrequencyChart />
    </>
  );
};

export default TubeTrends;
