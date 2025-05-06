import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { IoSend } from "react-icons/io5";
import { FaEdit, FaUserCircle, FaPen } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { BiSolidLike } from "react-icons/bi";
import NavBar from '../../Components/NavBar/NavBar';
import Modal from 'react-modal';

Modal.setAppElement('#root');

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const CreateButton = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 100;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const PostsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
  margin-top: 20px;
`;

const PostCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const UserAvatar = styled.div`
  margin-right: 12px;
  
  .user-icon {
    color: #6e8efb;
    font-size: 36px;
  }
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: #333;
`;

const FollowButton = styled.button`
  margin-left: auto;
  padding: 6px 12px;
  border: none;
  border-radius: 20px;
  background: ${props => props.following ? '#e0e0e0' : '#6e8efb'};
  color: ${props => props.following ? '#333' : 'white'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.following ? '#d0d0d0' : '#5a7df5'};
  }
`;

const PostContent = styled.div`
  padding: 16px;
`;

const PostTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 20px;
  color: #222;
`;

const PostDescription = styled.p`
  margin: 0;
  color: #555;
  line-height: 1.6;
  white-space: pre-line;
`;

const MediaGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
  margin-top: 16px;
`;

const MediaItem = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 1;
  
  img, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img, &:hover video {
    transform: scale(1.03);
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

const InteractionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
`;

const LikeButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  .likebtn {
    color: #888;
    font-size: 22px;
    transition: all 0.2s ease;
    
    &:hover {
      color: #6e8efb;
    }
  }

  .unlikebtn {
    color: #6e8efb;
    font-size: 22px;
  }
`;

const LikeCount = styled.span`
  font-size: 14px;
  color: #666;
`;

const CommentInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #6e8efb;
  }
`;

const SendButton = styled.div`
  color: #6e8efb;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const CommentsSection = styled.div`
  padding: 0 16px 16px;
`;

const CommentCard = styled.div`
  display: flex;
  flex-direction: column;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const CommentAuthor = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #444;
`;

const CommentContent = styled.p`
  margin: 0;
  font-size: 14px;
  color: #555;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const CommentButton = styled.button`
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  background: ${props => props.primary ? '#6e8efb' : '#e0e0e0'};
  color: ${props => props.primary ? 'white' : '#333'};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.primary ? '#5a7df5' : '#d0d0d0'};
  }
`;

const EditCommentInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 8px;
`;

const NoPostsMessage = styled.div`
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  h3 {
    color: #333;
    margin-bottom: 8px;
  }

  p {
    color: #666;
  }
`;

const FilterToggle = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const ToggleButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: ${props => props.active ? '#6e8efb' : '#e0e0e0'};
  color: ${props => props.active ? 'white' : '#333'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#5a7df5' : '#d0d0d0'};
  }
