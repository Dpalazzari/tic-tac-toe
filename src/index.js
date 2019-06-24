import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/**
 * square is a function component that only has a render method and doesnt have its own state
 * no need for a class structure!
 */
function Square(props) {
  return (
    <button className="square" onClick={ props.onClick }>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={ () => this.props.onClick(i) }
      />
    )
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleNewGame(){
    const squares = Array(9).fill(null)
    const xIsNext = true
    this.setState({
      history: [{
        squares: squares
      }],
      stepNumber: 0,
      xIsNext: xIsNext
    })
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  handleClick(i){
    /**
     * .slice() makes a copy of the data.
     * this is for immutability. If you do not mutate/change the data, you can have access
     * to it later. For instance, if you wanted to go back and review the history of a 
     * tic tac toe game :)
     * 
     * Also, it is easier to detect changes when there is a new cloned object with different data
     * than checking a mutated variable to find the changes
     * 
     * Immutability helps you build pure components in React. Helps determine when a component
     * requires re-rendering. Easier to determine when changes have been made and therefore
     * when a component needs re-rendering.
     */
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if(calculateWinner(squares) || squares[i]){
      return null
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      // concat doesnt mutate the original array which is why its preferred to push()
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner  = calculateWinner(current.squares)

    const moves = history.map( (step, move) => {
      const desc = move ? `Go to move #${move}` : 'Go to game start.'
      return (
        <li>
          <button className='status-button' key={move} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })
    let status
    status = (winner) ? `Winner: ${winner}` : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className='flex-container'>
            <p className="status">{status}</p>
            <button className="status-button" onClick={() => this.handleNewGame() }>
              New Game?
            </button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let row of lines){
    const [a,b,c] = row
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}