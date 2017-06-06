import React, { Component } from "react"
import "./App.css"

class Watch extends Component {
  render() {
    if (this.props.i % 2 === 0) {
      return (
        <tr style={{ backgroundColor: "#eee" }}>
          <td>{this.props.name}</td>
          <td style={{ textAlign: "right" }}>{this.props.stars}</td>
        </tr>
      )
    } else {
      return (
        <tr>
          <td>{this.props.name}</td>
          <td style={{ textAlign: "right" }}>{this.props.stars}</td>
        </tr>
      )
    }
  }
}

class App extends Component {
  state = {}

  getTerms = async name => {
    console.log(name)
    try {
      const response = await fetch("http://localhost:8091/api/v1/watch", {
        mode: "cors",
        headers: new Headers({ "content-type": "application/json" }),
        body: JSON.stringify({ username: name }),
        method: "POST"
      })
      const watch = await response.json()
      console.log(watch)
      return watch
    } catch (err) {
      return err
    }
  }

  componentDidMount() {
    this.getTerms("bpowell").then(watch => {
      this.setState({ watch })
    })
  }

  getNewUser = () => {
    let name = document.getElementById("username").value
    this.getTerms(name).then(watch => {
      this.setState({ watch })
    })
  }

  render() {
    if (this.state.watch === undefined || this.state.watch === {}) {
      return <div />
    }

    let list = []
    let i = 1
    for (let k in this.state.watch) {
      if (this.state.watch.hasOwnProperty(k)) {
        list.push(<Watch i={i} name={k} stars={this.state.watch[k]} />)
        i++
      }
    }

    console.log(this.state.watch)
    return (
      <div className="App">
        <div>
          Username to lookup:
          <input id="username" type="text" placeholder="Search..." />
          <button onClick={this.getNewUser}>Submit</button>
        </div>
        <table>
          <tr>
            <th>Repo Name</th>
            <th>GitHub Stars</th>
          </tr>
          {list}
        </table>
      </div>
    )
  }
}

export default App
