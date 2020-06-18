import React from 'react';
import './App.css';

const apiUrl = "https://todoapi-demo.azurewebsites.net/api/todoitems";

const todoList = (props) => {
  fetch(apiUrl)
    .then((resp) => console.log(resp.json()));
}

class Card extends React.Component {
  render() {
    //todoList();
    const todoItem = this.props;
    return (
      <div>{todoItem.name}</div>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <div className="header">{this.props.title}</div>
        <Card />
      </div>
    )
  }
}

export default App;
