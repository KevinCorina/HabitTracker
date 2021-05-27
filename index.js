import './css/App.css';
import { BrowserRouter } from 'react-router-dom'
import React from 'react';
import ReactDOM from 'react-dom';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignIn } from '@aws-amplify/ui-react';
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
import { Route, Switch } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AccountSettings from './pages/AccountManagement'

Amplify.configure(awsExports);

ReactDOM.render(
  <React.StrictMode>
    <AmplifyAuthenticator>
      <AmplifySignUp
        slot="sign-up"
        usernameAlias="email"
        formFields={[
          {
            type: "email",
            label: "Email address *",
            placeholder: "Enter your email address",
            required: true,
          },
          {
            type: "password",
            label: "Password *",
            placeholder: "Enter your password",
            required: true,
          },

        ]}
      />
      <AmplifySignIn slot="sign-in" usernameAlias="email" />
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/:id' component={AccountSettings} />
        </Switch>
      </BrowserRouter>
    </AmplifyAuthenticator>
  </React.StrictMode>,
  document.getElementById('root')
);
