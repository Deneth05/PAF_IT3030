import React, { useState } from 'react';
import { createPost } from '../services/PostService';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    function savePost(event) {
        event.preventDefault();
        const post = { title, content, comments: [] };  // Only title and content

        console.log('Post to be saved:', post);

        createPost(post)
            .then(response => {
                console.log('Post added successfully:', response.data);
                navigate('/'); // Navigate only on success
            })
            .catch(error => {
                console.error('Error adding post:', error);
                setError('There was an error adding your post. Please try again.');
            });
    }

    return (
        <div className='container'>
            <br />
            <div className='row'>
                <div className='card col-md-6 offset-md-3'>
                    <div className='card-body'>
                        <form>
                            <div className='form-group mb-2'>
                                <label className='form-label'>Title</label>
                                <input
                                    type='text'
                                    placeholder='Enter Title'
                                    value={title}
                                    className='form-control'
                                    onChange={(event) => setTitle(event.target.value)}
                                />
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'>Content</label>
                                <textarea
                                    placeholder='Enter Content'
                                    value={content}
                                    className='form-control'
                                    onChange={(event) => setContent(event.target.value)}
                                />
                            </div>

                            {error && <div className="alert alert-danger mt-2">{error}</div>}

                            <button
                                className='btn btn-success'
                                onClick={savePost}
                                disabled={!title.trim() || !content.trim()}
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
