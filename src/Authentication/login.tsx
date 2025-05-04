import React, { useEffect, useState } from "react";
import { useAuth } from "../authentication/auth";
import { Formik } from "formik";
import { loginSchema } from "../validationSchema";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
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
  const [sdkLoaded, setSdkLoaded] = useState(false);

  const initialValues: LoginFormValues = {
    email: "manu1@gmail.com",
    password: "m@nu!123",
  };

  const handleFormLogin = async (values: LoginFormValues) => {
    const success = await login(values);
    setMessage(success ? "Logged in!" : "Login failed.");
  };

  useEffect(() => {
    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.onload = () => {
        window.FB.init({
          appId: "1458781238865329",
          cookie: true,
          xfbml: true,
          version: "v18.0",
        });
        setSdkLoaded(true);
      };
      document.body.appendChild(script);
    }
    return () => {
      const script = document.getElementById("facebook-jssdk");
      if (script) script.remove();
    };
  }, []);

  const handleFBLogin = () => {
    if (!sdkLoaded) {
      // toast.error("Facebook SDK not loaded yet.");
      setMessage("Login Failed")
      return;
    }

    window.FB.login(
      function (response: any) {
        if (response.authResponse) {
          window.FB.api("/me", { fields: "name,email" }, function (userInfo: any) {
            if (!userInfo || !userInfo.email) {
              // toast.error("Could not retrieve Facebook user email.");
              setMessage("Login Failed")
              return;
            }

            const userData = {
              email: userInfo.email,
              UserName: userInfo.name,
            };

            setUser(userData);

            try {
              const passphrase = "manumanu!!!!22222222jjjjjj";
              const encryptedData = CryptoJS.AES.encrypt(
                JSON.stringify(userData),
                passphrase
              ).toString();
              localStorage.setItem("user", encryptedData);
              toast.success("User login successfully");
            } catch (error) {
              toast.error("Error saving Facebook login data.");
            }
          });
        } else {
          // toast.error("Facebook login failed or cancelled.");
          setMessage("Login Failed")
        }
      },
      { scope: "email" }
    );
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
                    const decoded: any = jwtDecode(credentialResponse.credential);
                    const userData = {
                      email: decoded.email,
                      UserName: decoded.name,
                    };
                    setUser(userData);

                    const passphrase = "manumanu!!!!22222222jjjjjj";
                    const encryptedData = CryptoJS.AES.encrypt(
                      JSON.stringify(userData),
                      passphrase
                    ).toString();
                    localStorage.setItem("user", encryptedData);
                    toast.success("User login successfully");
                  }
                }}
                onError={() => {
                  setMessage("Google login failed.");
                }}
              />
            </div>

            {/* Facebook Login */}
            <div className="mt-3">
              <button
                type="button"
                onClick={handleFBLogin}
                className="btn btn-outline-primary w-100"
              >
                <i className="fa fa-facebook me-2"></i> Login with Facebook
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
