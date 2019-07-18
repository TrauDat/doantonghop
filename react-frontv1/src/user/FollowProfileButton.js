import React, { Component } from 'react';
import { follow, unfollow } from "./apiUser";

class FollowProfileButton extends Component {
    followClick = () => {
        this.props.onButtonClick(follow);
    };

    unfollowClick = () => {
        this.props.onButtonClick(unfollow);
    };

    render() {
        return (
            <div className="td">
                <div className="m-btn">
                     {/* <i className="far fa-address-card"></i><span>Follow</span> */}
                     {!this.props.following ? (
                    <button
                        onClick={this.followClick}
                        className="far fa-address-card"
                    >
                        Follow
                    </button>
                ) : (
                    <button
                        onClick={this.unfollowClick}
                        className="far fa-address-card"
                    >
                        UnFollow
                    </button>
                )}
                </div>
            </div>
        );
    }
}

export default FollowProfileButton;