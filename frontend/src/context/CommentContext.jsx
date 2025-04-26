import React, { createContext, useState, useContext } from 'react';

const CommentsContext = createContext();

export const useComments = () => {
    return useContext(CommentsContext);
};

export const CommentsProvider = ({ children }) => {
    const [comments, setComments] = useState({});  // Comments stored by postId

    const addComment = (postId, comment) => {
        setComments((prevComments) => ({
            ...prevComments,
            [postId]: [...(prevComments[postId] || []), comment],  // Add comment to specific post
        }));
    };

    const getCommentsByPostId = (postId) => {
        return comments[postId] || [];  // Return comments for the specific post
    };

    return (
        <CommentsContext.Provider value={{ comments, addComment, getCommentsByPostId }}>
            {children}
        </CommentsContext.Provider>
    );
};
