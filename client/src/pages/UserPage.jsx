import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import { useEffect, useState } from "react";
import axios from "axios";
import useCustomToast from "../hooks/useCustomToast";
import { Center, Spinner } from "@chakra-ui/react";
import { getUserPosts } from "../requests/postRequests";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "../components/CreatePost";
import { removePosts } from "../reducers/postSlice";
import { getUserProfile } from "../requests/userRequests";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { posts } = useSelector((state) => state.post);
  const currentUser = useSelector((state) => state.user);
  const { username } = useParams();
  const toast = useCustomToast();
  const [loading, setLoading] = useState(false);
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const dispatch = useDispatch();

  const getUser = async () => {
    setLoading(true);
    dispatch(removePosts());
    setLoading(false);
    const data = await getUserProfile(username);
    setUser(data);
    setLoading(false);
  };

  const getPosts = async () => {
    setFetchingPosts(true);
    try {
      await dispatch(getUserPosts(username)).unwrap();
    } catch (error) {
      toast("Error", error, "error");
    }
    setFetchingPosts(false);
  };

  useEffect(() => {
    getUser();
    getPosts();
  }, [username]);
  if (!user && loading)
    return (
      <Center mt={20}>
        <Spinner size={"xl"} />
      </Center>
    );
  if (!user && !loading) return <h1>User Not Found</h1>;
  return (
    <>
      <UserHeader user={user} />
      {!fetchingPosts && posts.length === 0 && <h1>User has no posts.</h1>}
      {fetchingPosts && posts.length === 0 && (
        <Center mt={20}>
          <Spinner size={"xl"} />
        </Center>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
      {currentUser?.username === username && <CreatePost />}
    </>
  );
};

export default UserPage;
