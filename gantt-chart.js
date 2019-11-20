
d3.gantt = function() {
  const FIT_TIME_DOMAIN_MODE = 'fit'
  const FIXED_TIME_DOMAIN_MODE = 'fixed'

  let margin = { top: 20, right: 40, bottom: 20, left: 150 }
  let height = document.body.clientHeight - margin.top - margin.bottom - 5
  let width = document.body.clientWidth - margin.right - margin.left - 5

  let timeDomainStart = d3.timeDay.offset(new Date(), -3)
  let timeDomainEnd = d3.timeHour.offset(new Date(), +3)
  let timeDomainMode = FIXED_TIME_DOMAIN_MODE // fixed or fit
  let taskTypes = []
  let taskStatus = []
  let x, y, xAxis, yAxis
  let tickFormat = '%H:%M'

  let keyFunction = (d) => d.startDate + d.taskName + d.endDate
  let rectTransform = (d) => 'translate(' + x(d.startDate) + ',' + y(d.taskName) + ')'

  function initAxis() {
    x = d3.scaleTime()
      .domain([ timeDomainStart, timeDomainEnd ])
      .range([ 0, width ])
      .clamp(true)

    y = d3.scaleBand()
      .domain(taskTypes)
      .range([ 0, height - margin.top - margin.bottom ])
      .padding(0.5)

    xAxis = d3.axisBottom()
      .scale(x)
      .tickFormat(d3.timeFormat(tickFormat))
      .tickSize(8)
      .tickPadding(8)

    yAxis = d3.axisLeft()
      .scale(y)
      .tickSize(0)
  }

  function initTimeDomain() {
    if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
      if (tasks === undefined || tasks.length < 1) {
        timeDomainStart = d3.timeDay.offset(new Date(), -3)
        timeDomainEnd = d3.timeHour.offset(new Date(), +3)
        return
      }
      tasks.forEach(task => {
        timeDomainStart = d3.min([ timeDomainStart, task.startDate ])
        timeDomainEnd = d3.min([ timeDomainEnd, task.endDate ])
      })
    }
  }

  function gantt(tasks) {
    initTimeDomain()
    initAxis()

    let svg = d3.select('body')
      .append('svg')
        .attr('class', 'chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('class', 'gantt-chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
    
    svg.selectAll('.chart')
      .data(tasks, keyFunction).enter()
      .append('rect')
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('class', d => { 
        if (taskStatus[d.status] == null) { return 'bar' }
        return taskStatus[d.status]
      }) 
      .attr('y', 0)
      .attr('transform', rectTransform)
      .attr('height', 70)
      .attr('width', d => x(d.endDate) - x(d.startDate))

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
      .transition()
      .call(xAxis)

    svg.append('g')
      .attr('class', 'y axis')
      .transition()
      .call(yAxis)

    return gantt
  }

  gantt.redraw = function(tasks) {
    initTimeDomain()
    initAxis()

    let svg = d3.select('svg')
    let ganttChartGroup = svg.select('.gantt-chart')
    let rect = ganttChartGroup.selectAll('rect').data(tasks, keyFunction)

    rect.enter()
      .insert('rect', ':first-child')
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('class', (d) => { 
        return taskStatus[d.status] == null ? 'bar' : taskStatus[d.status]
      })
      .transition()
      .attr('y', 0)
      .attr('transform', rectTransform)
      .attr('height', y.bandwidth())
      .attr('width', d => x(d.endDate) - x(d.startDate)) 

    rect.merge(rect).transition()
      .attr('transform', rectTransform)
      .attr('height', y.bandwidth())
      .attr('width', d => x(d.endDate) - x(d.startDate)) 

    rect.exit().remove()

    svg.select('.x').transition().call(xAxis)
    svg.select('.y').transition().call(yAxis)

    return gantt
  }

  gantt.margin = function (value) {
    if (!arguments.length) {
      return margin
    }
      
    margin = value
    return gantt
  }

  gantt.timeDomain = function (value) {
    if (!arguments.length) {
      return [ timeDomainStart, timeDomainEnd ]
    }
    timeDomainStart = +value[0]
    timeDomainEnd = +value[1]
    return gantt
  }

  gantt.timeDomainMode = function (value) {
    if (!arguments.length)
      return timeDomainMode
    timeDomainMode = value
    return gantt
  }

  gantt.taskStatus = function (value) {
    if (!arguments.length)
      return taskStatus
    taskStatus = value
    return gantt
  }

  gantt.taskTypes = function (value) {
    if (!arguments.length)
      return taskTypes
    taskTypes = value
    return gantt
  }

  gantt.width = function (value) {
    if (!arguments.length)
      return width
    width = +value
    return gantt
  }

  gantt.height = function (value) {
    if (!arguments.length)
      return height
    height = +value
    return gantt
  }

  gantt.tickFormat = function (value) {
    if (!arguments.length)
      return tickFormat
    tickFormat = value
    return gantt
  }

  return gantt
}
