import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import CreatePost from './screens/CreatePost';
import { CommentsProvider } from './context/CommentContext';  // Import CommentsProvider
import Navbar from './components/nav-bar/nav-bar';
import LearningProgressForm from './components/learning-progress/learning-progress-form';
import Footer from './components/footer/footer';
import LearningProgressList from './components/learning-progress/learning-progress-list';
import Login from './components/log-in/login';
import Register from './components/register/register';
import LearningPlanForm from './components/Learning-plan/LearningPlanForm';
import Profile from './components/Profile/Profile'
import SkillSharePostForm from './components/skill-posts/SkillSharePostForm';
import PostCreationForm from './components/SkillPost/PostCreationForm';
import CommentForm from './components/Comments/CommentForm';

function App() {

    return (
        <CommentsProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/learning-progress/new" element={<LearningProgressForm />} />
                    <Route path="/create-post" element={<CreatePost />} />
                    <Route path="/learning-porogress" element={<LearningProgressList/>} />
                    <Route path="/learning-progress/edit/:id" element={<LearningProgressForm />} />
                    <Route path="/learning-plan" element={<LearningPlanForm/>} />
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/skill-post/create" element={<PostCreationForm/>} />
                    <Route path="/comments/create" element={<CommentForm/>} />

                    <Route path="/login/" element={<Login />} />
                    <Route path="/register/" element={<Register />} />
                    <Route path="/SkillSharePost/new" element={<SkillSharePostForm/>}/>
                    <Route path="/create" element={<CreatePost/>}/>
                </Routes>
                <Footer/>
            </Router>
        </CommentsProvider>
    );
}

export default App;
