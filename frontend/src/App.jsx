import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import CreatePost from './screens/CreatePost';
import { CommentsProvider } from './context/CommentContext';  // Import CommentsProvider
import Navbar from './components/nav-bar/nav-bar';
import LearningProgress from './components/learning-progress/learning-progress-form';
import Footer from './components/footer/footer';
import LearningProgressList from './components/learning-progress/learning-progress-list';
import Login from './components/log-in/login';
import Register from './components/register/register';

function App() {

    return (
        <CommentsProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/learning-progress/new" element={<LearningProgress />} />
                    <Route path="/create-post" element={<CreatePost />} />
                    <Route path="/learning-porogress" element={<LearningProgressList/>} />
                    <Route path="/learning-progress/edit/:id" element={<LearningProgress />} />

                    <Route path="/login/" element={<Login />} />
                    <Route path="/register/" element={<Register />} />

                </Routes>
                <Footer/>
            </Router>
        </CommentsProvider>
    );
}

export default App;