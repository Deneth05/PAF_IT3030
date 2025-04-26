import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import PostDetails from './screens/PostDetails';  // Import PostDetails
import CreatePost from './screens/CreatePost';
import { CommentsProvider } from './context/CommentContext';  // Import CommentsProvider

function App() {
    return (
      <CommentsProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/posts/:postId" element={<PostDetails />} /> 
                <Route path="/create-post" element = {<CreatePost/>}/>
            </Routes>
        </Router>
        </CommentsProvider>
    );
}

export default App;
