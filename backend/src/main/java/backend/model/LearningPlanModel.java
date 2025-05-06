package backend.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "LearningPlan")
public class LearningPlanModel {
    @Id
    @GeneratedValue
    private String id;
    private String title;
    private List<Step> steps;  // Changed from String description to List<Step>
    private String postOwnerID;
    private String postOwnerName;
    private LocalDateTime createdAt;

    public LearningPlanModel() {
    }

    public LearningPlanModel(String id, String title, List<Step> steps, String postOwnerID, String postOwnerName, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.steps = steps;
        this.postOwnerID = postOwnerID;
        this.postOwnerName = postOwnerName;
        this.createdAt = createdAt;
    }

    // Static Step class
    public static class Step {
        private String heading;
        private String description;

        public Step() {
        }

        public Step(String heading, String description) {
            this.heading = heading;
            this.description = description;
        }

        // Getters and setters
        public String getHeading() {
            return heading;
        }

        public void setHeading(String heading) {
            this.heading = heading;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    // Getters and setters for main class
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<Step> getSteps() {
        return steps;
    }

    public void setSteps(List<Step> steps) {
        this.steps = steps;
    }

    public String getPostOwnerID() {
        return postOwnerID;
    }

    public void setPostOwnerID(String postOwnerID) {
        this.postOwnerID = postOwnerID;
    }

    public String getPostOwnerName() {
        return postOwnerName;
    }

    public void setPostOwnerName(String postOwnerName) {
        this.postOwnerName = postOwnerName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}