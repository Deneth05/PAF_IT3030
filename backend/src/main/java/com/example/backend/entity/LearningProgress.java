package com.example.backend.entity;

import java.util.List;

import org.springframework.data.annotation.Id;

public class LearningProgress {
   @Id
    private String id;
    private String userId;
    private String title;
    private String description;
    private Number rating;
    private List<Resource> resources;

    public Number getRating() {
      return rating;
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }


    public void setRating(Number rating) {
      this.rating = rating;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Resource> getResources() {
      return resources;
    }

    public void setResources(List<Resource> resources) {
      this.resources = resources;
    }


    
}
