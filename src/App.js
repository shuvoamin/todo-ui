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
        <div class="input-group mb-3">
          <input 
            value={this.state.newItem} 
            onChange={event => this.setState({ newItem : event.target.value })}
            type="text" 
            placeholder="Todo item"
            className="form-control"
            required/>
          <div class="input-group-append">
            <button className="btn btn-primary">Add</button>
          </div>
        </div>
    	</form>
    );
  }
}

class Todo extends React.Component {

  handleDeleteItem = async () => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    };

    const resp = await fetch(`${apiUrl}/${this.props.id}`, requestOptions);

    const refreshResponse = await fetch(apiUrl);
    const refreshedTodoItems = await refreshResponse.json();

    // TODO fix manual refresh
    window.location.reload();
  }

  render() {
    const todoItem = this.props;
    return (
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          {todoItem.name}
          <button 
            onClick={this.handleDeleteItem}
            data-item-id={todoItem.id} 
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
            <div className=" col-lg-offset-4 col-lg-8">
            <div className="card">
              <div className="card-header bg-primary text-white">{this.props.title}</div>
              <div className="card-body">
                <Form onSubmit={this.addTodoItem}/>
                <TodoList todoItems={todoItems} />
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
