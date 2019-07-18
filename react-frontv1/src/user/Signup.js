import React, { Component } from 'react';
import {signup} from '../auth';
import {Link} from 'react-router-dom';



class Signup extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            error: "",
            open: false
        };
    }

    handleChange = (name) => event => {
        this.setState({error: ""})
        this.setState({ [name]: event.target.value });
    };

    clickSubmit = event => {
        event.preventDefault();
        const {name, email, password} = this.state;
        const user = {
            name,
            email,
            password
        };

        signup(user)
            .then(data => {
                if (data.error) this.setState({ error: data.error })
                    else this.setState({
                        error: "",
                        name: "",
                        email: "",
                        password: "",
                        open: true
                    });
            });
    };

    

    signupForm = (name, email, password) => (
        <>
        <label htmlFor="exampleInputEmail1">Name</label>
            <input onChange={this.handleChange("name")} 
                    type="text" className="form-control" 
                    value={name}
                    placeholder="Name"/>
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input onChange={this.handleChange("email")} 
                    value={email}
                    type="email" 
                    className="form-control"   placeholder="email"/>
            <label htmlFor="exampleInputEmail1">Password</label>
            <input onChange={this.handleChange("password")} 
                    value={password}
                    type="password" className="form-control"  placeholder="password"/>
            <button className="btn btn-primary" 
                    onClick={this.clickSubmit}
                        >Submit</button>
            <br/>
            <small id="info-policy" className="form-text text-muted">We'll never share your information with anyone else.</small>
            </>
    )

    render() {
            const {name, email, password, error, open} = this.state;
            return (
            <div className="login-box card page-container">
            <h2 >Signup</h2>

            <div className="alert alert-primary" 
                    style={{ display: error ? "" : "none"}}>{error}</div>

            <div className="alert alert-info" 
                    style={{ display: open ? "" : "none"}}>
                        New account is successfully created. Please <Link to="/signin">Signin</Link>.
                    </div>
                {this.signupForm(name, email, password)}
            </div>
            );
    }
}
export default Signup;