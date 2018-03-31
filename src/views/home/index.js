import React from 'react'
import axios from 'axios'
import moment from 'moment'
import { Table, message } from 'antd'
const ERROK = 0
const PREFIX = 'http://m.movie.kyriel.cn/'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
      sortedInfo: null
    }
  }

  async componentDidMount() {
    const res = await this.getAllMovies()
    if (res.code === 0) {
      this.setState({
        movies: res.data.movies 
      })
    } else {
      window.location.href = `/login`
    }
  }

  getAllMovies() {
    return new Promise((resolve, reject) => {
      axios({
        url: '/api/admin/get_all_movies'
      }).then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  }

  handleClick = (id) => {
    const idx = this.state.movies.findIndex((item) => item._id == id)
    let movies = this.state.movies
    axios({
      url: `/api/admin/delete_movie/${id}`,
      method: 'delete'
    }).then((res) => {
      res = res.data
      if (res.code == 0) {
        movies.splice(idx, 1)
        this.setState({
          movies,
        })
        message.success(res.errmsg);
      } else {
        message.error(res.errmsg);
      }
    }).catch((err) => {
      message.error('删除失败');
    })
  }
  
  handleChange = (pagination, filters, sorter) => {
    this.setState({
      sortedInfo: sorter,
    });
  }

  render() {
    let movies = []
    let { sortedInfo } = this.state
    sortedInfo = sortedInfo || {}
    this.state.movies.forEach((item, index) => {
      const { title, rate, doubanId, movieTypes, summary, pubdate, _id} = item
      movies.push({
        key: index,
        id: _id,
        name: title,
        rate,
        doubanId,
        movieTypes: movieTypes.join('/'),
        summary,
        pubdate: pubdate[pubdate.length - 1]['date']
      })
    })
    const columns = [{
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },{
      title: '名字',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <a href={`${PREFIX}${record.id}`}  target="_blank">{text}</a>,
    },{
      title: '评分',
      dataIndex: 'rate',
      key: 'rate',
      sorter: (a, b) => a.rate - b.rate,
      sortOrder: sortedInfo.columnKey === 'rate' && sortedInfo.order
    },{
      title: '豆瓣Id',
      dataIndex: 'doubanId',
      key: 'doubanId'
    },{
      title: '类型',
      dataIndex: 'movieTypes',
      key: 'movieTypes',
    },{
      title: '简介',
      dataIndex: 'summary',
      key: 'summary',
        render: (text) => <span title={text}>{text.substr(0, 6) + '...'}</span>
    },{
      title: '上线时间',
      dataIndex: 'pubdate',
      key: 'pubdate',
      render: text => moment(text).format('YYYY-MM-DD')
    },{
      title: '操作',
      dataIndex: 'delete',
      key: 'delete',
      render: (text, record) => <a onClick={this.handleClick.bind(this,record.id)}>删除</a>
    }]
    return (
      <div>
        <Table columns={columns} dataSource={movies} onChange={this.handleChange}/>
      </div>
    )
  }
}