import "../sign_up/Sign_up.css";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import AccountService from "../../api/AccountService";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUserName] = useState("");
  const [usernameError, setUserNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rePassword, setRePassword] = useState("");
  const [rePasswordError, setRePasswordError] = useState("");
  const [checkPass, setCheckPass] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [address, setAddress] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isOpenRegister, setIsOpenRegister] = useState(true);
  const navigate = useNavigate();

  const [account, setAccount] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    description: "",
  });

  const closeRegister = () => {
    setIsOpenRegister(false);
    navigate("/");
  };

  if (!isOpenRegister) return null;

  // Receive full name
  const NameChange = (e) => {
    const { value } = e.target;
    const filteredValue = value.replace(/[^a-zA-Z0-9]/g, "");
    setUserName(filteredValue);
    setAccount((preState) => ({ ...preState, username: filteredValue }));
    setUserNameError("");
  };

  // Check full name
  const NameBlur = () => {
    if (username.trim() === "") {
      setUserNameError("Please enter your full name");
    } else if (username.length < 4) {
      setUserNameError("The full name must be at least 4 characters");
    } else if (username.length > 100) {
      setUserNameError("The full name must be less than 100 characters");
    } else {
      setUserNameError("");
    }
  };

  // Receives email
  const EmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    setAccount((preState) => ({ ...preState, email: value }));
    setEmailError("");
  };

  // Check email
  const ValidEmail = (e) => {
    const emailRegex = /@.*$/;
    return emailRegex.test(e);
  };

  // Check email
  const EmailBlur = () => {
    if (email.trim() === "") {
      setEmailError("Please enter your email");
    } else if (!ValidEmail(email.trim())) {
      setEmailError("Email must contain @ and .com");
    } else if (email.length < 6) {
      setEmailError("Email must be at least 6 characters long");
    } else if (email.length > 100) {
      setEmailError("Email must be less than 100 characters long");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please retype your email");
    } else if (/@[^\w@]+\w/.test(email)) {
      setEmailError("Please retype your email");
    } else if (!/^[^\s@]+@[^\d@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Numbers are not allowed after @.");
    } else {
      setEmailError("");
    }
  };

  // Receive phone number
  const PhoneChange = (e) => {
    const { value } = e.target;
    setPhone(value);
    setAccount((preState) => ({ ...preState, phone: value }));
    setPhoneError("");
  };

  // Check phone number
  const PhoneBlur = () => {
    if (phone.trim() === "") {
      setPhoneError("Please enter your phone number");
    } else if (phone.length < 10 || phone.length > 10) {
      setPhoneError("Your phone number must be 10 digits");
    } else if (!/^\d+$/.test(phone)) {
      setPhoneError("Your phone number just only number");
    } else if (!/^0/.test(phone)) {
      setPhoneError("Phone number must start with 0");
    } else {
      setPhoneError("");
    }
  };

  // Receive address
  const AddressChange = (e) => {
    const { value } = e.target;
    setAddress(value);
    setAccount((preState) => ({ ...preState, address: value }));
  };

  // Receive password
  const PasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
    setAccount((preState) => ({ ...preState, password: value }));
    setPasswordError("");
  };

  // Check password
  const PasswordBlur = () => {
    const enteredPassword = password.trim();
    if (enteredPassword === "") {
      setPasswordError("Please enter your password");
    } else if (enteredPassword.length < 6) {
      setPasswordError("Password must be longer than 6 characters");
    } else if (enteredPassword.length > 30) {
      setPasswordError("Password must be shorter than 30 characters");
    } else {
      setPasswordError("");
    }
  };

  // Show and hidden password
  const PasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Receive re-password
  const ConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setRePassword(value);
    if (value === "") {
      setPasswordError("");
      setCheckPass(false);
    } else if (value !== password) {
      setPasswordError("");
      setCheckPass(true);
    } else {
      setPasswordError("");
      setCheckPass(false);
    }
    setRePasswordError("");
  };

  // Check re-password
  const RePasswordBlur = () => {
    const enteredRePassword = rePassword.trim();
    if (enteredRePassword === "") {
      setRePasswordError("Please enter your password");
    } else if (enteredRePassword.length < 6 || enteredRePassword.length > 30) {
      setRePasswordError("Password must be between 6 and 30 characters");
    } else {
      setRePasswordError("");
    }
  };

  // Show and hidden re-password
  const RePasswordVisibility = () => {
    setShowRePassword(!showRePassword);
  };

  // Submit
  const validateForm = async () => {
    NameBlur();
    EmailBlur();
    PhoneBlur();
    PasswordBlur();
    RePasswordBlur();

    if (!agreedToTerms) {
      alert(
        "To continue registration, you need to agree to our Terms of Use and Privacy Policy."
      );
      return;
    }
    if (
      !usernameError &&
      !emailError &&
      !phoneError &&
      !passwordError &&
      !rePasswordError &&
      username &&
      email &&
      phone &&
      password &&
      rePassword &&
      !checkPass
    ) {
      try {
        await AccountService.register(account);
        setFormSubmitted(true);
        setRegisterError("");
        setTimeout(() => {
          closeRegister();
          setFormSubmitted(false);
        }, 1000);
      } catch (error) {
        if (error.response) {
          const errorMessage = error.response.data?.message;
          if (errorMessage) {
            if (
              errorMessage.includes(
                "duplicate key value violates unique constraint"
              )
            ) {
              if (errorMessage.includes("phone")) {
                setPhoneError("Phone number already exists.");
              } else if (errorMessage.includes("email")) {
                setEmailError("Email already exists.");
              } else if (errorMessage.includes("username")) {
                setUserNameError("Username already exists.");
              }
            }
          } else {
            setRegisterError("An error occurred during registration.");
          }
        } else {
          setRegisterError("Network error occurred, please try again.");
        }
        setFormSubmitted(false);
      }
    } else {
      alert("Please fill in all fields correctly before submitting.");
    }
  };

  const handleClose = (e) => {
    closeRegister();
  };

  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  const handleAgreementChange = (e) => {
    setAgreedToTerms(e.target.checked);
  };

  return (
    <div className="sign-up" onClick={handleClose}>
      <form className="sign-up-container" onClick={handleContainerClick}>
        <div className="sign-up-title">
          <h2>Register</h2>
          <div className="icon-closeicon-close">
            <IoClose onClick={closeRegister} />
          </div>
        </div>

        {/* Input full name */}
        <div className="sign-up-input">
          <div className="sign-up-input">
            <div className="sign-up-username">
              <label htmlFor="username">
                Username <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="name"
                id="username"
                name="username"
                placeholder="Please enter a username without spaces."
                value={username}
                onChange={NameChange}
                onBlur={NameBlur}
                required
              />
              {usernameError && <p style={{ color: "red" }}>{usernameError}</p>}
            </div>
          </div>

          {/* Input email */}
          <div className="sign-up-email">
            <label htmlFor="username">
              Email <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={EmailChange}
              onBlur={EmailBlur}
              required
            />
            {emailError && <p style={{ color: "red" }}>{emailError}</p>}
          </div>

          {/* Input phone number */}
          <div className="phone-number">
            <label htmlFor="username">
              Phone number <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="number"
              name="phone"
              value={phone}
              onChange={PhoneChange}
              onBlur={PhoneBlur}
              required
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[eE.+-]/g, "");
              }}
            />
            {phoneError && <p style={{ color: "red" }}>{phoneError}</p>}
          </div>

          {/* Input password */}
          <div className="password">
            <div className="sign-up-password">
              <label htmlFor="username">
                Password <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={PasswordChange}
                onBlur={PasswordBlur}
                required
              />
              <FontAwesomeIcon
                className="sign-up_ic_eye"
                icon={showPassword ? faEyeSlash : faEye}
                onClick={PasswordVisibility}
              />
            </div>
            {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
          </div>

          {/* Input re-password */}
          <div className="re-password">
            <div className="sign-up-password">
              <label htmlFor="username">
                Confirm password <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type={showRePassword ? "text" : "password"}
                name="rePassword"
                value={rePassword}
                onChange={ConfirmPasswordChange}
                onBlur={RePasswordBlur}
                required
              />
              <FontAwesomeIcon
                className="sign-up_ic_eye"
                icon={showRePassword ? faEyeSlash : faEye}
                onClick={RePasswordVisibility}
              />
            </div>
            {checkPass && (
              <p style={{ color: "red" }}>Your password not match</p>
            )}

            {rePasswordError && (
              <p style={{ color: "red" }}>{rePasswordError}</p>
            )}
          </div>

          {/* Input address */}
          <div className="address">
            <label htmlFor="username">Address</label>
            <input
              type="text"
              name="address"
              value={address}
              onChange={AddressChange}
            />
          </div>
        </div>

        <div className="sign-up-condition">
          <input type="checkbox" onChange={handleAgreementChange} />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
        <div className="part-end-sign-up">
          <p>
            Have a new account ?{" "}
            <span>
              <Link to="/sign_in">Login here</Link>
            </span>
          </p>
        </div>

        <div className="info-register">
          {formSubmitted && !registerError && (
            <p style={{ color: "green" }}>Register successful</p>
          )}
          <button type="button" onClick={validateForm}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
};
export default Register;
