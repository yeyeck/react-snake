import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



class Board extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      row: 30,
      column: 30,
      snake: [{x : 1, y: 0}, {x: 0, y: 0}],
      length: 2,
      score: 0,
      state: true,
      food: {
        x: 6,
        y: 6,
      },
      direction: 'right',
      timer: {}
    }
  }


  run() {
    const snake = this.state.snake
    if (!this.state.state) {
      return;
    }
    let head = snake[0]
    console.log(snake)
    if (this.state.direction === 'right') {
      if ((head.x + 1) > this.state.column - 1) {
        console.log('clear')
        this.setState({state: false})
        clearInterval(this.timer)
      } else {
        snake.unshift({x: head.x + 1, y: head.y})
        
        const food = this.state.food
        if (head.x + 1 !== food.x || head.y !== food.y) {
          snake.pop()
        } else {
          this.incrementScore()
          this.generateFood()
        }
      }
    } else if (this.state.direction === 'down') {
      if ((head.y + 1) > this.state.row -1) {
        console.log('clear')
        this.setState({state: false})
        clearInterval(this.timer)
      } else {
        snake.unshift({x: head.x, y: head.y + 1})
        const food = this.state.food
        if (head.x!== food.x || (head.y + 1) !== food.y) {
          snake.pop()
        } else {
          this.incrementScore()
          this.generateFood()
        }
      }
    } else if (this.state.direction === 'left') {
      if ((head.x - 1) < 0) {
        console.log('clear')
        this.setState({state: false})
        clearInterval(this.timer)
      } else {
        snake.unshift({x: head.x - 1, y: head.y})
        const food = this.state.food
        if ((head.x - 1) !== food.x || head.y !== food.y) {
          snake.pop()
        } else {
          this.incrementScore()
          this.generateFood()
        }
      }
    } else if (this.state.direction === 'up') {
      if ((head.y - 1) < 0) {
        console.log('clear')
        this.setState({state: false})
        clearInterval(this.timer)
      } else {
        snake.unshift({x: head.x, y: head.y - 1})
        const food = this.state.food
        if (head.x !== food.x || (head.y - 1) !== food.y) {
          snake.pop()
        } else {
          this.incrementScore()
          this.generateFood()
        }
      }
    }
    this.setState({snake: snake})
    this.forceUpdate()
  }

  componentDidMount () {
    document.onkeydown = function(e) {
      switch (e.key) {
        case 'w':
          if (this.state.direction !== 'down') {
            this.setState({direction: 'up'})
          }
          break
        case 's':
          if (this.state.direction !== 'up') {
            this.setState({direction: 'down'})
          }
          break
        case 'a':
          if (this.state.direction !== 'right') {
            this.setState({direction: 'left'})
          }
          break
        case 'd':
          if (this.state.direction !== 'left') {
            this.setState({direction: 'right'})
          }
          break
        default:
          break
      }
    }.bind(this)

    this.timer =  setInterval(() => {
      this.run()
    }, 300)
  }

  incrementScore() {
    this.setState({score: this.state.score + 1})
  }

  isSnake(x, y) {
    const array = this.state.snake
    for (let i = 0; i < array.length; i ++) {
      if (array[i].x === x && array[i].y === y) {
        return true
      }
    }
    return false;
  }

  isFood(x, y) {
    if (this.state.food.x === x && this.state.food.y === y) {
      return true
    }
    return false
  }

  generateFood() {
    let x = Math.floor(Math.random() * this.state.column)
    let y = Math.floor(Math.random() * this.state.row)
    if (this.isSnake(x, y)) {
      this.generateFood()
    } else {
      this.setState({food: {x: x, y: y}})
      this.forceUpdate()
    }
  }
  render () {
    const row = this.state.row;
    const column = this.state.column;
    const elements = []
    for (let i = 0; i < row; i++) {
      const row = []
      for (let j = 0; j < column; j++) {
        if (this.isSnake(j, i)) {
          row.push(<div className="snake" key={j}/>)
        } else if (this.isFood(j, i)) {
          row.push(<div className="food" key={j}/>)
        } else {
          row.push(<div className="block" key={j}/>)
        }
      }
      elements.push(<div key={i}>{row}</div>)
    }

    return (
      <>
      <div>score: {this.state.score}</div>
      <div>
        {elements}
      </div>
      </>    
    )
  }
}

ReactDOM.render(
  <Board />,
  document.getElementById('root')
);

