import React, { Component } from "react";
import { singlePost, remove, like, unlike } from "./apiPost";
import DefaultPost from "../img/beach.jpg";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Comment from "./Comment";
import "../css/style.css";

class SinglePost extends Component {
    state = {
        post: "",
        redirectToHome: false,
        redirectToSignin: false,
        like: false,
        likes: 0,
        comments: []
    };

    checkLike = likes => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1;
        return match;
    };

    componentDidMount = () => {
        const postId = this.props.match.params.postId;
        singlePost(postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    post: data,
                    likes: data.likes.length,
                    like: this.checkLike(data.likes),
                    comments: data.comments
                });
            }
        });
    };

    updateComments = comments => {
        this.setState({ comments });
    };

    likeToggle = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true });
            return false;
        }
        let callApi = this.state.like ? unlike : like;
        const userId = isAuthenticated().user._id;
        const postId = this.state.post._id;
        const token = isAuthenticated().token;

        callApi(userId, token, postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length
                });
            }
        });
    };

    deletePost = () => {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;
        remove(postId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ redirectToHome: true });
            }
        });
    };

    deleteConfirmed = () => {
        let answer = window.confirm(
            "Are you sure you want to delete your post?"
        );
        if (answer) {
            this.deletePost();
        }
    };

    renderPost = post => {
        const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
        const posterName = post.postedBy ? post.postedBy.name : " Unknown";

        const { like, likes } = this.state;

        return (
            <div>
            <div className="post">
                <div className="tb">
                    <a href="#" className="td p-p-pic">
                    <img 
                        className="img-thumbnail"
                        src={`http://localhost:8080/api/post/photo/${post._id}`}
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
                
                <div>
                    <div className="p-acts">
                    {like ? (
                            <h3 onClick={this.likeToggle}>
                                <i
                                    className="fa fa-thumbs-up text-success bg-dark"
                                    style={{ padding: "10px", borderRadius: "50%" }}
                                />{" "}
                                {likes} Like
                            </h3>
                        ) : (
                            <h3 onClick={this.likeToggle}>
                                <i
                                    className="fa fa-thumbs-up text-warning bg-dark"
                                    style={{ padding: "10px", borderRadius: "50%" }}
                                />{" "}
                                {likes} Like
                            </h3>
                        )}
                        <div className="p-act comment"><i className="far fa-comments"></i><span>1</span></div>
                        <div className="p-act share"><i className="fas fa-reply"></i></div>
                    </div>
                </div>
            </div>
            </div>
           

            
        );
    };

    render() {
        const { post, redirectToHome, redirectToSignin, comments } = this.state;

        if (redirectToHome) {
            return <Redirect to={`/`} />;
        } else if (redirectToSignin) {
            return <Redirect to={`/signin`} />;
        }

        return (
            <div className="container">
                <h2 className="display-2 mt-5 mb-5">{post.title}</h2>

                {!post ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    this.renderPost(post)
                )}

                <Comment
                    postId={post._id}
                    comments={comments.reverse()}
                    updateComments={this.updateComments}
                />
            </div>
        );
    }
}

export default SinglePost;
