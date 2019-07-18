import React from 'react';
import { Route, Switch} from "react-router-dom";
import Register from "./core/Register";
import Home from "./core/Home";
// import Header from "./core/Header";
import Menu from "./core/Menu";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
// import Profile from "./user/Profile";
import MyProfile from "./user/MyProfile";
import Users from "./user/Users";
import MyEditProfile from "./user/MyEditProfile";
import PrivateRoute from "./auth/PrivateRoute";
import NewPost from "./post/NewPost";
import SinglePost from "./post/SinglePost";
import Search from "./user/Search";

const MainRouter = () => (
    <div>
        <Menu />
        {/* <Header /> */}
        <Switch>
            
            <PrivateRoute exact path="/post/create" component={NewPost} />
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/search" component={Search}></Route>
            <Route exact path="/post/:postId" component={SinglePost}></Route>
            <Route exact path="/register" component={Register}></Route>
            
            <Route exact path="/users" component={Users}></Route>
            <Route exact path="/signup" component={Signup}></Route>
            <Route exact path="/signin" component={Signin}></Route>
            {/* <Route exact path="/user/:userId" component={Profile}></Route> */}
            <PrivateRoute
                exact
                path="/user/edit/:userId"
                component={MyEditProfile}
            />
            <PrivateRoute exact path="/user/:userId" component={MyProfile} />
            
        </Switch>
    </div>
);

export default MainRouter;