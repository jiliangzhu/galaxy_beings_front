import React, { Component } from 'react';
import AlienPreview from "./AlienPreview"

class AlienCard extends Component {
    constructor(props) {
        super(props)
        this.state = { alien:this.props.alien,name:this.props.name,level:this.props.level}
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps!==this.props){
            this.setState({ _className:nextProps._className,_style:nextProps._style})
            return true
        }else{
            return false
        }
    }
    render() { 
        return ( 
            <div className="game-card home-card selectable">
                <div className="alien-char">
                <AlienPreview alien={this.state.alien}></AlienPreview>
                    <div className="alien-card card bg-shaded">
                        <div className="card-header bg-dark hide-overflow-text">
                            <strong>{this.state.name}</strong>
                        </div>
                        <small className="hide-overflow-text">Alien {this.state.level} level</small>
                    </div>
                </div>
            </div>            
        )
    }
}
 
export default AlienCard;