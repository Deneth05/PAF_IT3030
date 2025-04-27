package com.example.backend.service;

import org.springframework.stereotype.Service;

import com.example.backend.entity.LearningPlan;
import com.example.backend.repository.LearningPlanRepository;

import java.util.List;

@Service
public class LearningPlanService {
    private final LearningPlanRepository repository;

    public LearningPlanService(LearningPlanRepository repository) {
        this.repository = repository;
    }

    public List<LearningPlan> getAllPlans() {
        return repository.findAll();
    }

    public LearningPlan getPlanById(String id) {
        return repository.findById(id).orElse(null);
    }

    public LearningPlan createPlan(LearningPlan plan) {
        return repository.save(plan);
    }

    public LearningPlan updatePlan(String id, LearningPlan updatedPlan) {
        LearningPlan plan = repository.findById(id).orElse(null);
        if (plan != null) {
            plan.setTitle(updatedPlan.getTitle());
            plan.setSteps(updatedPlan.getSteps());
            return repository.save(plan);
        }
        return null;
    }

    public void deletePlan(String id) {
        repository.deleteById(id);
    }
}
