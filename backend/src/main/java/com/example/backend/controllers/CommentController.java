package com.example.backend.controllers;

import com.example.backend.entity.Comment;
import com.example.backend.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // Create a comment
    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment) {
        Comment savedComment = commentService.createComment(comment);
        return ResponseEntity.ok(savedComment);
    }

    // Get comments for a specific post
    // @GetMapping("/post/{postId}")
    // public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable String postId) {
    //     List<Comment> comments = commentService.getCommentsByPostId(postId);
    //     return ResponseEntity.ok(comments);
    // }

    @GetMapping
    public ResponseEntity<List<Comment>> getAllComments() {
        List<Comment> comments = commentService.getAllComments();
        return ResponseEntity.ok(comments);
    }

    // Update a comment
    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable String commentId, @RequestBody Comment updatedComment) {
        Optional<Comment> comment = commentService.updateComment(commentId, updatedComment.getText());

        if (comment.isPresent()) {
            return ResponseEntity.ok(comment.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a comment
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable String commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}
