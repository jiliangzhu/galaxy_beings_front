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
            _style['color'] = {filter:"hue-rotate(0deg)"}
            _style['skin'] = {filter:"hue-rotate(0deg)"}
            _style['eye_color'] = {filter:"hue-rotate(0deg)"}
            _className = "alien-parts head-visible-1 eye-visible-1 shirt-visible-1"
            if(this.state.alien.dna !== undefined){
                var dna = this.state.alien.dna
                var _head = dna.substring(0,2) % 8 +1
                var _eye = dna.substring(2,4) % 11 +1
                var _shirt = dna.substring(4,6) % 6 +1
                _className = "alien-parts head-visible-"+_head+" eye-visible-"+_eye+" shirt-visible-"+_shirt
                _style['color'] = {filter:"hue-rotate("+dna.substring(6,9) % 360 +1+"deg)"}
                _style['skin'] = {filter:"hue-rotate("+dna.substring(9,12) % 360 +1+"deg)"}
                _style['eye_color'] = {filter:"hue-rotate("+dna.substring(12,15) % 360+"deg)"}
            }
        }
        return (
                    <div className={_className} id="alien-parts">
                        {/* <img alt="" src={process.env.PUBLIC_URL + "/catlegs.png"} className="cat-legs" style={{filter:"hue-rotate(0deg); display: none"}}/> */}
                        <img alt="" src={process.env.PUBLIC_URL + "/right-upper-arm-1@2x.png"} className="right-upper-arm" style={_style['skin']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/torso-1@2x.png"} className="torso" style={_style['color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/left-feet-1@2x.png"} className="left-feet" style={_style['color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/right-feet-1@2x.png"} className="right-feet" style={_style['color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/left-leg-1@2x.png"} className="left-leg" style={_style['color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/right-leg-1@2x.png"} className="right-leg" style={_style['color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/left-thigh-1@2x.png"} className="left-thigh" style={_style['color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/right-thigh-1@2x.png"} className="right-thigh" style={_style['color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/shirt-1@2x.png"} className="shirt shirt-part-1" style={_style['color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/shirt-2@2x.png"} className="shirt shirt-part-2" style={_style['color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/shirt-3@2x.png"} className="shirt shirt-part-3" style={_style['color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/shirt-4@2x.png"} className="shirt shirt-part-4" style={_style['color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/shirt-5@2x.png"} className="shirt shirt-part-5" style={_style['color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/shirt-6@2x.png"} className="shirt shirt-part-6" style={_style['color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/head-1@2x.png"} className="head head-part-1" style={_style['skin']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/head-2@2x.png"} className="head head-part-2" style={_style['skin']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/head-3@2x.png"} className="head head-part-3" style={_style['skin']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/head-4@2x.png"} className="head head-part-4" style={_style['skin']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/head-5@2x.png"} className="head head-part-5" style={_style['skin']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/head-6@2x.png"} className="head head-part-6" style={_style['skin']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/head-7@2x.png"} className="head head-part-7" style={_style['skin']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/head-8@2x.png"} className="head head-part-8" style={_style['skin']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/right-forearm-1@2x.png"} className="right-forearm" style={_style['skin']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/left-upper-arm-1@2x.png"} className="left-upper-arm" style={_style['skin']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/hand1-1@2x.png"} className="left-hand" style={_style['skin']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/hand-2-1@2x.png"} className="right-hand" style={_style['skin']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/left-forearm-1@2x.png"} className="left-forearm" style={_style['skin']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/eyes-1@2x.png"} className="eye eye-part-1" style={_style['eye_color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/eyes-2@2x.png"} className="eye eye-part-2" style={_style['eye_color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/eyes-3@2x.png"} className="eye eye-part-3" style={_style['eye_color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/eyes-4@2x.png"} className="eye eye-part-4" style={_style['eye_color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/eyes-5@2x.png"} className="eye eye-part-5" style={_style['eye_color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/eyes-6@2x.png"} className="eye eye-part-6" style={_style['eye_color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/eyes-7@2x.png"} className="eye eye-part-7" style={_style['eye_color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/eyes-8@2x.png"} className="eye eye-part-8" style={_style['eye_color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/eyes-9@2x.png"} className="eye eye-part-9" style={_style['eye_color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/eyes-10@2x.png"} className="eye eye-part-10" style={_style['eye_color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/eyes-11@2x.png"} className="eye eye-part-11" style={_style['eye_color']}/>
                        <img alt="" src={process.env.PUBLIC_URL + "/mouth-1@2x.png"} className="mouth"/>
                    </div>
        );
      }
    }
    
    
export default AlienPreview;
