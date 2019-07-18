import React, { Component } from 'react';
import { search } from './apiUser';
import { Link } from "react-router-dom";
import DefaultProfile from '../img/my_avatar.png';

class Search extends Component {

    constructor() {
        super();
        this.state = {
            users: []
        };
    }

    componentDidMount() {
        search().then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({users: data})
            }
        })
    }

    handleChange = (name) => event => {
        this.setState({error: ""})
        this.setState({ [name]: event.target.value });
    };
     
    clickSubmit = event => {
        event.preventDefault();
        search().then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({users: data})
            }
        })
    };

    clickSubmitAddFriend

    renderUsers = (users) => (
        <div className="row">
                    {
                        users.map((user,i) => (
                            <div className="card col-md-4" key={i}>
                             <img
                                style={{ height: "200px", width: "auto" }}
                                className="img-thumbnail"
                                src={`http://localhost:8080/api/user/photo/${
                                    user._id
                                }`}
                                onError={i => (i.target.src = `${DefaultProfile}`)}
                                alt={user.name}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{user.name}</h5>
                                <p className="card-text">{user.email}</p>
                                <Link
                                    to={`/user/${user._id}`}
                                    className="btn btn-raised btn-primary"
                                >
                                    View Profile
                                </Link>

                                <button
                                onClick={this.clickSubmitAddFriend}
                                style={{marginLeft: "100px"}}
                                className="btn btn-raised btn-primary"
                                >
                                    Add friend
                                </button>
                                
                            </div>
                        </div>
                        ))
                    }
                </div>
    );

    
    searchForm = (username) => (
        <>
        <h2>Search Friends</h2>
                <form>
                <input type="text" name="username" 
                     value={username} onChange={this.handleChange("username")} placeholder="username"/>
                    <button
                        onClick={this.clickSubmit}
                        className="btn btn-raised btn-primary"
                     >
                         Search
                      </button>
                </form>
                <hr />
        </>
    )

    render() {
        const {username, users} = this.state;
        return (
            <div>
                
                {this.searchForm(username)}
               
                {/* <div className="usercard col-lg-3">
                    <img className="usercard-image" src="upload/{{this.userImage}}" />
                    <h4 className="usercard-name"></h4>
                    <p className="usercard-username"></p>
                    <form action="" method="get" className="add_friend">
                        <input type="hidden" name="receiverName" className="receiverName" 
                        value="{{this.username}}" />
                        <input type="hidden" name="sender-name" className="sender-name" 
                        value="{{user.username}}" />
                        <button type="submit" id="" onclick="addFriend('{{this.username}}')" 
                        className="btn add accept friend-add"><i class="fa fa-user"></i>
                         Add Friend</button>
                    </form>
                </div> */}
                {this.renderUsers(users)}
              
                    
                
            </div>
        );
    }
}

export default Search;