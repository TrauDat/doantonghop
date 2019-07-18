import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated} from '../auth';
import { Button,Navbar,FormControl,FormGroup,NavItem, Nav} from 'react-bootstrap';

import Dropdown from 'react-bootstrap/Dropdown'

const isActive = (history, path) => {
    if (history.location.pathname === path) return { color: "#ff9900" };
    else return { color: "#ffffff" };
};



const Menu = ({ history }) => (

    <header>
        <div className="logo-area">
                <Link
                        style={isActive(history, "/")}
                        to="/"
                    >
                                TrauDat
                    </Link>
        </div>
        <div className="menu">
            <ul>
                <li>
                    <Link
                        style={isActive(history, "/users")}
                        to="/users"
                    >
                                Mọi người
                    </Link>
                </li>
                <li >
                    <Link
                        style={isActive(history, "/")}
                        to="/"
                    >
                                Trang chủ
                    </Link>
                </li>
                
         </ul>
      </div>
      <div className="icon-links">
         <ul className="quick-options">
            <li role="presentation">
                <a href="/search">
                   
                </a>
                <Link

                        to="/search"
                    >
                         <i className="fa fa-search"></i>
                </Link>
            </li>  
           <li>
            <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        <i className="fa fa-user-plus"></i>
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{width: "300px", height: "400px", overflowY: "scroll"}}>
                        <Dropdown.Item href="#/action-1">
                            <div>
                                <h4>Trau Dat</h4>
                            </div>
                            <div>
                                <button className="btn btn-primary" style={{width: "50%"}}>Đồng ý</button>
                                <button className="btn btn-primary" style={{width: "50%"}}>Từ chối</button>
                            </div> 
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
           </li>
           
           <li>
                <Link
                    to="/chat"
                >
                    <i className="fa fa-comments" aria-hidden="true"></i>
                </Link>
           </li>
           <li>
             <a href="home.html">
               <i className="fa fa-bell" aria-hidden="true"></i>
             </a>
           </li>
         </ul>
         
            
         {isAuthenticated() && (
             <>
             <div className="privacy">
                <a
                    className="nav-link" 
                    style={isActive(history, "/signout",
                    { cursor: "pointer", color: "#fff"})
                    }
                              
                >
                    <Link 
                         style={isActive(
                            history,
                            `/user/${isAuthenticated().user._id}`
                        )}
                        to={`/user/${isAuthenticated().user._id}`}>
                    
                        {`${isAuthenticated().user.name}`}
                    </Link>   
                </a> 
            </div> 
             <div className="privacy">
                <a
                    className="nav-link"
                    style={isActive(history, "/signout",
                    { cursor: "pointer", color: "#fff"})
                }
                    onClick={() => signout(() => history.push('/register'))}
                
                >
                    Đăng xuất   
                </a>   

               
            </div>
            
            </>
           
         )}
         
         
      </div>
      
    </header>
    
);

export default withRouter(Menu);
