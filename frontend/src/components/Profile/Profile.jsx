import axios from 'axios';
import { useEffect, useState } from 'react';
import { Avatar, Badge, Card, Chip, Skeleton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocationOn, Email, Stars, Code } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 800,
  margin: '2rem auto',
  padding: '2rem',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
}));

const ProfileHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '2rem',
  gap: '2rem',
});

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: '4px solid',
  borderColor: theme.palette.primary.main,
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: '0.5rem',
  padding: '0.5rem 1rem',
  borderRadius: '12px',
  background: theme.palette.mode === 'dark' ? '#424242' : '#f0f2f5',
  '&:hover': {
    background: theme.palette.mode === 'dark' ? '#616161' : '#e0e0e0',
  },
}));

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:8081/api/auth/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setUser(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching user:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <StyledCard>
        <ProfileHeader>
          <Skeleton variant="circular" width={120} height={120} />
          <div style={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="40%" height={30} />
          </div>
        </ProfileHeader>
        <Skeleton variant="rectangular" width="100%" height={200} />
      </StyledCard>
    );
  }

  if (!user) return <div>Error loading profile. Please try again.</div>;

  return (
    <StyledCard>
      <ProfileHeader>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Avatar sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: 'primary.main',
              border: '2px solid white'
            }}>
              <Stars />
            </Avatar>
          }
        >
          <UserAvatar alt={user.userName} src={user.profilePicture || '/default-avatar.png'} />
        </Badge>
        
        <div>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            {user.userName}
          </Typography>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <Email color="action" />
            <Typography variant="body1" color="text.secondary">
              {user.email}
            </Typography>
          </div>
          
          {user.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <LocationOn color="action" />
              <Typography variant="body1" color="text.secondary">
                {user.location}
              </Typography>
            </div>
          )}
        </div>
      </ProfileHeader>

      {user.bio && (
        <Typography variant="body1" paragraph sx={{ 
          marginBottom: '2rem',
          lineHeight: 1.6,
          color: 'text.secondary'
        }}>
          {user.bio}
        </Typography>
      )}

      <div style={{ marginTop: '2rem' }}>
        <Typography variant="h6" gutterBottom sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontWeight: 600,
          marginBottom: '1.5rem'
        }}>
          <Code color="primary" /> Skills I'm Interested In
        </Typography>
        
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {user.skillsInterested?.length > 0 ? (
            user.skillsInterested.map((skill, index) => (
              <SkillChip 
                key={index} 
                label={skill.name}
                avatar={skill.icon ? <Avatar src={skill.icon} /> : undefined}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No skills selected yet
            </Typography>
          )}
        </div>
      </div>

      {user.skillsOffered?.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <Typography variant="h6" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <Code color="primary" /> Skills I Can Share
          </Typography>
          
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {user.skillsOffered.map((skill, index) => (
              <SkillChip 
                key={index} 
                label={skill.name}
                color="primary"
                variant="outlined"
              />
            ))}
          </div>
        </div>
      )}
    </StyledCard>
  );
}

export default UserProfile;