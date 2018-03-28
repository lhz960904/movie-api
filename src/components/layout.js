import React from 'react'
import { Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd'
const { Header, Content, Footer, Sider } = Layout
const SubMenu = Menu.SubMenu

export default class Layouts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false
    }
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed })
  }

  componentDidMount() {
    
  }
  render() {
    const titleSty = this.state.collapsed ? {fontSize: '15px'} : {}
    const { match } = this.props.children.props
    const routes = match ? match.path.split('/').slice(1) : routes
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo">
            <h1 style={titleSty}>CQ后台</h1>
          </div>
          <Menu theme="dark" selectedKeys={routes} mode="inline">
            <Menu.Item key="movie">
              <Link to={'/movie'}>
                <Icon type="video-camera" />
                <span>电影信息</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="user">
              <Link to={'/user'}>
                <Icon type="user" />
                <span>用户信息</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="chart">
              <Link to={'/chart'}>
                <Icon type="pie-chart" />
                <span>查看数据</span>
              </Link>
              
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              {
                routes
                  ? routes.map((item) => (
                    <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
                  ))
                  : <Breadcrumb.Item>movie</Breadcrumb.Item>
              }
            </Breadcrumb>
            <div style={{ position: 'relative', padding: 24, background: '#fff', minHeight: 360 }}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            CQ 微剧 ©2018 Created by lihaoze
          </Footer>
        </Layout>
      </Layout>
    )
  }
}