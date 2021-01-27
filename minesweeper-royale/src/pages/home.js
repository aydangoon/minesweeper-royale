import io from 'socket.io-client';
import React from 'react';

export class Home extends React.Component {

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
      <div className="container-lg">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <h1>Minesweeper Royale</h1>
          <h3>Searching for Players...</h3>
          <div className="progress w-100">
            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
              style={{width: `${this.state.found * 10}%`}} />
          </div>
        </div>
      </div>
    );
  }
}
