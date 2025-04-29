import React, { useState } from "react";
import { useAuth } from "../authentication/auth";
import { Formik } from "formik";
import { loginSchema } from "../validationSchema";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import FacebookLogin from "react-facebook-login";
const CryptoJS = require("crypto-js");

interface LoginFormValues {
  email: string;
  password: string;
}

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

const Login: React.FC = () => {
  const { login, setUser } = useAuth();
  const [message, setMessage] = useState<string>("");

  const initialValues: LoginFormValues = {
    email: "manu1@gmail.com",
    password: "m@nu!123",
  };

  const handleFormLogin = async (values: LoginFormValues) => {
    const success = await login(values);
    setMessage(success ? "Logged in!" : "Login failed.");
  };

  const responseFacebook = (response: any) => {
    if (!response || !response.email || !response.name) {
      // toast.error("Facebook login failed or incomplete data.");
      setMessage("Login failed.")
      return;
    }

    const user = {
      email: response.email,
      UserName: response.name,
    };

    setUser(user);

    // Encrypt the user data
    const passphrase = "manumanu!!!!22222222jjjjjj";
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(user), passphrase).toString();

    // Store encrypted data in localStorage
    localStorage.setItem("user", encryptedData);

    toast.success("Facebook login successful!");
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "500px" }}>
      <h2>Login</h2>
      {message && <div className="alert alert-info mt-2">{message}</div>}

      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={handleFormLogin}
      >
        {({ getFieldProps, handleSubmit, errors, touched }) => (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                {...getFieldProps("email")}
              />
              {touched.email && errors.email && (
                <div className="text-danger">{errors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                {...getFieldProps("password")}
              />
              {touched.password && errors.password && (
                <div className="text-danger">{errors.password}</div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>

            {/* Google Login */}
            <div className="mt-4">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    // Decode the JWT token and extract user data
                    const decoded: any = jwtDecode(credentialResponse.credential);
                    const userData = {
                      email: decoded.email,
                      UserName: decoded.name,
                    };
                    setUser(userData);
                    // Encrypt the user data
                    const passphrase = "manumanu!!!!22222222jjjjjj";
                    const encryptedData = CryptoJS.AES.encrypt( JSON.stringify(userData),passphrase).toString();

                    // Store encrypted data in localStorage
                    localStorage.setItem("user", encryptedData);

                    toast.success("Google login successful!");
                  }
                }}
                onError={() => {
                  setMessage("Google login failed.");
                }}
              />

              {/* Facebook Login */}
              <div className="mt-3 d-flex flex-column gap-2">
                <FacebookLogin
                  appId="1458781238865329"
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={responseFacebook}
                  icon="fa-facebook"
                  cssClass="btn btn-outline-primary w-100 parent_div"
                />
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
