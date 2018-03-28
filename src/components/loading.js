import React from 'react'
import { Spin } from 'antd'

export default class Loading extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <Spin 
          size="large" 
          tip={this.props.tip || '正在加载'} 
        >
        </Spin>
      </div>
    )
  }
}