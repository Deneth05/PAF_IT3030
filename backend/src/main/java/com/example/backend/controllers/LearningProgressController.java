package com.example.backend.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.LearningProgress;
import com.example.backend.service.LearningProgressService;

@RestController
@RequestMapping("/api/progress")
public class LearningProgressController {

    private final LearningProgressService service;

    public LearningProgressController(LearningProgressService service) {
        this.service = service;
    }

    @PostMapping
    public LearningProgress createProgress(@RequestBody LearningProgress progress) {
        return service.createProgress(progress);
    }

    @GetMapping("/user/{userId}")
    public List<LearningProgress> getProgressByUser(@PathVariable String userId) {
        return service.getProgressByUserId(userId);
    }

    @GetMapping("/{id}")
    public Optional<LearningProgress> getProgressById(@PathVariable String id) {
        return service.getProgressById(id);
    }

    @GetMapping
    public List<LearningProgress> getAllProgress() {
        return service.getAllProgress();
    }

    @PutMapping("/{id}")
    public LearningProgress updateProgress(@PathVariable String id, @RequestBody LearningProgress updatedProgress) {
        return service.updateProgress(id, updatedProgress);
    }

    @DeleteMapping("/{id}")
    public void deleteProgress(@PathVariable String id) {
        service.deleteProgress(id);
    }
}