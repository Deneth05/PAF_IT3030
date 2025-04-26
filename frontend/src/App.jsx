import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import CreatePost from './screens/CreatePost';
import { CommentsProvider } from './context/CommentContext';  // Import CommentsProvider
import Navbar from './components/nav-bar/nav-bar';
import LearningProgress from './components/learning-progress/learning-progress-form';
import Footer from './components/footer/footer';
import LearningProgressList from './components/learning-progress/learning-progress-list';

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
                </Routes>
                <Footer/>
            </Router>
        </CommentsProvider>
    );
}

export default App;