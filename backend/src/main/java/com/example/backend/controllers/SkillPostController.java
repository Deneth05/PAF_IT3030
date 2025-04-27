package com.example.backend.controllers;

import com.example.backend.entity.SkillPost;
import com.example.backend.service.SkillPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true") // Allow frontend calls
public class SkillPostController {

    @Autowired
    private SkillPostService service;

    @PostMapping
    public SkillPost createPost(@RequestBody SkillPost post) {
        return service.createPost(post);
    }

    @GetMapping
    public List<SkillPost> getAllPosts() {
        return service.getAllPosts();
    }

    @GetMapping("/{id}")
    public SkillPost getPostById(@PathVariable String id) {
        return service.getPostById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public SkillPost updatePost(@PathVariable String id, @RequestBody SkillPost post) {
        return service.updatePost(id, post);
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable String id) {
        service.deletePost(id);
    }
}
