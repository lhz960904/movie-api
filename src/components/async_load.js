import React from 'react'

export default (loadComponent, placeholder = '正在加载') => {
  return class AsyncComponent extends React.Component {
    unmount = false
    constructor(props) {
      super(props)
      this.state = {
        Child: null
      }
    }

    async componentDidMount() {
      const { default: Child } = await loadComponent()
      if (this.unmount) return
      this.setState({
        Child
      })
    }

    componentWillUnmount() {
      this.unmount = true
    }
    
    render() {
      const { Child } = this.state
      return (
        Child
         ? <Child {...this.props} />
         : placeholder
      )
    }
  }
}