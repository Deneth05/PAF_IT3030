import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
  Card,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import "./Login.css"; // Custom CSS for additional styling

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8081/api/auth/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true // For httpOnly cookies if using them
        }
      );

      // Handle response based on your API structure
      // const { token, user } = response.data;

      // Store token securely
      // localStorage.setItem("token", token);
      // localStorage.setItem("user", JSON.stringify(user));

      // // Redirect to dashboard or home page
      // navigate("/profile");

      const token = response.data; // plain string
      localStorage.setItem("token", token);
      navigate("/profile");


    } catch (err) {
      setLoading(false);
      if (err.response) {
        // The request was made and the server responded with a status code
        switch (err.response.status) {
          case 401:
            setError("Invalid email or password");
            break;
          case 403:
            setError("Account not verified. Please check your email.");
            break;
          case 429:
            setError("Too many attempts. Please try again later.");
            break;
          default:
            setError("Login failed. Please try again.");
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("Network error. Please check your connection.");
      } else {
        // Something happened in setting up the request
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container className="login-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={8} lg={6} xl={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">
                  Sign In
                </h2>
                <p className="text-muted">
                  Enter your credentials to access your account
                </p>
              </div>

              {error && (
                <Alert variant="danger" className="text-center">
                  {error}
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text>
                      <FaEnvelope />
                    </InputGroup.Text>
                    <FormControl
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid email address.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text>
                      <FaLock />
                    </InputGroup.Text>
                    <FormControl
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      Password must be at least 8 characters.
                    </Form.Control.Feedback>
                  </InputGroup>
                  <div className="text-end mt-2">
                    <a href="/forgot-password" className="text-decoration-none">
                      Forgot password?
                    </a>
                  </div>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                    </>
                  )}
                </Button>

                <div className="text-center mt-3">
                  <p className="text-muted">
                    Don't have an account?{" "}
                    <a href="/register" className="text-decoration-none">
                      Sign up
                    </a>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;