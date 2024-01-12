import React, { createContext, useState, useContext, useCallback } from "react";
import api from "../../../utils/api.utils";

const PostsContext = createContext();

export const usePosts = () => useContext(PostsContext);

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await api.get("/posts");
      if (response.data) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error(`Error fetching posts:`, error);
    }
  };

  const addPost = async (postData) => {
    try {
      const response = await api.post("/posts", postData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data) {
        setPosts((prevPosts) => [response.data, ...prevPosts]);
      }
    } catch (error) {
      console.error(`Error creating post:`, error);
    }
  };

  const deletePost = async (postId) => {
    try {
      const res = await api.delete(`/posts/${postId}`);
      if (res.status === 200) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      } else {
        console.error("Failed to delete post:", res.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const likePost = async (postId) => {
    try {
      const res = await api.post(`/posts/like/${postId}`);
      if (res.status === 200) {
        const updatedPosts = posts.map((post) => {
          if (post._id === postId) {
            return { ...post, likes: res.data.likes };
          }
          return post;
        });
        setPosts(updatedPosts);
      } else {
        console.error("Failed to like post:", res.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitComment = async (postId, commentData) => {
    try {
      const res = await api.put("/posts/comments", commentData);
      if (res.data) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === postId ? res.data : post))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const editPost = async (postId, editedData) => {
    try {
      const response = await api.put(`/posts/${postId}`, editedData);
      if (response.status === 200) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, text: response.data.text } : post
          )
        );
      } else {
        console.error("Failed to update post:", response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        fetchPosts,
        addPost,
        editPost,
        deletePost,
        likePost,
        submitComment,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};
