import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoSend } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { FaUserCircle, FaPen } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { BiSolidLike } from "react-icons/bi";
import NavBar from '../../Components/NavBar/NavBar';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function AllPost() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [postOwners, setPostOwners] = useState({});
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [editingComment, setEditingComment] = useState({});
  const navigate = useNavigate();
  const loggedInUserID = localStorage.getItem('userID');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/posts');
        setPosts(response.data);
        setFilteredPosts(response.data);

        const userIDs = [...new Set(response.data.map((post) => post.userID))];
        const ownerPromises = userIDs.map((userID) =>
          axios.get(`http://localhost:8080/user/${userID}`)
            .then((res) => ({
              userID,
              fullName: res.data.fullname,
            }))
            .catch((error) => {
              console.error(`Error fetching user details for userID ${userID}:`, error);
              return { userID, fullName: 'Anonymous' };
            })
        );
        const owners = await Promise.all(ownerPromises);
        const ownerMap = owners.reduce((acc, owner) => {
          acc[owner.userID] = owner.fullName;
          return acc;
        }, {});
        console.log('Post Owners Map:', ownerMap);
        setPostOwners(ownerMap);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      const userID = localStorage.getItem('userID');
      if (userID) {
        try {
          const response = await axios.get(`http://localhost:8080/user/${userID}/followedUsers`);
          setFollowedUsers(response.data);
        } catch (error) {
          console.error('Error fetching followed users:', error);
        }
      }
    };

    fetchFollowedUsers();
  }, []);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/posts/${postId}`);
      alert('Post deleted successfully!');
      setPosts(posts.filter((post) => post.id !== postId));
      setFilteredPosts(filteredPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post.');
    }
  };

  const handleUpdate = (postId) => {
    navigate(`/updatePost/${postId}`);
  };

  const handleMyPostsToggle = () => {
    if (showMyPosts) {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((post) => post.userID === loggedInUserID));
    }
    setShowMyPosts(!showMyPosts);
  };

  const handleLike = async (postId) => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      alert('Please log in to like a post.');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/posts/${postId}/like`, null, {
        params: { userID },
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleFollowToggle = async (postOwnerID) => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      alert('Please log in to follow/unfollow users.');
      return;
    }
    try {
      if (followedUsers.includes(postOwnerID)) {
        await axios.put(`http://localhost:8080/user/${userID}/unfollow`, { unfollowUserID: postOwnerID });
        setFollowedUsers(followedUsers.filter((id) => id !== postOwnerID));
      } else {
        await axios.put(`http://localhost:8080/user/${userID}/follow`, { followUserID: postOwnerID });
        setFollowedUsers([...followedUsers, postOwnerID]);
      }
    } catch (error) {
      console.error('Error toggling follow state:', error);
    }
  };

  const handleAddComment = async (postId) => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      alert('Please log in to comment.');
      return;
    }
    const content = newComment[postId] || '';
    if (!content.trim()) {
      alert('Comment cannot be empty.');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8080/posts/${postId}/comment`, {
        userID,
        content,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, comments: response.data.comments } : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId ? { ...post, comments: response.data.comments } : post
        )
      );

      setNewComment({ ...newComment, [postId]: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    const userID = localStorage.getItem('userID');
    try {
      await axios.delete(`http://localhost:8080/posts/${postId}/comment/${commentId}`, {
        params: { userID },
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: post.comments.filter((comment) => comment.id !== commentId) }
            : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: post.comments.filter((comment) => comment.id !== commentId) }
            : post
        )
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleSaveComment = async (postId, commentId, content) => {
    try {
      const userID = localStorage.getItem('userID');
      await axios.put(`http://localhost:8080/posts/${postId}/comment/${commentId}`, {
        userID,
        content,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId ? { ...comment, content } : comment
              ),
            }
            : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId
            ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId ? { ...comment, content } : comment
              ),
            }
            : post
        )
      );

      setEditingComment({});
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  };

  const openModal = (mediaUrl) => {
    setSelectedMedia(mediaUrl);
    setIsModalOpen(true);
  };

  return (
    <div>
      <NavBar />
      <div className='create_btn' onClick={() => (window.location.href = '/addNewPost')}>
        <FaPen className='create_btn_icon' />
      </div>
      <div className='posts-container'>
        <div className='continSection'>
          <div className='post_card_continer'>
            {filteredPosts.length === 0 ? (
              <div className="no-posts">
                <h3>No posts found</h3>
                <p>Be the first to share something amazing!</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div key={post.id} className='post-card'>
                  <div className="post-header">
                    <div className="user-info">
                      <div className="avatar">
                        <FaUserCircle className="user-icon" />
                      </div>
                      <span className="username">{postOwners[post.userID] || 'Anonymous'}</span>
                      {post.userID !== loggedInUserID && (
                        <button
                          className={followedUsers.includes(post.userID) ? 'flow_btn_unfalow' : 'flow_btn'}
                          onClick={() => handleFollowToggle(post.userID)}
                        >
                          {followedUsers.includes(post.userID) ? 'Unfollow' : 'Follow'}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className='dix_con'>
                    <div className="post-title-container">
                      <h3 className="post-title">{post.title}</h3>
                    </div>
                    <div className="post-description">
                      <p style={{ whiteSpace: "pre-line" }}>{post.description}</p>
                    </div>
                  </div>
                  <div className="media-gallery">
                    {post.media.slice(0, 4).map((mediaUrl, index) => (
                      <div
                        key={index}
                        className={`media-item ${post.media.length > 4 && index === 3 ? 'has-overlay' : ''}`}
                        onClick={() => openModal(mediaUrl)}
                      >
                        {mediaUrl.endsWith('.mp4') ? (
                          <video controls>
                            <source src={`http://localhost:8080${mediaUrl}`} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img src={`http://localhost:8080${mediaUrl}`} alt="Post Media" />
                        )}
                        {post.media.length > 4 && index === 3 && (
                          <div className="overlay">+{post.media.length - 4}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className='like_coment_lne'>
                    <div className='like_btn_con'>
                      <BiSolidLike
                        className={post.likes?.[localStorage.getItem('userID')] ? 'unlikebtn' : 'likebtn'}
                        onClick={() => handleLike(post.id)}
                      >
                        {post.likes?.[localStorage.getItem('userID')] ? 'Unlike' : 'Like'}
                      </BiSolidLike>
                      <p className='like_num'>
                        {Object.values(post.likes || {}).filter((liked) => liked).length}
                      </p>
                    </div>
                    <div className='add_comennt_con'>
                      <input
                        type="text"
                        className='add_coment_input'
                        placeholder="Add a comment"
                        value={newComment[post.id] || ''}
                        onChange={(e) =>
                          setNewComment({ ...newComment, [post.id]: e.target.value })
                        }
                      />
                      <IoSend
                        onClick={() => handleAddComment(post.id)}
                        className='add_coment_btn'
                      />
                    </div>
                  </div>
                  <div>
                    {post.comments?.map((comment) => (
                      <div key={comment.id} className='coment_full_card'>
                        <div className='comnt_card'>
                          <p className='comnt_card_username'>{comment.userFullName}</p>
                          {editingComment.id === comment.id ? (
                            <input
                              type="text"
                              className='edit_comment_input'
                              value={editingComment.content}
                              onChange={(e) =>
                                setEditingComment({ ...editingComment, content: e.target.value })
                              }
                              autoFocus
                            />
                          ) : (
                            <p className='comnt_card_coment'>{comment.content}</p>
                          )}
                        </div>

                        <div className='coment_action_btn'>
                          {comment.userID === loggedInUserID && (
                            <>
                              {editingComment.id === comment.id ? (
                                <>
                                  <button
                                    className='coment_btn'
                                    onClick={() =>
                                      handleSaveComment(post.id, comment.id, editingComment.content)
                                    }
                                  >
                                    Save
                                  </button>
                                  <button
                                    className='coment_btn'
                                    onClick={() => setEditingComment({})}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className='coment_btn'
                                    onClick={() =>
                                      setEditingComment({ id: comment.id, content: comment.content })
                                    }
                                  >
                                    Update
                                  </button>
                                  <button
                                    className='coment_btn'
                                    onClick={() => handleDeleteComment(post.id, comment.id)}
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </>
                          )}
                          {post.userID === loggedInUserID && comment.userID !== loggedInUserID && (
                            <button
                              className='coment_btn'
                              onClick={() => handleDeleteComment(post.id, comment.id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

     
    </div>
  );
}

export default AllPost;
