package backend.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "LearningProgress")
public class LearningProgressModel {
    @Id
    @GeneratedValue
    private String id;
    private String postOwnerID;
    private String postOwnerName;
    private String title;
    private String description;
    private String template;
    private String date = LocalDate.now().toString(); 

    public LearningProgressModel() {

    }

    public LearningProgressModel(String id, String postOwnerID, String postOwnerName, String title, String description, String template, String date) {
        this.id = id;
        this.postOwnerID = postOwnerID;
        this.postOwnerName = postOwnerName;
        this.title = title;
        this.description = description;
        this.template = template;
        this.date = date;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
