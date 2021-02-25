import { Component } from 'react'
import { getMessage } from '../utils/lang'

export default class BaseComponent extends Component {

    state = {
        lang: {}
    }

    componentWillMount () {
        getMessage((l) => {
           this.setState({lang:l})
        })
        
     }
  
     formatMessage(id)  {
        return this.state.lang[id]?? id
     }
}