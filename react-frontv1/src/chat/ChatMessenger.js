import React, { Component } from 'react';
//import socketIOClient from 'socket.io-client';
import Layout from '../components/Layout';
import '../chatMessenger.css';

class ChatMessenger extends Component {

    // constructor() {
    //     super();
    //     this.state = {
    //         endpoint: "localhost:8082",
          
    //     };
       
    // }


    render() {
        return (
            <Layout title="Chat Messenger" />
        );
    }
}

export default ChatMessenger;