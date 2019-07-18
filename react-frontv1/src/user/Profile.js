import React, { Component } from 'react';
import {isAuthenticated} from '../auth';
import {Redirect, Link} from 'react-router-dom';
import {read} from './apiUser';
import DefaultProfile from '../images/avatar.jpg';
import DeleteUser from './DeleteUser';
//import '../profile.css';

class Profile extends Component {

    constructor() {
        super();
        this.state = {
            user: "",
            redirectToSignin: false
        };
    }
   

    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token)
        .then(data => {
            if (data.error) {
                this.setState({ redirectToSignin: true});
            } else {
                this.setState({user: data});
            }
        });
    };
    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId;
        this.init(userId);
    }

    render() {

        const {redirectToSignin, user} = this.state;
        if (redirectToSignin) return <Redirect to="/singin" />

        return (



            // <div>
            //     <div id="profile-banner-image">
            //     <img src="https://imagizer.imageshack.com/img921/9628/VIaL8H.jpg" alt="Banner image"/>
            //     </div>
            //     <div id="profile-d">
            //     <div id="profile-pic">
            //     <img
            //                  style={{ height: "200px", width: "auto" }}
            //                     className="img-thumbnail"
            //                     src={`http://localhost:8080/api/signup/user/photo/${
            //                        user._id
            //                      }`}
            //                     onError={i => (i.target.src = `${DefaultProfile}`)}
            //                      alt={user.name}
            //          />

            //     </div>
            //     <div id="u-name">{user.name}</div>
            //     <div class="tb" id="m-btns">
            //         <div class="td">
            //             <div class="m-btn"><span>Activity log</span></div>
            //         </div>
            //         <div class="td">
            //             <div class="m-btn"><span>Privacy</span></div>
            //         </div>
            //     </div>
            //     <div id="edit-profile"></div>
            //     <div id="black-grd"></div>
            // </div>
            // </div>




            <div className="container">
                <div className="row">

                    
                    <div className="col-md-6">
                    
                            <p>profile</p>
                            <img
                                style={{ height: "200px", width: "auto" }}
                                className="img-thumbnail"
                                src={`${process.env.REACT_APP_API_URL}/user/photo/${
                                    user._id
                                }`}
                                onError={i => (i.target.src = `${DefaultProfile}`)}
                                alt={user.name}
                            />
                            <div className="lead mt-5 ml-5">
                                <p>Hello {user.name}</p>
                                <p>Email: {user.email}</p>
                                <p>{`Joined ${new Date(
                                    user.created
                                ).toDateString()}`}</p> 
                            </div>
                    </div>

                    <div className="col-md-6">
                    
                    {isAuthenticated().user && isAuthenticated().user._id === user._id && (
                        <div className="d-inline-block mt-5">
                            <Link className="btn btn-raised btn-success mr-5"
                                to={`/user/edit/${user._id}`}
                            >
                                Edit Profile
                            </Link>
                            <DeleteUser />
                        </div>
                        )}
    
                    </div>
                </div>
            </div>
            
            
        );
    }
}

export default Profile;