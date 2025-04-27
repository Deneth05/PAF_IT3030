package com.example.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.entity.LearningPlan;

public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
}
