import React, { Component } from 'react';
import {signup, signinWithout, authenticate} from '../auth';
import {Link, Redirect} from 'react-router-dom';
import "../css/bootstrap.min.css";
// import "../css/style.css"

class Register extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            emailSignin: "",
            passwordSignin: "",
            error: "",
            open: false,
            redirectToReferer: false,
            loading: false
        };
    }

    handleChange = (nameOfInput) => event => {
        this.setState({error: ""})
        this.setState({ [nameOfInput]: event.target.value });
    };

    clickSubmit = event => {
        event.preventDefault();
        const {name, email, password, username} = this.state;
       
        const user = {
            name,
            email,
            password,
            username
        };

        signup(user)
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error });
                } 
                else {
                    this.setState({
                        error: "",
                        name: "",
                        email: "",
                        password: "",
                        username: "",
                        open: true
                    });
                }
            });
    };

    clickSubmitLogin = event => {
        event.preventDefault();
        this.setState({ loading: true});
        const {emailSignin, passwordSignin} = this.state;
        const user = {
            emailSignin,
            passwordSignin
        };

        signinWithout(user)
            .then(data => {
                if (data.error) 
                {
                    this.setState({ error: data.error, loading: false });
                } else {
                    //authenticate
                    authenticate(data, () => {
                        this.setState({ redirectToReferer: true })
                    });
                }
            });
    };


    registerForm = (name, email, password, username) => (
            <>
            <h4>Bạn chưa có tài khoản? Đăng ký</h4>

                <form >
                    <div class="form-group">
                        <input className="form-control"
                            onChange={this.handleChange("name")}
                            value={name} 
                            type="text" placeholder="Họ và tên" />
                    </div>

                    <div class="form-group">
                        <input className="form-control"
                            onChange={this.handleChange("email")}
                            value={email} 
                            type="text" placeholder="Địa chỉ email" />
                    </div>

                    <div class="form-group">
                        <input className="form-control"
                            onChange={this.handleChange("username")}
                            value={username} 
                            type="text" placeholder="Tài khoản" />
                    </div>

                     <div class="form-group">
                        <input className="form-control"
                            onChange={this.handleChange("password")}
                            value={password} 
                            type="password" placeholder="Mật khẩu" />
                    </div>

                    <div class="form-group">
                            <button className="btn btn-primary" 
                                    onClick={this.clickSubmit}
                                >Đăng ký</button>
                    </div>
                </form>
        </>
    );

    loginForm = (emailSignin, passwordSignin) => (
        <>
        <h4>Đăng nhập để tham gia nhiều điều thú vị!</h4>

        <form method="post" action="home.html">
            <div className="form-group">
                <input className="form-control" 
                    value={emailSignin} onChange={this.handleChange("emailSignin")}
                    type="text" 
                    name="emailSignin" placeholder="Email" />
            </div>

            <div class="form-group">
                <input className="form-control" type="password" name="passwordSignin"
                    value={passwordSignin} 
                    onChange={this.handleChange("passwordSignin")}
                    placeholder="Mật khẩu"
                ></input>
            </div>

            <div class="form-group">
                <button type="submit" className="btn btn-primary login-button" 
                    onClick={this.clickSubmitLogin}>Đăng nhập</button>
            </div>

        </form>
        </>
    ); 

    render() {
        const {name, email, password, 
            emailSignin, passwordSignin, error, 
            open, redirectToReferer, loading, username} = this.state;
        if (redirectToReferer) {
            return <Redirect to="/" />
        }
        return (
            <>
            <main className="container">
                <h1 className="text-center">Chào mừng đến với TrauDat <br /> <small>Một trang mạng xã hội đơn giản.</small></h1>
                    <div className="row">
                        <div className="alert alert-primary" 
                                style={{ display: error ? "" : "none"}}>{error}
                        </div>
                        {loading? <div class="animationload">
                            <div class="osahanloading"></div>
                            </div> : ""
                        }
                    </div>

                    <div className="row">
                        <div className="col-md-6">

                            {this.loginForm(emailSignin,passwordSignin)}

                        </div>

                        

                       
                        <div className="col-md-6">
                        
                        {this.registerForm(name, email, password, username)}
                        <div className="alert alert-info"
                            style={{display: open ? "" : "none"}}
                            >
                                Tài khoản mới đã được tạo thành công. Vui lòng <Link to="/signin">đăng nhập</Link>.
                        </div>
                        </div>

                        
                    </div>  
            </main>

            <footer class="container text-center">
                <ul class="nav nav-pills pull-right">
                    <li>TrauDat social network - Made by Trau Dat </li>
                </ul>
            </footer>
            </>
        );
    }
}

export default Register;