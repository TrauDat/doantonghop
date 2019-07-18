import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

class Chat extends Component {
    constructor() {
        super();
        this.state = {
            endpoint: "localhost:8888",

            ///
            color: 'white'
            ///
        };
    }

    // sending sockets
    send = () => {
        const socket = socketIOClient(this.state.endpoint);
        socket.emit('change color', this.state.color) // change 'red' to this.state.color
    }

    // adding the function  
    setColor = (color) => {
        this.setState({ color })
    }

    componentDidMount = () => {
        const socket = socketIOClient(this.state.endpoint);
        setInterval(this.send(), 1000)
        socket.on('news', (col) => {
            document.body.style.backgroundColor = col;
        })
    }

    render() {
         // testing for socket connections

        const socket = socketIOClient(this.state.endpoint);

        return (
            <div style={{ textAlign: "center" }}>
                {/* <button 
                                    onClick={this.clickSubmit}
                                >Đăng ký</button> */}
            <button className="btn btn-primary" 
                onClick={() => this.send() }>Change Color</button>
    
    
    
            <button className="btn btn-primary" 
            id="blue" onClick={() => this.setColor('blue')}>Blue</button>
            <button className="btn btn-primary" 
            id="red" onClick={() => this.setColor('red')}>Red</button>
    
          </div>
        );
    }
}

export default Chat;