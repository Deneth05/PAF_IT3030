package com.example.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.entity.LearningProgress;

public interface LearningProgressRepository extends MongoRepository<LearningProgress, String> {
    List<LearningProgress> findByUserId(String userId);
}

