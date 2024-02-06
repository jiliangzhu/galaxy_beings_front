import React,{Component} from 'react'
import './static/AlienPreview.css';
import  AlienPreview  from "./AlienPreview";
import  AlienToggler  from "./AlienToggler";



class AlienSimulator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _value:{
                "head":1,
                "eye":1,
                "shirt":1
            },
            _className:"alien-parts head-visible-1 eye-visible-1 shirt-visible-1",
            _style:{
                eye_color:{filter:"hue-rotate(0deg)"},
                skin:{filter:"hue-rotate(0deg)"},
                color:{filter:"hue-rotate(0deg)"},
            }
        };
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(event) {
        var _id = event.target.id.replace(/_select/,"");

        var _value = this.state._value
        var _className = this.state._className
        var _style = this.state._style
        _value[_id] = event.target.value;

        if(_id === "head" || _id === "eye" || _id === "shirt"){
            _className = "alien-parts head-visible-"+ _value["head"] +" eye-visible-"+ _value["eye"] +" shirt-visible-" + _value["shirt"];
        }else{
            _style[_id] = {filter:"hue-rotate("+_value[_id]+"deg)"}
        }
        this.setState({_className,_style,_value});
    }
    render() {
        return  <div className="App">
        <div className="row alien-parts-bin-component alien-simulator" authenticated="true" lesson="1" lessonidx="1">
            <div  className="alien-preview" id="alien-preview">
                <div className="alien-char">
                    <AlienPreview _style={this.state._style} _className={this.state._className} _value={this.state._value}></AlienPreview>
                </div>
            </div>
            <AlienToggler handleChange={this.handleChange}></AlienToggler>
        </div>
    </div>;
    }
}



export default AlienSimulator
