package com.example.backend.entity;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "learning_plans")
public class LearningPlan {
    @Id
    private String id;
    private String title;
    private List<Step> steps;

    // getters and setters

    public static class Step {
        private String heading;
        private String description;
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

        // getters and setters
        
    }

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
}
