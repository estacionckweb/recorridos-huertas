import React from 'react';
import { withStyles } from '@material-ui/core/styles';
// import Input from '@material-ui/core/Input';
import ResultsIcon from './../assets/results-icon.png'

class TopBar extends React.Component {
  state = {
    query: ''
  };

  handleChange = name => event => {
    if(event.target.value === '') this.props.clearSearch()
   this.setState({
     [name]: event.target.value,
   })
  }

  componentWillReceiveProps (nextProps) {
     if(nextProps.query !== this.props.query) {
       this.setState({ query: nextProps.query })
     }
  }

  render () {
    var icon = null
    if(this.state.query.length > 0) icon = <img className="w-4 h-4 m-2 mr-4" src={ResultsIcon} />
    return <div className="absolute pin-t pin-r m-2 mr-16 flex">
      {icon}
      <div className= "w-64">
        
      </div>
    </div>
  }
}

export default TopBar
