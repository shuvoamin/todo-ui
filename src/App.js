import React from 'react';
import './App.css';

const apiUrl = "https://todoapi-demo.azurewebsites.net/api/todoitems";

const TodoList = (props) => (
  <div>
    {props.todoItems.map(todoItem => <Todo key={todoItem.id} {...todoItem}/>)}
  </div>
);

class Form extends React.Component {
  state = {
    newItem: ''
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    console.log(this.state.newItem);

    const resp = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(this.state.newItem),
      headers: {
          'Content-Type': 'application/json'
      }
    })

    console.log(resp);
    this.props.onSubmit(resp.data);
    this.setState({ newItem: '' });
  }

	render() {
  	return (
    	<form onSubmit={this.handleSubmit}>
        <input 
          value={this.state.newItem} 
          onChange={event => this.setState({ newItem : event.target.value })}
          type="text" 
          placeholder="Todo item"
          required/>
        <button>Add</button>
    	</form>
    );
  }
}

class Todo extends React.Component {
  render() {
    const todoItem = this.props;
    return (
      <div>
        <div>{todoItem.name}</div>
      </div>
    )
  }
}

class App extends React.Component {
  state = {
    error: null,
    isLoaded: false,
    todoItems: []
  };

  componentDidMount() {
    fetch(apiUrl)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            todoItems: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  addTodoItem = (newTodoItem) => {
    console.log(newTodoItem);
    this.setState(prevState => ({
    	todoItems: [...prevState.todoItems, newTodoItem],
    }));
  }

  render() {
    const { error, isLoaded, todoItems } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <div className="header">{this.props.title}</div>
          <Form onSubmit={this.addTodoItem}/>
          <TodoList todoItems={todoItems} />
        </div>
      )
    }
  }
}

export default App;
