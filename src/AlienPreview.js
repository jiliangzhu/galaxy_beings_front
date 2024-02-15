import React,{Component} from 'react'

class AlienPreview extends Component  {
    constructor(props){
        super(props)
        this.state = { alien:this.props.alien,_style:this.props._style,_className:this.props._className}
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps!==this.props){
            this.setState({ 
                alien:nextProps.alien,
                _style:nextProps._style,
                _className:nextProps._className,
            })
            return true
        }else{
            return false
        }
    }
    render(){
        var _style = this.state._style || []
        var _className = this.state._className
        if(this.state.alien !== undefined){
            _style['head_color'] = {filter:"hue-rotate(0deg)"}
            _style['skin'] = {filter:"hue-rotate(0deg)"}
            _style['face_color'] = {filter:"hue-rotate(0deg)"}
            _className = "alien-parts body-visible-1 feet-visible-1 gun-visible-1"
            if(this.state.alien.dna !== undefined){
                var dna = this.state.alien.dna
                var _body = dna.substring(0,2) % 3 +1
                var _feet = dna.substring(2,4) % 3 +1
                var _gun = dna.substring(4,6) % 3 +1
                _className = "alien-parts body-visible-"+_body+" feet-visible-"+_feet+" gun-visible-"+_gun
                _style['head_color'] = {filter:"hue-rotate("+dna.substring(6,9) % 360 +1+"deg)"}
                _style['skin'] = {filter:"hue-rotate("+dna.substring(9,12) % 360 +1+"deg)"}
                _style['face_color'] = {filter:"hue-rotate("+dna.substring(12,15) % 360+"deg)"}
            }
        }
        return (
                    <div className={_className} id="alien-parts">
                        {/* <img alt="" src={process.env.PUBLIC_URL + "/catlegs.png"} className="cat-legs" style={{filter:"hue-rotate(0deg); display: none"}}/> */}
                        <img alt="" src={process.env.PUBLIC_URL + "/head.png"} className="head" style={_style['head_color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/body-1.png"} className="body body-part-1" style={_style['skin']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/body-2.png"} className="body body-part-2" style={_style['skin']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/body-3.png"} className="body body-part-3" style={_style['skin']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/feet-1.png"} className="feet feet-part-1" style={_style['skin']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/feet-2.png"} className="feet feet-part-2" style={_style['skin']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/feet-3.png"} className="feet feet-part-3" style={_style['skin']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/gun-1.png"} className="gun gun-part-1" />
                        <img alt="" src={process.env.PUBLIC_URL + "/gun-2.png"} className="gun gun-part-2" />
                        <img alt="" src={process.env.PUBLIC_URL + "/gun-3.png"} className="gun gun-part-3" />
                        <img alt="" src={process.env.PUBLIC_URL + "/face.png"} className="face" style={_style['face_color']}/>
                    </div>
        );
      }
    }
    
    
export default AlienPreview;
