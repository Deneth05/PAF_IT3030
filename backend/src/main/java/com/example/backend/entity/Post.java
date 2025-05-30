package com.example.backend.entity;

import org.springframework.data.mongodb.core.mapping.Document;

@Document 
public class Post {

    private String title;

    private String content;

    public Post() {}

    public Post(String title, String content) {
        this.title = title;
        this.content = content;

    }
    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }


}
