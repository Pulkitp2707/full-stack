import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import PropTypes from 'prop-types'
import { register } from '../../actions/auth'

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });

  const { name, email, password, password2 } = formData;

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value //it updates the variable 'name' and also updates the formdata
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (password != password2) {
      setAlert("Passwords do not match", "danger");
    } else {
      register({
        name, email, password
      });
    }
  };

  // Redirect if user is registered in
  if (isAuthenticated) {
    return <Redirect to='/' />
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Create Your Account
      </p>
      <form className='form' onSubmit={handleSubmit}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            required
            onChange={handleChange}
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            required
            onChange={handleChange}
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            required
            onChange={handleChange}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={handleChange}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  );
};


Register.popTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});


export default connect(
  mapStateToProps,
  { setAlert, register }
)(Register);
