"use client";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import QueryItems from "./QueryItems";
import DayFrequencyChart from "./DayFrequencyChart";
import TimeFrequencyChart from "./TimeFrquencyChart";
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

  // after analysis video data
  const [analyzedData, setAnalyzedData] = useState([]);

  //   gets the closest match in relevance || need to make exact matched work
  const fetchYouTubeChannel = async (channelName) => {
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

  const fetchChannelVideos = async (channelID) => {
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
    if (queryList.length >= 4) return;
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

  const getWeekDayLog = (date) => {
    // Create a Date object with the provided date string
    const dateObject = new Date(date);

    // Get the day of the week as a number (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = dateObject.getUTCDay();

    // Define an array of day names
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return daysOfWeek[dayOfWeek];
  };

  // updates 'analyzedData' with an array of objects that has title & daycount keys
  const searchQueryInputs = async (e) => {
    setAnalyzedData([]);
    e.preventDefault();
    if (!queryList) return;
    let newData = [];
    for (const query of queryList) {
      try {
        const channelVideos = await fetchChannelVideos(query.channelID);
        const dayCount = getDayCount(channelVideos);
        const timeCount = getTimeCount(channelVideos);
        const channelData = { title: query.title, dayCount, timeCount };
        newData.push(channelData);
        console.log(timeCount);

        // create
        console.log(
          `query: ${JSON.stringify(query.title)}, daycount: ${JSON.stringify(
            dayCount
          )}`
        );
      } catch (error) {}
    }
    setAnalyzedData(newData);
  };

  const getDayCount = (videoList) => {
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
      // Increment the count for the corresponding day of the week
      if (dayCount.hasOwnProperty(weekDay)) {
        dayCount[weekDay]++;
      }
    });
    console.log(dayCount);
    setFreQuencyByDay(dayCount);
    return dayCount;
  };

  const getTimeCount = (videoList) => {
    const timeCount = {};

    for (let hour = 0; hour <= 23; hour++) {
      const formattedHour = hour.toString().padStart(2, "0");
      timeCount[`${formattedHour}:00`] = 0;
    }

    videoList.forEach((video) => {
      const publishedTime = new Date(video.snippet.publishedAt);
      const hours = publishedTime.getUTCHours();
      const roundedHours = Math.round(hours); // Round the hours to the nearest hour

      // Format the time as "HH:00"
      const formattedTime = `${roundedHours.toString().padStart(2, "0")}:00`;

      // Increment the count for the corresponding time slot
      if (timeCount.hasOwnProperty(formattedTime)) {
        timeCount[formattedTime]++;
      } else {
        timeCount[formattedTime] = 1;
      }
    });

    console.log(timeCount);

    // You can set timeCount state if needed
    // setFrequencyByTime(timeCount);

    return timeCount;
  };

  return (
    <div className="app grid gap-6">
      <form className="flex gap-2">
        <input
          type="text"
          placeholder="Search YouTuber..."
          className="url_input input input-bordered w-full "
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <button className="btn " onClick={addToQueryList}>
          Add Channel
        </button>
        <button className="btn " onClick={searchQueryInputs}>
          Analyze
        </button>
      </form>
      <div className="grid">
        <QueryItems queryList={queryList} setQueryList={setQueryList} />
        <div className=" grid pt-8 gap-6 sm:flex">
          <DayFrequencyChart analyzedData={analyzedData} />
          <TimeFrequencyChart analyzedData={analyzedData} />
        </div>
      </div>
    </div>
  );
};

export default TubeTrends;
