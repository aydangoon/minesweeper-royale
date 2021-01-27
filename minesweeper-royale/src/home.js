import io from 'socket.io-client';
import React from 'react';

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      found: 1
    };
  }

  componentDidMount() {
    this.socket = io('http://localhost:8000');
    this.socket.on('status-update', ({ found }) => {
      this.setState({found: found});
    });
    this.socket.on('join-lobby', ({ id }) => {
      this.socket.disconnect();
      this.props.history.push('/lobby/'+id);
    });
  }

  componendWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  render() {
    return (
      <div>
        <h1>Searching for Opponents</h1>
        <h3>{this.state.found}/10</h3>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
}
