import React from 'react';
import './App.css';

const apiUrl = "https://todoapi-demo.azurewebsites.net/api/todoitems";

class TodoList extends React.Component {

  handleDelete = async (event) => {
    event.preventDefault();

    const id = event.target.parentNode.dataset.itemId;

    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    };
  
    const response = await fetch(`${apiUrl}/${id}`, requestOptions)
    const data = await response.json();

    this.props.onDelete(data);
  }

  render() {
    return(
      <div>
        {this.props.todoItems.map(todoItem => 
          <Todo onDelete={this.handleDelete} key={todoItem.id} {...todoItem}/>
        )}
      </div>
    )
  }
}

class Form extends React.Component {
  state = {
    newItem: ''
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: this.state.newItem })
    };

    const resp = await fetch(apiUrl, requestOptions);
    const data = await resp.json();

    this.props.onSubmit(data);
    this.setState({ newItem: '' });
  }

	render() {
  	return (
    	<form onSubmit={this.handleSubmit} className="form-inline">
        <div className="input-group mb-3">
          <input 
            value={this.state.newItem} 
            onChange={event => this.setState({ newItem : event.target.value })}
            type="text" 
            placeholder="Todo item"
            className="form-control"
            required/>
          <div className="input-group-append">
            <button className="btn btn-primary">Add</button>
          </div>
        </div>
    	</form>
    );
  }
}

class Todo extends React.Component {

  render() {
    return (
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          {this.props.name}
          <button 
            onClick={this.props.onDelete}
            data-item-id={this.props.id} 
            type="button" 
            className="close" 
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </li>
      </ul>
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
    this.setState(prevState => ({
    	todoItems: [...prevState.todoItems, newTodoItem],
    }));
  }

  deleteItem = (data) => {
    this.setState({ 
        todoItems: this.state.todoItems.filter(s => s.id !== data.id) 
      });
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
        <br />
        <div className="container">
          <div className="row">
            <div className="mx-auto">
              <div className="card">
                <div className="card-header bg-primary text-white">{this.props.title}</div>
                  <div className="card-body">
                    <Form onSubmit={this.addTodoItem}/>
                    <TodoList todoItems={todoItems} onDelete={this.deleteItem}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default App;
