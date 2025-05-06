import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router";
import { useNavigate } from "react-router-dom";
import AddLeariningPlan from "./Pages/LearningPlan/AddLeariningPlan";
import AllLearningPlan from "./Pages/LearningPlan/AllLearningPlan";
import UserLogin from "./Pages/UserManagement/UserLogin";
import UserRegister from "./Pages/UserManagement/UserRegister";
import UpdateUserProfile from "./Pages/UserManagement/UpdateUserProfile";
import AddLearningProgress from "./Pages/LearningProgress/AddLearningProgress";
import AllLearningProgress from "./Pages/LearningProgress/AllLearningProgress";
import UpdateLearningProgress from "./Pages/LearningProgress/UpdateLearningProgress";
import AddNewPost from "./Pages/PostManagement/AddNewPost";
import AllPost from "./Pages/PostManagement/AllPost";
import UpdatePost from "./Pages/PostManagement/UpdatePost";
import UserProfile from "./Pages/UserManagement/UserProfile";
import MyLearningProgress from "./Pages/LearningProgress/MyLearningProgress";
import MyLearningPlan from "./Pages/LearningPlan/MyLearningPlan";
import UpdateLearnPlan from "./Pages/LearningPlan/UpdateLearnPlan";
import MyPost from "./Pages/PostManagement/MyPost";
import Trending from "./Pages/PostManagement/Trending";

function ProtectedRoute({ children }) {
  const userID = localStorage.getItem("userID");
  if (!userID) {
    return <Navigate to="/" />;
  }
  return children;
}

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/oauth2/success") {
      const params = new URLSearchParams(window.location.search);
      const userID = params.get("userID");
      const name = params.get("name");

      if (userID && name) {
        localStorage.setItem("userID", userID);
        localStorage.setItem("userType", "google");
        navigate("/allPost");
      } else {
        alert("Login failed. Missing user information.");
      }
    }
  }, [navigate]);

  return (
    <div>
      <React.Fragment>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />

          {/* Protected Routes */}
          <Route
            path="/addLeariningPlan"
            element={
              <ProtectedRoute>
                <AddLeariningPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allLearningPlan"
            element={
              <ProtectedRoute>
                <AllLearningPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/MylearningProgress"
            element={
              <ProtectedRoute>
                <MyLearningProgress />
              </ProtectedRoute>
            }
          />

          <Route
            path="/updateLearnPlan/:id"
            element={
              <ProtectedRoute>
                <UpdateLearnPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userProfile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trending"
            element={
              <ProtectedRoute>
                <Trending />
              </ProtectedRoute>
            }
          />
          <Route
            path="/updateUserProfile/:id"
            element={
              <ProtectedRoute>
                <UpdateUserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addLearningProgress"
            element={
              <ProtectedRoute>
                <AddLearningProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allLearningProgress"
            element={
              <ProtectedRoute>
                <AllLearningProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myLearningPlan"
            element={
              <ProtectedRoute>
                <MyLearningPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/updateLearningProgress/:id"
            element={
              <ProtectedRoute>
                <UpdateLearningProgress />
              </ProtectedRoute>
            }
          />

          <Route
            path="/addNewPost"
            element={
              <ProtectedRoute>
                <AddNewPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allPost"
            element={
              <ProtectedRoute>
                <AllPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myPosts"
            element={
              <ProtectedRoute>
                <MyPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/updatePost/:id"
            element={
              <ProtectedRoute>
                <UpdatePost />
              </ProtectedRoute>
            }
          />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
