package com.example.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.entity.User;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
}
