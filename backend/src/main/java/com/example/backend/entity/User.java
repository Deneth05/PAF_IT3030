package com.example.backend.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
  @Id
  private String id;
  private String email;
  private String password;
  private String userName;
  private List<Skill> skillsInterested;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public List<Skill> getSkillsInterested() {
    return skillsInterested;
  }

  public void setSkillsInterested(List<Skill> skillsInterested) {
    this.skillsInterested = skillsInterested;
  }
}