package com.example.backend.controllers;

import com.example.backend.entity.Post;
import com.example.backend.service.PostService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
public class PostCommentController {
    private final PostService postService;


    public PostCommentController(PostService postService) {
        this.postService = postService;
    }

    // Create a new post
    @PostMapping
    public Post createPost(@RequestBody Post post) {
        return postService.createPost(post);
    }

    // Get all posts
    @GetMapping
    public List<Post> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        return posts;
    }

    // Get a post by ID
    @GetMapping("/{id}")
    public Post getPostById(@PathVariable Long id) {
        return postService.getPostById(id);
    }

    // Add a comment to a post
}

