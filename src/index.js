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
      score: 0,
      state: false,
      food: {
        x: null,
        y: null,
      },
      direction: 'right'
    }
  }


  run() {
    const snake = this.state.snake
    if (!this.state.state) {
      return;
    }
    const head = snake[0]
    // 计算下一个点
    let next = {x: head.x, y: head.y}
    switch (this.state.direction) {
      case 'right':
        next.x += 1
        break
      case 'down':
        next.y += 1
        break
      case 'left':
        next.x -= 1
        break
      case 'up':
        next.y -= 1
        break
      default:
        break
    }

    // 判断下一个点是否合法
    // 1. 不能自己咬自己
    // 2. 不能超过边界
    if (!this.isValid(next)) {
      console.log(next)
      this.setState({state: false})
      clearInterval(this.timer)
    } else {
      // 下一个点合法， 加到头
      snake.unshift(next)
      const food = this.state.food
      if (next.x !== food.x  || next.y !== food.y) {
        // 没有吃到food，移除尾巴
        snake.pop()
      } else {
        // 吃到 food， 得分，重新生成food
        this.incrementScore()
        this.generateFood()
      }
    }
    this.setState({snake: snake})
    // 强行刷新
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
  }

  start() {
    this.generateFood()
    this.setState({
      snake: [{x : 1, y: 0}, {x: 0, y: 0}],
      state: true,
      score: 0,
      direction: 'right'
    })
    this.timer =  setInterval(() => {
      this.run()
    }, 300)
  }
  // 判断是否是合法的下一个点
  isValid(next) {
    const row = this.state.row
    const column = this.state.column
    if (this.isSnake(next.x, next.y)) {
      return false
    }
    return next.x < column && next.y < row && next.x >= 0 && next.y >= 0
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
      <div className="panel" >
        <span>score: {this.state.score}</span>
        <button onClick={() => this.start()} disabled={this.state.state}>开始</button>
      </div>
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

