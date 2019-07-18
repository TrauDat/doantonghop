import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { read } from './apiUser';
import "../css/style.css";
import DefaultProfile from '../img/my_avatar.png';
import DefaultBanner from '../img/beach.jpg';
import FollowProfileButton from "./FollowProfileButton";
import { listByUser } from '../post/apiPost';
import DefaultPost from "../img/beach.jpg";
import ProfileTabs from "./ProfileTabs";

class MyProfile extends Component {

    constructor() {
        super();
        this.state = {
            user: { following: [], followers: [] },
            redirectToSignin: false,
            following: false,
            error: "",
            posts: []
        };
    }

    // check follow
    checkFollow = user => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
            // one id has many other ids (followers) and vice versa
            return follower._id === jwt.user._id;
        });
        return match;
    };

    clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        callApi(userId, token, this.state.user._id).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ user: data, following: !this.state.following });
            }
        });
    };

    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token).then(data => {
            if (data.error) {
                this.setState({ redirectToSignin: true });
            } else {
                let following = this.checkFollow(data);
                this.setState({ user: data, following });
                this.loadPosts(data._id);
            }
        });
    };
    loadPosts = userId => {
        const token = isAuthenticated().token;
        listByUser(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data });
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


    renderPosts = posts => {
        return (
            <>
                {posts.map((post, index) => {
                    const posterId = post.postedBy
                        ? `/user/${post.postedBy._id}`
                        : "";
                    const posterName = post.postedBy
                        ? post.postedBy.name
                        : " Unknown";

                    return (
                        <div>
                        <div className="post" key={index}>
                            <div className="tb">
                                <a href="#" className="td p-p-pic">
                             
                                <img 
                                    className="img-thumbnail"
                                    src={`http://localhost:8080/api/user/photo/${post.postedBy._id}`}
                                    alt={post.title} 
                                    onError={i =>
                                        (i.target.src = `${DefaultPost}`)
                                    }
                                
                                /> 
                                </a>
                                <div className="td p-r-hdr">
                                    <div className="p-u-info">
                                    <Link to={`${posterId}`}>
                                        {posterName}{" "}
                                    </Link> shared a memory with
                                     <a href="#">Himalaya Singh</a> 
                                    </div>
                                    <div className="p-dt">
                                    <i className="fas fa-calendar"></i>
                                    {new Date(post.created).toDateString()}
                                    </div>
                                </div>
                                <div className="td p-opt"><i className="fas fa-chevron-down"></i></div>
                            </div>
                            
                            <h5 className="card-title">{post.title}</h5>

                            <Link
                                    to={`/post/${post._id}`}
                                    className="p-cnt-v"
                                >                         
                                        <img 
                                                className="img-thumbnail"
                                                src={`http://localhost:8080/api/post/photo/${post._id}`}
                                                alt={post.title} 
                                                onError={i =>
                                                    (i.target.src = `${DefaultPost}`)
                                                }
                                            
                                        /> 
                                </Link>
                
                        </div>
                        </div>
                    );
                })}
            </>
        )
    }

    render() {

        const {redirectToSignin, user, posts} = this.state;
        if (redirectToSignin) 
            return <Redirect to="/singin" />

        const photoUrl = user._id
            ? `http://localhost:8080/api/user/photo/${
                  user._id
              }?${new Date().getTime()}`
            : DefaultProfile;

        const photoBackgroundUrl = user._id
            ? `http://localhost:8080/api/user/photoBackground/${
                  user._id
              }?${new Date().getTime()}`
            : DefaultBanner;

        // const photoUrl = user._id ? 
        // `${process.env.REACT_APP_API_URL}/api/user/photo/${
        //     user._id
        // }?${new Date().getTime()}` : DefaultProfile;



        return (
            

            <>
                <div className="bodyOfMyProfile">
                <main className="container">
                    <div className="row">
                    <div className="col-md-12">
                        <div id="profile-upper">
                            <div id="profile-banner-image">
                                 <img 
                                    className="img-thumbnail"
                                    src={photoBackgroundUrl} 
                                    onError={i => (i.target.src = `${DefaultBanner}`)}
                                    alt={user.name}
                                     />    
                                
                            </div>
                            <div id="profile-d">
                                <div id="profile-pic">
                                <img 
                                    className="img-thumbnail"   
                                    src={photoUrl} 
                                    onError={i => (i.target.src = `${DefaultProfile}`)}
                                    alt={user.name}
                                     />    
                                </div>
                                <div id="u-name">
                                    {user.name}
                                </div>
                                <div className="tb" id="m-btns">
                                    
                                        {isAuthenticated().user &&
                                            isAuthenticated().user._id === user._id ? (
                                                <Link
                                                    to={`/post/create`}
                                                >
                                                    <div className="td">
                                                        <div className="m-btn">
                                                        <i className="fas fa-list"></i><span>Tạo bài viết</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ) : (
                                                <FollowProfileButton 
                                                    following={this.state.following}
                                                    onButtonClick={this.clickFollowButton}
                                                />
                                            )}

                                   
                                    <div className="td">
                                        <div className="m-btn">
                                        <i className="fas fa-lock"></i><span>Xóa tài khoản</span></div>
                                    </div>
                    
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    </div>
                    <div className="row">

                        <div className="news">

                        
                            <div className="col-lg-3">
                                <div className="panel panel-default">
                                <div className="panel-body">
                                <div className="cnt-label">
                                        <div className="info">
                                            <i className="l-i" id="l-i-i"></i>
                                            <span>Giới thiệu</span>
                                        </div>
                                        
                                        <div className="lb-action">
                                            
                                            {isAuthenticated().user && isAuthenticated().user._id === user._id && (
                                                <>
                                                    <Link to={`/user/edit/${user._id}`}
                                                    >
                                                        <i className="fas fa-pencil-alt"></i>
                                                    </Link>
                                                    
                                                </>
                                            )}

                                            
                                        </div>

                                </div>
                                <div id="i-box">
                                    <div id="intro-line">Tôi là {user.name}</div>
                                    <div id="u-occ">
                                        {user.about}
                                        </div>
                                    <div id="u-loc"><i className="fas fa-map-marker"></i><a href="#">{user.location}</a></div>
                                </div>
                                </div>
                            </div>

                                <div className="l-cnt l-mrg">
                                                <div className="cnt-label">
                                                    <i className="l-i" id="l-i-p"></i>
                                                    <span>Hình ảnh</span>
                                                    <div className="lb-action" id="b-i"><i className="far fa-image"></i></div>
                                                </div>
                                                <div id="photos">
                                                    <div className="tb">
                                                        <div className="tr">
                                                            <div className="td"></div>
                                                            <div className="td"></div>
                                                            <div className="td"></div>
                                                        </div>
                                                        <div className="tr">
                                                            <div className="td"></div>
                                                            <div className="td"></div>
                                                            <div className="td"></div>
                                                        </div>
                                                        <div className="tr">
                                                            <div className="td"></div>
                                                            <div className="td"></div>
                                                            <div className="td"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                            </div>
                            <div className="col-lg-6">
                                
                                <div className="m-mrg" id="composer">
                                                <div id="c-tabs-cvr">
                                                    <div className="tb" id="c-tabs">
                                                        <div className="td active"><i className="fas fa-th"></i><span>Make Post</span></div>
                                                        <div className="td"><i className="fas fa-camera-retro"></i><span>Photo/Video</span></div>
                                                        <div className="td"><i className="fas fa-video"></i><span>Live Video</span></div>
                                                        <div className="td"><i className="far fa-calendar-alt"></i><span>Life Event</span></div>
                                                    </div>
                                                </div>
                                                <div id="c-c-main">
                                                    <div className="tb">
                                                        <div className="td" id="p-c-i">
                                                        <img 
                                                            className="img-thumbnail"
                                                            src={photoUrl} 
                                                            onError={i => (i.target.src = `${DefaultProfile}`)}
                                                            alt={user.name}
                                                        />  
                                                        
                                                        </div>
                                                        <div className="td" id="c-inp">
                                                            <input type="text" placeholder="Bạn đang nghĩ gì?" />
                                                        </div>
                                                    </div>
                                                    <div id="insert_emoji"><i className="far fa-smile"></i></div>
                                                </div>
                                </div>

                                <div className="row">
                        <div className="col md-12 mt-5 mb-5">
                            <ProfileTabs
                                followers={user.followers}
                                following={user.following}
                                posts={posts}
                            />
                            </div>
                         </div>
                        <div>
                        {this.renderPosts(posts)}
                        
                        </div>
                        
                    </div>
                    <div className="col-lg-3">
                        <div className="panel panel-default" id="friends">
                        <div className="panel-body">
                            <h4>Friends</h4>
                            <ul>
                            <li>
                               
                                <a className="text-danger" href="#">So hard to build</a>
                            </li>
                            </ul>
                        </div>
                        </div>
                    </div>
                    </div>
                    </div>
                </main>
                </div>
                

            </>
        );
    }
}

export default MyProfile;