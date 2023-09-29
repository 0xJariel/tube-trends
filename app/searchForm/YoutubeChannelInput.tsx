import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

const YoutubeChannelInput = () => {
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
      const youtuber = response.data.items[0];

      const title = youtuber.snippet.title;
      const channelID = youtuber.snippet.channelId;
      const publishedDate = youtuber.snippet.publishedAt;
      const thumbnail = youtuber.snippet.thumbnails.default.url;
      console.log(`new youtuber created : ${youtuber}`);
      return { title, channelID, publishedDate, thumbnail };
    } catch (error) {
      setError("Error fetching YouTube data. Please try again later.");
      console.error("Error fetching YouTube data:", error);
    } finally {
      setLoading(false);
    }
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

  const addToQueryList = async () => {
    if (input.trim() !== "") {
      const channel = await fetchYouTubeChannel(input);
      console.log(channel);

      const newQueryItem = {
        id: uuidv4(), // Generate a unique identifier
        query: input,
        title: channel?.title,
        channelID: channel?.channelID,
        thumbnail: channel?.thumbnail,
      };

      console.log(`new query item: ${JSON.stringify(newQueryItem)}`);

      setQueryList([...queryList, newQueryItem]);
      setInput("");
    }
  };

  // const searchAllQueryItems

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
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <button className="btn btn-primary" onClick={addToQueryList}>
        Add to query
      </button>
      <button className="btn btn-primary">Search Query</button>
    </div>
  );
};

export default YoutubeChannelInput;
