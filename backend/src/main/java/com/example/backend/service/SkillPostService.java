package com.example.backend.service;


import com.example.backend.entity.SkillPost;
import com.example.backend.repository.SkillPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SkillPostService {

    @Autowired
    private SkillPostRepository repository;

    public SkillPost createPost(SkillPost post) {
        return repository.save(post);
    }

    public List<SkillPost> getAllPosts() {
        return repository.findAll();
    }

    public Optional<SkillPost> getPostById(String id) {
        return repository.findById(id);
    }

    public SkillPost updatePost(String id, SkillPost updatedPost) {
        return repository.findById(id).map(post -> {
            post.setTitle(updatedPost.getTitle());
            post.setDescription(updatedPost.getDescription());
            post.setMediaUrls(updatedPost.getMediaUrls());
            post.setComments(updatedPost.getComments());
            post.setLikeCount(updatedPost.getLikeCount());
            return repository.save(post);
        }).orElse(null);
    }

    public void deletePost(String id) {
        repository.deleteById(id);
    }
}
