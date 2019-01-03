import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const X = "x";
const O = "o";
const ROWS_NUMBER = 3;
const CELLS_NUMBER = 3;
const EMPTY_BOARD = Array(ROWS_NUMBER).fill(null).map(() => Array(CELLS_NUMBER).fill(null));

const Square = ({value, onClick}) => (
  <button className="square" onClick={onClick}>
    {value}
  </button>
);


class Board extends React.Component {
  renderSquare(i, j) {
    return (
      <Square
        key={j}
        value={this.props.squares[i][j]}
        onClick={() => this.props.onClick(i, j)}
      />
    );
  }

  render() {
    const rows = [];

    for (let i = 0; i < ROWS_NUMBER; i++) {
      const row = [];
      for (let j = 0; j < CELLS_NUMBER; j++) {
        row.push(this.renderSquare(i, j))
      }
      rows.push(
        <div key={i} className="board-row">{row}</div>
      )
    }

    return <div>{rows}</ div>
  }
}

const calculateWinner = rows => {
  if ((rows[0][0] && rows[0][0] === rows[1][1] && rows[1][1] === rows[2][2]) ||
    (rows[0][2] && rows[0][2] === rows[1][1] && rows[1][1] === rows[2][0])) {
    return rows[1][1]
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let j = 0;

    if (row[j] && row[j] === row[j + 1] && row[j + 1] === row[j + 2]) {
      return rows[i][j]
    }
    if (rows[j][i] && rows[j][i] === rows[j + 1][i] && rows[j + 1][i] === rows[j + 2][i]) {
      return rows[j][i]
    }
  }

  return null;
};

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{
        squares: EMPTY_BOARD,
        lastClickedX: undefined,
        lastClickedY: undefined
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i, j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();

    const rows = squares.map((row) => row.slice());

    if (calculateWinner(rows) || rows[i][j]) {
      return;
    }

    rows[i][j] = this.state.xIsNext ? X : O;
    this.setState({
      history: history.concat([{
        squares: rows,
        lastClickedX: i,
        lastClickedY: j,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move # ${move}: (${step.lastClickedX},${step.lastClickedY})` :
        'Go to game start';

      return (
        <li key={move}>
          <button className={move === stepNumber ? "last-move" : ""} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? X : O);
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i, j) => this.handleClick(i, j)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game/>, document.getElementById("root"));
