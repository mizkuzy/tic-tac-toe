import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const X = "x";
const O = "o";
const ROWS_NUMBER = 3;
const CELLS_NUMBER = 3;
const EMPTY_BOARD = [
  Array(CELLS_NUMBER).fill(null),
  Array(CELLS_NUMBER).fill(null),
  Array(CELLS_NUMBER).fill(null)
];

const Square = ({value, onClick}) => (
  <button className="square" onClick={onClick}>
    {value}
  </button>
);


class Board extends React.Component {
  renderSquare(i, j) {
    console.log('i, j', i, j)
    console.log(this.props.squares)
    return (
      <Square
        value={this.props.squares[i][j]}
        onClick={() => this.props.onClick(i, j)}
      />
    );
  }

  render() {
    const squares = this.props.squares;

    for (var i = 0; i < ROWS_NUMBER; i++) {
      const row = []
      for (var j = 0; j < CELLS_NUMBER; j++) {
        console.log(`squares render.  ${i}, ${j}`)
        row.push(this.renderSquare(i, j))
      }
      squares.push(
        <div className="board-row">{row}</div>
      )
    }

    console.log(squares)
    return <div>{squares}</ div>
  }
}

const calculateWinner = squares => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

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

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i][j] = this.state.xIsNext ? X : O;
    this.setState({
      history: history.concat([{
        squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
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
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move # ${move}` :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    console.log(moves)
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
