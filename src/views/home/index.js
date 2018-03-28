import React from 'react'
import axios from 'axios'
import moment from 'moment'
import { Table, Divider } from 'antd'
const ERROK = 0
const PREFIX = 'http://m.movie.kyriel.cn/'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: []
    }
  }

  async componentDidMount() {
    const res = await this.getAllMovies()
    if (res.code === 0) {
      this.setState({
        movies: res.data.movies 
      })
    }
  }

  getAllMovies() {
    return new Promise((resolve, reject) => {
      axios({
        url: '/movies'
      }).then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  }

  render() {
    let movies = []
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
      render: (text, record) => <a href={`${PREFIX}${record._id}`}>{text}</a>,
    },{
      title: '评分',
      dataIndex: 'rate',
      key: 'rate'
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
    }]
    return (
      <div>
        <Table columns={columns} dataSource={movies} />
      </div>
    )
  }
}