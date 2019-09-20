import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";

import Login from "./components/auth/Login";
import "./App.css";
import Alert from "./components/layout/Alert";
import setAuthToken from './utils/setAuthToken'
import PrivateRoute from '../src/components/routing/PrivateRoute'
import CreateProfile from '../src/components/profile-forms/CreateProfile'
import EditProfile from '../src/components/profile-forms/EditProfile'
import AddExperience from '../src/components/profile-forms/AddExperience'
import AddEducation from '../src/components/profile-forms/AddEducation'

//Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from './actions/auth'

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <PrivateRoute exact path='/create-profile' component={CreateProfile} />
              <PrivateRoute exact path='/edit-profile' component={EditProfile} />
              <PrivateRoute exact path='/add-experience' component={AddExperience} />
              <PrivateRoute exact path='/add-education' component={AddEducation} />
              <PrivateRoute Route exact path='/dashboard' component={Dashboard} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  )
};

export default App;
