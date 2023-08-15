"use client";
import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => {
        return (
          <PromptCard
            key={post._id}
            post={post}
            handleTagClick={handleTagClick}
          />
        );
      })}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchResults, setsearchResults] = useState([]);

  const [posts, setPosts] = useState([]);

  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, "i");
    console.log(searchText);
    return posts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag || regex.test(item.prompt))
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // Debounce logic
    setSearchTimeout(() => {
      setTimeout(() => {
        const newSearchResult = filterPrompts(e.target.value);
        setsearchResults(newSearchResult);
      }, 500);
    });
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const newSearchResult = filterPrompts(tagName);
    setsearchResults(newSearchResult);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();

      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {searchResults.length === 0 && searchText.length > 0 ? (
        <div> No results found</div>
      ) : (
        <PromptCardList
          data={(searchResults.length > 0 && searchResults) || posts}
          handleTagClick={handleTagClick}
        />
      )}
    </section>
  );
};

export default Feed;
