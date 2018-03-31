import React from 'react'
import { Row, Col } from 'antd'
import echarts from 'echarts'
import axios from 'axios'

export default class Chart extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let pieOption = {
      title: {
        text: '电影类型',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        bottom: 'left',
        type: 'scroll',
        data: []
      },
      series: [
        {
          name: '类型',
          type: 'pie',
          label: false,
          radius: '55%',
          center: ['50%', '60%'],
          data: [],
          itemStyle: {
            emphasis: {
              shadowBlur: 50,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    axios({
      url: 'api/admin/get_pie'
    }).then((res) => {
      res = res.data
      if (res.code === 0) {
        pieOption.legend.data = res.data.keysArr
        pieOption.series[0].data = res.data.valuesArr
        const pieChart = echarts.init(document.getElementById('pie'))
        pieChart.setOption(pieOption)
      }
    })
    const lineOption = {
      title: {
        left: 'center',
        text: '电影上映日期分布'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        data: []
      },
      yAxis: {
        splitLine: { show: false }
      },
      series: {
        type: 'line',
        name: 'count',
        showSymbol: false,
        data: []
      }
    };
    axios({
      url: 'api/admin/get_line'
    }).then((res) => {
      res = res.data
      if (res.code === 0) {
        lineOption.xAxis.data = res.data.dateList
        lineOption.series.data = res.data.valueList
        const lineChart = echarts.init(document.getElementById('line'))
        lineChart.setOption(lineOption)
      }
    })
  }

  render() {
    return (
      <div>
        <Row style={{borderBottom:'1px solid #000'}}>
          <Col span={12} style={{ height: '300px', borderRight: '1px solid #000' }}>
            <div id='pie' style={{ width: '80%', height: '100%', margin:'0 auto'}} ></div>
          </Col>
          <Col span={12} style={{ height: '300px' }}>
            <div id='line' style={{ width: '100%', height: '100%' }}></div>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ height: '300px' }}>
            <div id='userchart' style={{ width: '100%', height: '100%' }}></div>
          </Col>
        </Row>
      </div>
    )
  }
}