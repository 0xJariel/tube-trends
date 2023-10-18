import React from "react";

const TopFiveTable = () => {
  return (
    <table class="sortable">
      <h1 className="title">Recent Uploads</h1>
      <h4 className="subTitle">Last 5 videos</h4>
      <thead>
        <tr>
          <th>Channel</th>
          <th>Video Title</th>
          <th>Views</th>
          <th>Likes</th>
          <th>Comments</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John Doe</td>
          <td>30</td>
          <td>United States</td>
        </tr>
        <tr>
          <td>Jane Doe</td>
          <td>25</td>
          <td>Canada</td>
        </tr>
        <tr>
          <td>Peter Smith</td>
          <td>40</td>
          <td>United Kingdom</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TopFiveTable;
