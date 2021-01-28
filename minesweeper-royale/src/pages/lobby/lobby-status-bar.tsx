import { useState, Fragment, Component } from 'react';
import { LobbyStatus } from './types';

export function LobbyStatusBar(props: any) {
  const { status, playersReady, ready, countDownTimer, readyClick, winners } = props;
  const winnersList = winners.map((winner: number, i: number) => <div key={winner}>{i+1}) {winner}</div>);
  return (
    <div className="container-lg border d-flex justify-content-around">
      <Fragment>
        {status === LobbyStatus.ReadyUp ? (
          <Fragment>
            <div>{playersReady}/10 Ready</div>
            <div>
              <span>I'm Ready</span>
              <input type="checkbox" onChange={readyClick} checked={ready} />
            </div>
          </Fragment>
        ) : (
          <div>{status === LobbyStatus.CountDown ? countDownTimer : 'Go!'}</div>
        )}
      </Fragment>
      <div>
        {winners.length > 0 ? (
          <div>
            {(status === LobbyStatus.InGame ? 'Standings: ' : 'Last Round Results: ')}
            {winnersList}
          </div>
        ) : (
          <Fragment />
        )}
      </div>
    </div>
  );
}
//
