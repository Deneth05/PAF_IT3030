package com.example.backend.service;

import com.example.backend.entity.Comment;
import com.example.backend.repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public Comment createComment(Comment comment) {
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }

    // Add this method to your existing CommentService class
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    public Optional<Comment> updateComment(String commentId, String newText) {
        Optional<Comment> optionalComment = commentRepository.findById(commentId);

        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            comment.setText(newText);
            comment.setUpdatedAt(java.time.LocalDateTime.now());
            commentRepository.save(comment);
        }

        return optionalComment;
    }

    public void deleteComment(String commentId) {
        commentRepository.deleteById(commentId);
    }
}
