package com.example.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.entity.LearningProgress;
import com.example.backend.repository.LearningProgressRepository;

@Service
public class LearningProgressService {

    @Autowired
    private LearningProgressRepository repository;

    public LearningProgress createProgress(LearningProgress progress) {
        return repository.save(progress);
    }

    public List<LearningProgress> getAllProgress() {
        return repository.findAll();
    }

    public List<LearningProgress> getProgressByUserId(String userId) {
        return repository.findByUserId(userId);
    }

    public Optional<LearningProgress> getProgressById(String id) {
        return repository.findById(id);
    }

    public void deleteProgress(String id) {
        repository.deleteById(id);
    }

    public LearningProgress updateProgress(String id, LearningProgress updatedProgress) {
        return repository.findById(id).map(existing -> {
            existing.setTitle(updatedProgress.getTitle());
            existing.setDescription(updatedProgress.getDescription());
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Progress not found with id: " + id));
    }
}