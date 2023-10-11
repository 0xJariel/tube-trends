import React from "react";

const QueryItems = ({ queryList, setQueryList }) => {
  const removeFromQueryList = (idToRemove) => {
    // Filter out the item with the matching id
    const updatedQueryList = queryList.filter((item) => item.id !== idToRemove);
    setQueryList(updatedQueryList);
  };

  return (
    <div className="flex flex-wrap mx-auto max-w-2xl">
      {queryList &&
        queryList.map((searchItem) => {
          return (
            <button
              key={searchItem.id}
              className="btn"
              onClick={(e) => removeFromQueryList(searchItem.id)} // Pass the id to remove
              style={{ cursor: "pointer" }}
            >
              <div>{searchItem.title}</div>
              <div>X</div>
            </button>
          );
        })}
    </div>
  );
};

export default QueryItems;
