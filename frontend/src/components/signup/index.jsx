
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './styles.module.css';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';



export default function Signup() {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    birthdate: "",
    gender: ""
  });

  const [error, setError] = useState();
  
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input}) => {
    setData({
      ...data,
      [input.name]: input.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(data.password !== document.getElementById('confirmPassword').value) {
        setError("Passwords do not match");
        document.getElementById('confirmPassword').style["border-bottom"] = "2px solid red";
        document.getElementById('password').style["border-bottom"] = "2px solid red";
        return;
      }
      const url = "http://localhost:3001/Auth/signup";
      const { data: res } = await axios.post(url, data);
      navigate("/login");
      console.log(res.message);
    } catch (error) {
      if(error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };


  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.left}>
          <h1>Welcome Back</h1>
          <hr />
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque nam cumque commodi? In, non fuga perferendis aliquam sit autem delectus ab ut facere, asperiores magni incidunt accusantium. Fugiat, tempore recusandae!</p>
          <Link to="/login">
            <button type="button" className={styles.white_btn}>Sign in</button>
          </Link>
        </div>
        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Create an Account</h1>
            <div className={styles.input_container}>
              <input type="text" id='firstName' name="firstName" value={data.firstName} onChange={handleChange} className={styles.input} required/>
              <label htmlFor="firstName">First Name</label>
            </div>
            <div className={styles.input_container}>
              <input type="text" id='lastName' name="lastName" value={data.lastName} onChange={handleChange} className={styles.input} required/>
              <label htmlFor="lastName">Last Name</label>
            </div>
            <div className={styles.input_container}>
              <input type="text" id='username' name="username" value={data.username} onChange={handleChange} className={styles.input} required/>
              <label htmlFor="username">Username</label>
            </div>
            <div className={styles.input_container}>
              <input type="email" id='email' name="email" value={data.email} onChange={handleChange} className={styles.input} required/>
              <label htmlFor="email">Email</label>
            </div>
            <div className={styles.input_container}>
              <input type="password" id='password' name="password" value={data.password} onChange={handleChange} className={styles.input} required/>
              <label htmlFor="password">Password</label>
            </div>
            <div className={styles.input_container}>
              <input type="password" id='confirmPassword' className={styles.input} required/>
              <label htmlFor="confirmPassword">Confirm password</label>
            </div>
            <input type="date" placeholder="Birthdate" name="birthdate" value={data.birthdate} onChange={handleChange} className={styles.input} required/>
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker value={value} onChange={(newValue) => setValue(newValue)} />
              </DemoContainer>
            </LocalizationProvider> */}

            <div className={styles.gender}>
                <label htmlFor="male"><input id="male" name="gender" type="radio" value="male" onChange={handleChange} /> Male</label>
                <label htmlFor="female"><input id="female" name="gender" type="radio" value="female" onChange={handleChange} /> Female</label>
                <label htmlFor="non-binary"><input id="other" name="gender" type="radio" value="non-binary" onChange={handleChange} /> Non-binary</label>
            </div>
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type='submit' className={styles.green_btn}>Sign up</button>
          </form>
        </div>
      </div>
    </div>
  )
};
