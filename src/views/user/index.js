import React from 'react'
import moment from 'moment'
import axios from 'axios'
import { Table, message } from 'antd'

export default class User extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: []
    }
  }

  async componentDidMount() {
    const res = await this.getAllUsers()
    if (res.code === 0) {
      this.setState({
        users: res.data.users
      })
    } else {
      window.location.href = `/login`
    }
  }

  getAllUsers() {
    return new Promise((resolve, reject) => {
      axios({
        url: '/api/admin/get_all_users'
      }).then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  }

  handleClick = (id) => {
    const idx = this.state.users.findIndex((item) => item._id == id)
    let users = this.state.users
    axios({
      url: `/api/admin/delete_movie/${id}`,
      method: 'delete'
    }).then((res) => {
      res = res.data
      if (res.code == 0) {
        movies.splice(idx, 1)
        this.setState({
          users,
        })
        message.success(res.errmsg);
      } else {
        message.error(res.errmsg);
      }
    }).catch((err) => {
      message.error('删除失败');
    })
  }

  render() {
    let users = []
    this.state.users.forEach((item, index) => {
      const { _id, username, email, meta} = item
      users.push({
        key: index,
        id: _id,
        name: username,
        email,
        createTime: moment(meta.updatedAt).format('YYYY-MM-DD hh:mm:ss')
      })
    })
    const columns = [{
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '名字',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email'
    }, {
      title: '注册时间',
      dataIndex: 'createTime',
      key: 'createTime'
    }, {
      title: '操作',
      dataIndex: 'delete',
      key: 'delete',
      render: (text,recode) => <a onClick={this.handleClick.bind(this,recode.id)}>删除</a>
    }]
    return (
      <div>
        <Table columns={columns} dataSource={users} />
      </div>
    )
  }
}