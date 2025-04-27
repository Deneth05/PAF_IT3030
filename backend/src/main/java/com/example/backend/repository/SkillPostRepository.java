package com.example.backend.repository;



import com.example.backend.entity.SkillPost;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SkillPostRepository extends MongoRepository<SkillPost, String> {
}