`;

const StyledModal = styled(Modal)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 12px;
  padding: 20px;
  max-width: 90%;
  max-height: 90%;
  outline: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  img, video {
    max-width: 800px;
    max-height: 80vh;
    display: block;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
`;

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

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
  };

  return (
    <div>
      <NavBar />
      <Container>
        <FilterToggle>
          <ToggleButton active={showMyPosts} onClick={handleMyPostsToggle}>
            {showMyPosts ? 'Show All Posts' : 'Show My Posts'}
          </ToggleButton>
        </FilterToggle>

        <PostsContainer>
          {filteredPosts.length === 0 ? (
            <NoPostsMessage>
              <h3>No posts found</h3>
              <p>Be the first to share something amazing!</p>
            </NoPostsMessage>
          ) : (
            filteredPosts.map((post) => (
              <PostCard key={post.id}>
                <PostHeader>
                  <UserAvatar>
                    <FaUserCircle className="user-icon" />
                  </UserAvatar>
                  <Username>{postOwners[post.userID] || 'Anonymous'}</Username>
                  {post.userID !== loggedInUserID && (
                    <FollowButton 
                      following={followedUsers.includes(post.userID)}
                      onClick={() => handleFollowToggle(post.userID)}
                    >
                      {followedUsers.includes(post.userID) ? 'Following' : 'Follow'}
                    </FollowButton>
                  )}
                  {post.userID === loggedInUserID && (
                    <div>
                      <CommentButton onClick={() => handleUpdate(post.id)}>
                        <FaEdit />
                      </CommentButton>
                      <CommentButton onClick={() => handleDelete(post.id)}>
                        <RiDeleteBin6Fill />
                      </CommentButton>
                    </div>
                  )}
                </PostHeader>

                <PostContent>
                  <PostTitle>{post.title}</PostTitle>
                  <PostDescription>{post.description}</PostDescription>

                  {post.media && post.media.length > 0 && (
                    <MediaGallery>
                      {post.media.slice(0, 4).map((mediaUrl, index) => (
                        <MediaItem 
                          key={index} 
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
                            <Overlay>+{post.media.length - 4}</Overlay>
                          )}
                        </MediaItem>
                      ))}
                    </MediaGallery>
                  )}
                </PostContent>

                <InteractionBar>
                  <LikeButton onClick={() => handleLike(post.id)}>
                    <BiSolidLike
                      className={post.likes?.[localStorage.getItem('userID')] ? 'unlikebtn' : 'likebtn'}
                    />
                    <LikeCount>
                      {Object.values(post.likes || {}).filter((liked) => liked).length} likes
                    </LikeCount>
                  </LikeButton>

                  <CommentInputContainer>
                    <CommentInput
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment[post.id] || ''}
                      onChange={(e) =>
                        setNewComment({ ...newComment, [post.id]: e.target.value })
                      }
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                    />
                    <SendButton onClick={() => handleAddComment(post.id)}>
                      <IoSend />
                    </SendButton>
                  </CommentInputContainer>
                </InteractionBar>

                {post.comments && post.comments.length > 0 && (
                  <CommentsSection>
                    {post.comments.map((comment) => (
                      <CommentCard key={comment.id}>
                        <CommentHeader>
                          <CommentAuthor>{comment.userFullName}</CommentAuthor>
                          {(comment.userID === loggedInUserID || post.userID === loggedInUserID) && (
                            <CommentActions>
                              {comment.userID === loggedInUserID && (
                                <>
                                  {editingComment.id === comment.id ? (
                                    <>
                                      <CommentButton 
                                        primary 
                                        onClick={() =>
                                          handleSaveComment(post.id, comment.id, editingComment.content)
                                        }
                                      >
                                        Save
                                      </CommentButton>
                                      <CommentButton onClick={() => setEditingComment({})}>
                                        Cancel
                                      </CommentButton>
                                    </>
                                  ) : (
                                    <>
                                      <CommentButton 
                                        onClick={() =>
                                          setEditingComment({ id: comment.id, content: comment.content })
                                        }
                                      >
                                        Edit
                                      </CommentButton>
                                      <CommentButton 
                                        onClick={() => handleDeleteComment(post.id, comment.id)}
                                      >
                                        Delete
                                      </CommentButton>
                                    </>
                                  )}
                                </>
                              )}
                              {post.userID === loggedInUserID && comment.userID !== loggedInUserID && (
                                <CommentButton 
                                  onClick={() => handleDeleteComment(post.id, comment.id)}
                                >
                                  Delete
                                </CommentButton>
                              )}
                            </CommentActions>
                          )}
                        </CommentHeader>

                        {editingComment.id === comment.id ? (
                          <EditCommentInput
                            type="text"
                            value={editingComment.content}
                            onChange={(e) =>
                              setEditingComment({ ...editingComment, content: e.target.value })
                            }
                            autoFocus
                          />
                        ) : (
                          <CommentContent>{comment.content}</CommentContent>
                        )}
                      </CommentCard>
                    ))}
                  </CommentsSection>
                )}
              </PostCard>
            ))
          )}
        </PostsContainer>

        <CreateButton onClick={() => navigate('/addNewPost')}>
          <FaPen />
        </CreateButton>

        <StyledModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Media Modal"
          overlayElement={(props, contentElement) => (
            <ModalOverlay {...props}>{contentElement}</ModalOverlay>
          )}
        >
          {selectedMedia && (
            selectedMedia.endsWith('.mp4') ? (
              <video controls autoPlay>
                <source src={`http://localhost:8080${selectedMedia}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={`http://localhost:8080${selectedMedia}`} alt="Full size media" />
            )
          )}
        </StyledModal>
      </Container>
    </div>
  );
}

export default AllPost;