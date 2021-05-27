import '../css/App.css';
import styles from '../css/AccountManagement.module.css';

import React from 'react';
import { Link, Redirect } from "react-router-dom";
import { Auth } from 'aws-amplify';


class AccountSettings extends React.Component {
  render() {
    return (
      <>
        <nav>
          <ul>
            <li><a href="" onClick={(e) => (e.preventDefault(), Auth.signOut())}>sign out</a></li>
            <li><Link to="/">back</Link></li>
          </ul>
        </nav>
        <body>
          {/* TODO: clean up the CSS, names, etc. Small changes break this. */}
          <div className={"app " + styles.accountManagement}>
            <h1>Settings</h1>
            <PasswordForm />
            <EmailForm />
            <DeleteAccountButton history={this.props.history} />
          </div>
        </body>
      </>
    );
  }
}

class DeleteAccountButton extends React.Component {
  constructor(props) {
    super(props);
    this.deleteAccount = this.deleteAccount.bind(this);
  }

  deleteAccount(event) {
    event.preventDefault();
    if (window.confirm('You are about to delete your account. If you choose to do so, none of your data will be recoverable. Are you sure you wish to continue?'))
      Auth.currentAuthenticatedUser({
        bypassCache: true  
      }).then((user) => {
        user.deleteUser((error, data) => {
          if (error) {
            throw error;
          }
          Auth.signOut({ global: true });
        });
      }).catch(err => console.log(err));
  }

  render() {
    return (
      <>
        <h5>Delete Account</h5>
        <form onSubmit={this.deleteAccount}>
          <br />
          <input style={{ backgroundColor: "red" }} type="submit" value="Delete" />
          <br /><br />
        </form>
      </>
    );
  }

}


class PasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { notif: "" };
    this.changePassword = this.changePassword.bind(this);
  }

  changePassword(event) {
    let currentPassword = this.state.currentPassword;
    let newPassword = this.state.newPassword;
    Auth.currentAuthenticatedUser()
      .then(user => {
        return Auth.changePassword(user, currentPassword, newPassword);
      })
      .then(data => this.setState({ notif: data }))
      .catch(err => this.setState({ notif: err.message }));
    this.setState({ currentPassword: '', newPassword: '' });
    event.preventDefault();
  }
  render() {
    return (
      <>
        <h5>Change Password</h5>
        <form onSubmit={this.changePassword}>
          <label for="currentPassword">current password</label> <br />
          <input id="currentPassword" type="password" value={this.state.currentPassword} onChange={(e) => this.setState({ currentPassword: e.target.value })} />
          <br />
          <label for="newPassword">new password</label><br />
          <input id="newPassword" type="password" value={this.state.newPassword} onChange={(e) => this.setState({ newPassword: e.target.value })} />
          <br />
          <input type="submit" value="Submit" />
          <p>{this.state.notif}</p>
        </form>
      </>
    )

  }
}

class EmailForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { waitingOnVerify: false };
    this.changeEmail = this.changeEmail.bind(this);
    this.verify = this.verify.bind(this);
  }

  async changeEmail(event) {
    event.preventDefault();
    let newEmail = this.state.newEmail;
    try {
      let user = await Auth.currentAuthenticatedUser();
      let result = await Auth.updateUserAttributes(user, {
        'email': newEmail,
      });
      console.log(result);
      this.setState({ newEmail: "", waitingOnVerify: true })
    } catch (err) {
      alert(err);
    }

  }
  async verify(event) {
    event.preventDefault();
    let code = this.state.code;
    try {
      let result = await Auth.verifyCurrentUserAttributeSubmit('email', code);
      console.log(result);
      this.setState({ code: "", waitingOnVerify: false })
    } catch (err) {
      alert(err);
    }

  }

  render() {
    let content;
    if (this.state.waitingOnVerify)
      content =
        <>
          <h5>Change Email</h5>
          <form onSubmit={this.verify}>

            <label for="verificationCode">verification code</label> <br />
            <input id="verificationCode" type="text" value={this.state.code} onChange={(e) => this.setState({ code: e.target.value })} />

            <input type="submit" value="Submit" />
          </form>
        </>
    else
      content =
        <>
          <h5>Change Email</h5>
          <form onSubmit={this.changeEmail}>
            <label for="newEmail">new email</label><br />
            <input id="newEmail" type="text" value={this.state.newEmail} onChange={(e) => this.setState({ newEmail: e.target.value })} /><br />
            <input type="submit" value="Submit" />
            <p>{this.state.notif}</p>
          </form >
        </>
    return content;

  }
}



export default AccountSettings;