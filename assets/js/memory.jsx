import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_memory(root, channel) {
    ReactDOM.render(<Memory channel={channel}/>, root);
} 

class Memory extends React.Component {
    constructor(props) {
        super(props);
        this.channel = props.channel;
        this.state = {board: [], clicks: 0, wait: false};
        this.channel.join()
            .receive("ok", this.newView.bind(this))
            .receive("error", resp => {console.log("Unable to join", resp)});
    }

    newView(view) {
        this.setState(view.game);
    }

    click(key) {
        this.channel.push("click", {index: key})
            .receive("ok", this.newView.bind(this));
        if (this.state.clicks % 2 == 1) {
            setTimeout(() => this.channel.push("flip", {})
                    .receive("ok", this.newView.bind(this)), 1000);
        }
    }

    restart() {
        this.channel.push("restart", {})
            .receive("ok", this.newView.bind(this));
    }

    render() {
        let board = this.state.board;
        return (
            <div>
                <div className="row">
                    { _.map(board, (card, i) => <Card key={i} card={board[i]} index={i} click={this.click.bind(this)}/>) }
                </div>
                <p>Number of clicks: {this.state.clicks}</p>
                <Button onClick={this.restart.bind(this)}>Reset</Button>
            </div>
        );
    }
}

function Card(props) {
    let card = props.card;

    function click() {
        props.click(props.index);
    }

    if (card.matched) {
        return (
            <span className="col-3 box">
                <div className="matched text-center">
                    <p>matched</p>
                </div>
            </span>
        );
    }
    else if (card.selected) {
        return (
            <span className="col-3 box">
                <div className="unmatched text-center">
                    <p>{card.letter}</p>
                </div>
            </span>
        );
    }
    else {
        return (
            <span className="col-3 box" onClick={click}>
                <div className="unmatched text-center">
                    <p>?</p>
                </div>
            </span>
        );
    }
}
