import { useState } from 'react';
import { Card, Typography, Button, IconButton, Collapse, TextField, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Email, Delete, ExpandMore, ExpandLess } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 800,
  margin: '2rem auto',
  padding: '2rem',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
}));

const PostCard = styled(Card)(({ theme }) => ({
  margin: '1.5rem 0',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
}));

const PostImage = styled('img')({
  width: '100%',
  maxHeight: '400px',
  objectFit: 'cover',
  borderRadius: '8px',
  margin: '0.5rem 0',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
});

function UserProfile() {
  // Hardcoded user data
  const user = {
    userName: "ArtEnthusiast",
    email: "art.lover@example.com",
  };

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Watercolor Painting Techniques",
      content: "Sharing some of my favorite watercolor techniques I've learned over the years. Wet-on-wet blending creates beautiful gradients, while dry brushing adds texture to your paintings.",
      images: [
        "https://images.unsplash.com/photo-1579965342575-16428a7c8881",
        "https://images.unsplash.com/photo-1531219572328-a0171d44432a",
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5"
      ],
      likes: 2,
      comments: [
        { id: 1, author: "ArtLover", text: "These techniques are amazing! Thanks for sharing." },
        { id: 2, author: "DIYExpert", text: "Can't wait to try these out this weekend!" }
      ],
      author: "ArtEnthusiast",
      showComments: false,
      newComment: ""
    },
    {
      id: 2,
      title: "My Latest Art Exhibition",
      content: "Thrilled to share that my artwork will be featured at the Downtown Gallery next month! The exhibition will run from June 15-30. Hope to see some of you there!",
      images: [
        "https://images.unsplash.com/photo-1547891654-e66ed7ebb968"
      ],
      likes: 3,
      comments: [
        { id: 3, author: "GalleryGoer", text: "Congratulations! I'll definitely come check it out." },
        { id: 4, author: "FellowArtist", text: "Your work is inspiring. Best of luck with the show!" }
      ],
      author: "ArtEnthusiast",
      showComments: false,
      newComment: ""
    }
  ]);

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const toggleComments = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, showComments: !post.showComments } : post
    ));
  };

  const handleAddComment = (postId, commentText) => {
    if (!commentText.trim()) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: Date.now(),
          author: user.userName,
          text: commentText
        };
        return {
          ...post,
          comments: [...post.comments, newComment],
          newComment: ""
        };
      }
      return post;
    }));
  };

  return (
    <StyledCard>
      {/* Simplified User Profile */}
      <Box sx={{ marginBottom: '2rem' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          {user.userName}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Email color="action" />
          <Typography variant="body1" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
      </Box>

      {/* My Posts Section */}
      <div style={{ marginTop: '2rem' }}>
        <Typography variant="h5" gutterBottom sx={{ 
          fontWeight: 700,
          marginBottom: '1.5rem',
          paddingBottom: '0.5rem',
          borderBottom: '2px solid',
          borderColor: 'divider'
        }}>
          My Posts
        </Typography>

        {posts.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            You haven't created any posts yet.
          </Typography>
        ) : (
          posts.map(post => (
            <PostCard key={post.id}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {post.title}
                </Typography>
                <IconButton 
                  onClick={() => handleDeletePost(post.id)}
                  color="error"
                  aria-label="delete post"
                >
                  <Delete />
                </IconButton>
              </Box>
              
              <Typography variant="body1" sx={{ marginY: '1rem' }}>
                {post.content}
              </Typography>
              
              {/* Post Images */}
              {post.images && post.images.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {post.images.map((image, idx) => (
                    <PostImage 
                      key={idx} 
                      src={image} 
                      alt={`Post ${post.id} image ${idx + 1}`}
                    />
                  ))}
                </Box>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 2 }}>
                <Button color="inherit">
                  {post.likes} Likes
                </Button>
                
                <Button 
                  startIcon={<ExpandMore />} 
                  color="inherit"
                  onClick={() => toggleComments(post.id)}
                  endIcon={post.showComments ? <ExpandLess /> : <ExpandMore />}
                >
                  {post.comments.length} Comments
                </Button>
              </Box>
              
              <Collapse in={post.showComments}>
                <Box sx={{ mt: 2 }}>
                  {post.comments.map(comment => (
                    <Box key={comment.id} sx={{ mb: 1, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {comment.author}
                      </Typography>
                      <Typography variant="body2">
                        {comment.text}
                      </Typography>
                    </Box>
                  ))}
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Add a comment..."
                      value={post.newComment}
                      onChange={(e) => setPosts(posts.map(p => 
                        p.id === post.id ? { ...p, newComment: e.target.value } : p
                      ))}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(post.id, post.newComment);
                        }
                      }}
                    />
                    <Button 
                      variant="contained"
                      onClick={() => handleAddComment(post.id, post.newComment)}
                    >
                      Post
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </PostCard>
          ))
        )}
      </div>
    </StyledCard>
  );
}

export default UserProfile;