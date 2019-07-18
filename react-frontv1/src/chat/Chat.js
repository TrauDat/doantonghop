import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import '../chat.css';

class Chat extends Component {
    constructor() {
        super();
        this.state = {
            endpoint: "localhost:8082",
            username: "",
            value: '',
            socket: false
        };
        this.handleChange = this.handleChange.bind(this);
    }

    // sending sockets
    send = () => {
        const socket = socketIOClient(this.state.endpoint);
        socket.emit('change color', this.state.color) // change 'red' to this.state.color
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }
    

    btnRegister = (event) => {
        const socket = socketIOClient(this.state.endpoint);      
        socket.emit('client-send-Username', this.state.value);
    }

    // registerForm = (username) => (
    //     <>
    //         <div id="loginForm">
    //                     <h3>Vui lòng nhập tên: </h3>
    //                     <input type="text" id="txtUsername" onChange={this.handleChange("username")}
    //                          value={username}/>
                       
    //                     <input type="button" className="btn btn-success" 
    //                          value="Bắt đầu" id="btnRegister" onClick={() => this.btnRegister() } />
    //         </div>
    //     </>
    // );

    // adding the function  
    setColor = (color) => {
        this.setState({ color })
    }

    // componentDidMount = () => {
    //     let socket = socketIOClient(this.state.endpoint);
    //     this.setState({socket});
      
        

    //     socket.on('server-send-dki-thanhcong', function(data){
    //         alert(data);
    //       });
          
    // }

    render() {
         // testing for socket connections

        const socket = socketIOClient(this.state.endpoint);
        socket.on('server-send-dki-thatbai', function(){
            window.confirm("Username đã có người sử dụng, vui lòng chọn username khác!");
            console.log("dáhdahskdhasjkd");
        })
         //     socket.on('server-send-dki-thanhcong', function(data){
    //         alert(data);
    //       });

        return (

            // <div style={{ textAlign: "center" }}>
            //     {/* <button 
            //                         onClick={this.clickSubmit}
            //                     >Đăng ký</button> */}
            // <button className="btn btn-primary" 
            //     onClick={() => this.send() }>Change Color</button>
    
    
    
            // <button className="btn btn-primary" 
            // id="blue" onClick={() => this.setColor('blue')}>Blue</button>
            // <button className="btn btn-primary" 
            // id="red" onClick={() => this.setColor('red')}>Red</button>
    
            // </div>
            <>
                <div id="wrapper">
                    
                    <form >
                        <div id="loginForm">
                            <h3>Vui lòng nhập tên: </h3>
                            <input type="text" id="txtUsername" onChange={this.handleChange}
                                value={this.state.value}/>

                            
                            <input type="button" className="btn btn-success" 
                                value="Bắt đầu" id="btnRegister" onClick={this.btnRegister}/>
                        </div>

                    </form>
                    
                    <div id="chatForm">
                        <div id="left">
                            <div id="boxTitle">Thành viên đang online</div>
                            <div id="boxContent"></div>
                        </div>
                        <div id="right">
                            <div id="sayHi">
                                Xin chào, <span id="currentUser"> TrauDat</span>
                                <input type="button" className="btn btn-success" id="btnLogout" value="Đăng xuất" />
                            </div>

                            <div id="listMessages">

                            </div>

                            <div id="thongbao"></div>

                            <input type="text" id="txtMessage" />
                            <input type="button" id="btnSendMessage" className="btn btn-success" value="Gửi" />

                        </div>
                    </div>

                </div>
            </>
        );
    }
}

export default Chat;