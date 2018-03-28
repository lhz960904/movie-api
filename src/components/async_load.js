import React from 'react'
import Layout from '../components/layout'
import Loading from './loading'

export default (loadComponent, ) => {
  return class AsyncComponent extends React.Component {
    unmount = false
    constructor(props) {
      super(props)
      this.state = {
        Child: null,
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
        <Layout>
          {
            Child
              ? <Child {...this.props} />
              : <Loading />
          }
        </Layout> 
      )
    }
  }
}