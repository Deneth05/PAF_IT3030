package com.example.backend.controllers;
import org.springframework.web.bind.annotation.*;
import com.example.backend.entity.LearningPlan;
import com.example.backend.service.LearningPlanService;

import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend
public class LearningPlanController {
    private final LearningPlanService service;

    public LearningPlanController(LearningPlanService service) {
        this.service = service;
    }

    @GetMapping
    public List<LearningPlan> getAllPlans() {
        return service.getAllPlans();
    }

    @GetMapping("/{id}")
    public LearningPlan getPlanById(@PathVariable String id) {
        return service.getPlanById(id);
    }

    @PostMapping
    public LearningPlan createPlan(@RequestBody LearningPlan plan) {
        return service.createPlan(plan);
    }

    @PutMapping("/{id}")
    public LearningPlan updatePlan(@PathVariable String id, @RequestBody LearningPlan updatedPlan) {
        return service.updatePlan(id, updatedPlan);
    }

    @DeleteMapping("/{id}")
    public void deletePlan(@PathVariable String id) {
        service.deletePlan(id);
    }
}
