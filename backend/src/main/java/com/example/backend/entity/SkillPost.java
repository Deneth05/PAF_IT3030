package com.example.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "skillposts")
public class SkillPost {
    @Id
    private String id;
    private String title;
    private String description;
    private int likeCount = 0;
    private List<String> mediaUrls; // URLs to uploaded images/videos
    private List<String> comments; // Just strings for now

    // Getters and Setters
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public int getLikeCount() {
        return likeCount;
    }
    public void setLikeCount(int likeCount) {
        this.likeCount = likeCount;
    }
    public List<String> getMediaUrls() {
        return mediaUrls;
    }
    public void setMediaUrls(List<String> mediaUrls) {
        this.mediaUrls = mediaUrls;
    }
    public List<String> getComments() {
        return comments;
    }
    public void setComments(List<String> comments) {
        this.comments = comments;
    }
}
