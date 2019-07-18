import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { isAuthenticated, signout } from '../auth';
import { remove } from './apiUser';


class DeleteUser extends Component {

    state = {
        redirect: false
    };

    deleteAccount = () => {
        const token = isAuthenticated().token;
        const userId = this.props.userId;
        remove(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                signout(() => console.log("Tài khoản của bạn đã được xóa thành công!"));
                this.setState({ redirect: true });
            }
        });
    };

    deleteConfirmed = () => {
        let answer = window.confirm(
            "Are you sure you want to delete your account?"
        );
        if (answer) {
            this.deleteAccount();
        }
    };

    render() {
        return (
            <div className="td">
                <button className="m-btn" onClick={this.deleteConfirmed}>
                <i className="fas fa-lock"></i><span>Delete Account</span>
                </button>
            </div>
        );
    }
}

export default DeleteUser;