import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import '../index.css';
import {Link} from 'react-router-dom'
import {signin, authenticate} from '../auth';



class Signin extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            error: "",
            redirectToReferer: false,
            loading: false
        };
    }

    handleChange = (name) => event => {
        this.setState({error: ""})
        this.setState({ [name]: event.target.value });
    };

    
    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true});
        const {email, password} = this.state;
        const user = {
            email,
            password
        };

        signin(user)
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

   

    signinForm = (email, password) => (
        <>
        <div className="form-group">
        <label htmlFor="exampleInputEmail1">Địa chỉ email</label>
            <input type="text" name="email" className="form-control" 
            id="exampleInputEmail1" value={email} onChange={this.handleChange("email")} placeholder="email"/>
            <small id="emailHelp" className="form-text text-muted">Chúng tôi sẽ không chia sẻ nó cho bất cứ ai.</small>
        </div>
        <div className="form-group">
        <label htmlFor="exampleInputEmail1">Mật khẩu</label>
            <input type="password" name="password" className="form-control" id="exampleInputEmail1" value={password} 
            onChange={this.handleChange("password")} placeholder="mật khẩu"/>
            <button type="submit" className="btn btn-primary login-button" onClick={this.clickSubmit}>Đăng nhập</button>
        <br/>
        
        <Link to ="/register"><small id="emailHelp" className="form-text text-muted">Create account</small></Link>
        </div>
        </>
    )

    render() {
            const {email, password, error, redirectToReferer, loading} = this.state;
            
            if (redirectToReferer) {
                return <Redirect to="/" />
            }

            return (
            <div className="login-box card page-container">
            <h2 >Đăng nhập</h2>

            <div className="alert alert-primary" 
                style={{ display: error ? "" : "none"}}>{error}
                </div>
                {loading? <div class="animationload">
                            <div class="osahanloading"></div>
                            </div> : ""
                        }
                
                {this.signinForm(email, password)}
            </div>
            );
    }
}
export default Signin;