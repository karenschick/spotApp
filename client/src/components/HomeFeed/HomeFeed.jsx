import React, { useEffect, useState } from "react";
import { useProvideAuth } from "../../hooks/useAuth";
import { Row, Col } from "react-bootstrap";
import PostCard from "../PostCard/PostCard";
import { usePosts } from "../PostCard/PostsContext";

const HomeFeed = () => {
  const {
    state: { user: userObj },
  } = useProvideAuth();

  const { posts, fetchPosts, setPosts } = usePosts();

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Row>
      {posts.map(post => (
        <Col key={post._id} xs={12}>
          <PostCard post={post} posts={posts} setPosts={setPosts} />
        </Col>
      ))}
    </Row>
  );
};

export default HomeFeed;
