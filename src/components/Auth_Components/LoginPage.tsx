import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { loginSuccess } from "../../redux/slices/authReducer";
import { loginUser, registerUser } from "../../apiServices/authService";
import { useToastApi } from "../../custom_hooks/ToastProvider";
import "./loginPage.scss";

const { Link, Text } = Typography;

const LoginPage: React.FC = () => {
  const [isRegisterState, setIsRegisterState] = useState<boolean>(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useToastApi();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true }); // ⬅️ Redirects to home after login
    }
  }, [isAuthenticated, navigate]);

  interface LoginResponse {
    user_id: string;
    email: string;
    user_name: string;
    profile_name: string;
    // add other properties if needed
  }

  const onFinish = async (values: any) => {
    // console.log("Success:", values);
    try {
      // Register user
      if (isRegisterState) {
        await registerUser(values);
        toast.success({content: "Signed up successfully! Please log in now."});
        setIsRegisterState(false);
        form.resetFields();
        return;
      }
      // Login user
      const response: any = await loginUser(values);
      // console.log(response);
      const userData = {
        user_id: response?.user_id,
        email: response?.email,
        user_name: response?.user_name,
        profile_name: response?.profile_name,
      };
      dispatch(
        loginSuccess({ user: userData, accessToken: response?.accessToken })
      );
      toast.success({content: "Logged in successfully!"});
    } catch (err) {
      // Handle error
      toast.error({content: "Authentication failed. Please check your credentials."});
      console.error(err);
    }
  };

  const AuthFormHeader = isRegisterState ? "Sign Up" : "Login";
  const toggleMode = () => {
    setIsRegisterState((prev) => !prev);
    form.resetFields();
  };

  return (
    <div className="login-page-container">
      <Card>
        <h1>{AuthFormHeader}</h1>
        <Form
          form={form}
          name="loginForm"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          {isRegisterState && (
            <Form.Item
              label="Profile Name"
              name="profile_name"
              rules={[
                { required: true, message: "Please enter your profile name!" },
                {
                  pattern: /^[a-zA-Z0-9!&\-_]+$/,
                  message:
                    "Profile name can only contain alphanumeric characters and these special characters: !, &, -, _",
                },
              ]}
            >
              <Input placeholder="Enter profile name" />
            </Form.Item>
          )}

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject("Please enter your password!");
                  }
                  // Regex to check password criteria
                  const passwordRegex =
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,12}$/;
                  if (!passwordRegex.test(value)) {
                    return Promise.reject(
                      "Password must be 8-12 characters and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-btn">
              {AuthFormHeader}
            </Button>
          </Form.Item>
        </Form>
        <div className="form-links">
          {/* <Text>
            Forgot <Link>Username</Link> / <Link>Password?</Link>
          </Text>
          <br /> */}
          <Text>
            {!isRegisterState ? (
              <>
                Don't have an account? <Link onClick={toggleMode}>Sign up</Link>
              </>
            ) : (
              <>
                Already have an account? <Link onClick={toggleMode}>Login</Link>
              </>
            )}
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
