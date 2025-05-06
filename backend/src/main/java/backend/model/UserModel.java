package backend.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Document(collection = "user")
public class UserModel {
    @Id
    @GeneratedValue
    private String id;
    private String fullname;
    private String email;
    private String password;
    private String phone;
    private String profilePicture;
    private Set<String> followedUsers = new HashSet<>();

    public UserModel() {
    }

    public UserModel(String id, String fullname, String email, String password, String phone) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.profilePicture = generateAvatarUrl(fullname);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
        // Update avatar when name changes
        this.profilePicture = generateAvatarUrl(fullname);
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getProfilePicture() {
        if (profilePicture == null || profilePicture.isEmpty()) {
            return generateAvatarUrl(fullname != null ? fullname : "User");
        }
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public Set<String> getFollowedUsers() {
        return followedUsers;
    }

    public void setFollowedUsers(Set<String> followedUsers) {
        this.followedUsers = followedUsers;
    }

    private String generateAvatarUrl(String name) {
        String encodedName = name != null ? java.net.URLEncoder.encode(name, java.nio.charset.StandardCharsets.UTF_8) : "User";
        return String.format("https://ui-avatars.com/api/?name=%s&background=2563EB&color=ffffff", encodedName);
    }
}