let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
require('echarts/lib/chart/pie')
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/legendScroll')

export default {
  BugQueryChartData (data) {
    if (!data) {
      return ''
    }
    let chartData = {
      "name": [],
      "value": []
    }
    let a1a = new Array()
    let a2a = new Array()
    for (let i in data) {
      let d = data[i]['name']
      let n = data[i]['value']
      a1a.push(d)
      a2a.push(n)
    }
    chartData['name'] = a1a
    chartData['value'] = a2a
    return chartData
  },

  BugCreateDailyChartData (data) {
    if (!data) {
      return ''
    }
    let chart_data = {
      "datetime": [],
      "num": []
    }
    let tmp_data = data['data']
    let a1 = new Array()
    let a2 = new Array()
    for (let i in tmp_data) {
      let d = tmp_data[i]['datetime']
      let n = tmp_data[i]['num']
      if (data['type'] === 'week') {
        a1.push('周'+(d-1))
      } else if (data['type'] === 'year') {
        a1.push(d + '月') 
      } else if (data['type'] === 'today') {
        a1.push(d + ':00') 
      } else {
        a1.push(d)
      } 
      a2.push(n)
    }
    chart_data['datetime'] = a1
    chart_data['num'] = a2
    return chart_data
  },

  CharBarWidth (data) {
    let width = '24%'
    if (data) {
      if (data.length === 1) { width = '5%' }
      if (data.length === 2) { width = '10%' }
      if (data.length === 3) { width = '15%' }
      if (data.length === 4) { width = '20%' }
      if (data.length >= 5) { width = '22%' }
    }
    return width
  },
  BigCharBarWidth (data) {
    let width = '24%'
    if (data) {
      if (data.length === 1) { width = '5%' }
      if (data.length === 2) { width = '10%' }
      if (data.length === 3) { width = '13%' }
      if (data.length === 4) { width = '17%' }
      if (data.length >= 5) { width = '20%' }
    }
    return width
  },
  // line图
  ChartLine () {
    let args = arguments
    let ChartLine = echarts.init(document.getElementById(args[0]))
    ChartLine.setOption({
      title: {
        text: args[3],
        left: 'center',
        textStyle: {
          color: '#000',
          fontWeight: '300'
        }
      },
      xAxis: {
        type: 'category',
        data: args[1],
        axisLine: {
          show: true,
          lineStyle: {
            color: "#eee"
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          fontSize: 13,
          color: '#616161'
        }
      },
      yAxis: {
        show: false
      },
      // color: ['#EF7030'],
      series: [{
        data: args[2],
        type: 'line',
        smooth: true,
        label: {
          show: true,
          fontSize: 10
        }
      }]
    })
  },

  ChartBarStack () {
    let args = arguments
    let myChart = echarts.init(document.getElementById(args[0]))
    myChart.setOption({
      legend: {
        data: ['已解决', '未解决']
      },
      yAxis:  {
        show: false
      },
      xAxis: {
        type: 'category',
        data: args[1],
        axisLine: {
          show: true,
          lineStyle: {
            color: "#eee"
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          fontSize: 13,
          color: '#616161'
        }
      },
      series: [
          {
            name: '已解决',
            type: 'bar',
            stack: '数量',
            barWidth: args[4],
            label: {
              normal: {
                  show: true,
                  position: 'insideBottom'
              }
            },
            itemStyle: {
              normal: {
                color: function(params) { 
                  let colorList = ['#66C2CB']
                  return colorList[params.dataIndex]
                },
                barBorderRadius: [ 1,1,1,1 ]
              }
            },
            data: args[2]
          },
          {
            name: '未解决',
            type: 'bar',
            stack: '数量',
            label: {
              normal: {
                show: true,
                position: 'insideBottom'
              }
            },
            itemStyle: {
              normal: {
                color: function(params) { 
                  let colorList = ['#F48B31']
                  return colorList[params.dataIndex]
                },
                barBorderRadius: [ 1,1,1,1 ]
              }
            },
            data: args[3]
          }
      ]
    })
  },

  // 统计图：柱状图
  ChartBar () {
    let args = arguments
    let myChart = echarts.init(document.getElementById(args[0]))
    myChart.setOption({
      title: {
        text: args[4],
        left: 'center',
        textStyle: {
          color: '#000',
          fontWeight: '300'
        }
      },
      xAxis: {
        data: args[1],
        type: 'category',
        fontSize: '16',
        axisLine: {
          show: true,
          lineStyle: {
            color: "#eee"
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          fontSize: 13,
          color: '#616161'
        }
      },
      yAxis: {
        show: false
      },
      series: [{
        barWidth: args[3],
        name: '数量',
        type: 'bar',
        data: args[2],
        label: {
          show: true,
          position: 'top',
          fontSize: 15
        },
        itemStyle: {
          normal: {
            color: function(params) { 
              let colorList = ['#F48B31','#66C2CB','#EF7030','#FBB731','#51C1F0']
              return colorList[params.dataIndex]
            },
            barBorderRadius: [ 15,15,1,1 ]
          }
        }
      }]
    })
  },

  ChartPie () {
    let args = arguments
    console.log(args)
    let myChart = echarts.init(document.getElementById(args[0]))
    myChart.setOption({
      title : {
        text: args[2],
        x:'center'
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        selected: args[1]
      },
      color:['#F48B31','#66C2CB','#EF7030','#FBB731','#51C1F0'],
      series : [
        {
          name: '姓名',
          type: 'pie',
          radius : '55%',
          center: ['50%', '50%'],
          selectedMode: 'single',
          data: args[1],
          // roseType: 'radius',
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          // animationType: 'scale',
          // animationEasing: 'elasticOut',
          // animationDelay: function (idx) {
          //   return Math.random() * 200;
          // }
        }
      ]
    })
  }
}