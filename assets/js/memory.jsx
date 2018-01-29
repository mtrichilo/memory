import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_memory(root) {
    ReactDOM.render(<Memory />, root);
} 

class Memory extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.init();
    }

    init() {
        // Shuffle the initial set of letters.
        let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "A", "B", "C", "D", "E", "F", "G", "H"];
        letters = _.shuffle(letters);
        
        // Create a new Card object for each letter within the board.
        let board = _.map(letters, l => { 
            return { letter: l, matched: false, selected: false, click: this.click.bind(this) } 
        });
       
        // Return the initial game state.
        return { board: board, clicks: 0, wait: false };
    }

    click(key) {
        // If we've already selected this card, or two cards have been
        // selected and we're waiting for the one second timeout, return.
        if (this.state.board[key].selected || this.state.wait) {
            return;
        }

        // Change the state of the selected card and increase the click count.
        let board1 = _.map(this.state.board, card => _.clone(card));
        _.extend(board1[key], { selected: true });
        this.setState({ board: board1, clicks: this.state.clicks + 1 });

        // Retrieve selected cards.
        let board2 = _.map(board1, card => _.clone(card));
        let selected = _.where(board2, { selected: true });

        // If two are selected, set wait to true and check for a match.
        if (selected.length == 2) {
            this.setState({ wait: true });

            // If they match, set the matched property to true,
            if (selected[0].letter == selected[1].letter) {
                selected.forEach(card => _.extend(card, { matched: true }));
            }

            // Always reset selected to false.
            selected.forEach(card => _.extend(card, { selected : false }));

            // Wait a second before hiding the cards again.
            setTimeout(() => this.setState({ board: board2, wait: false }), 1000); 
        }
    }

    restart() {
        // Set the state to the initial game state.
        this.setState(this.init());
    }

    render() {
        let board = this.state.board;
        return (
            <div>
                <div className="row">
                    { _.map(board, (card, i) => <Card key={i} card={board[i]} index={i}/>) }
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
        card.click(props.index);
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
