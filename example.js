const taskStatus = {
  SUCCEEDED: 'bar',
  FAILED: 'bar-failed',
  RUNNING: 'bar-running',
  KILLED: 'bar-killed',
}

let taskNames = [ 'D Job', 'P Job', 'E Job', 'A Job', 'N Job' ]
let tasks = [
  { startDate: new Date("Sun Dec 09 00:00:45 EST 2012"), endDate: new Date("Sun Dec 09 02:36:45 EST 2012"), taskName: "E Job", status: "RUNNING" },
  { startDate: new Date("Sun Dec 09 08:49:53 EST 2012"), endDate: new Date("Sun Dec 09 06:34:04 EST 2012"), taskName: "D Job", status: "RUNNING" },
  { startDate: new Date("Sun Dec 09 03:27:35 EST 2012"), endDate: new Date("Sun Dec 09 03:58:43 EST 2012"), taskName: "P Job", status: "SUCCEEDED" },
  { startDate: new Date("Sun Dec 09 03:27:35 EST 2012"), endDate: new Date("Sun Dec 09 03:58:43 EST 2012"), taskName: "N Job", status: "KILLED" },
]
let format = '%H:%M'
let timeDomainString = '1day'

let gantt = d3.gantt()
  .height(450)
  .width(800)
  .taskTypes(taskNames)
  .taskStatus(taskStatus)
  .tickFormat(format)
    
// gantt.timeDomainMode("fixed");
changeTimeDomain(timeDomainString)
gantt(tasks)

function changeTimeDomain(timeDomain) {
  this.timeDomainString = timeDomain
  let startDate
  let endDate = getEndDate()

  switch (timeDomain) {
    case '1hr':
      format = '%H:%M:%S'
      startDate = d3.timeHour.offset(endDate, -1)
      break
    case '3hr':
      format = '%H:%M'
      startDate = d3.timeHour.offset(endDate, -3)
      break
    case '6hr':
      format = '%H:%M'
      startDate = d3.timeHour.offset(endDate, -6)
      break
    case '1week':
      format = '%a %H:%M'
      startDate = d3.timeDay.offset(endDate, -7)
      break
    default:
      format = '%H:%M'
      startDate = d3.timeDay.offset(endDate, -1)
  }

  gantt.timeDomain([ startDate, endDate])
  gantt.tickFormat(format)
  gantt.redraw(tasks)
}

function getEndDate() {
  let lastEndDate = Date.now()
  if (tasks.length > 0) {
    lastEndDate = tasks[tasks.length - 1].endDate
  }
  return lastEndDate
}

function addTask() {
  let lastEndDate = getEndDate()
  let taskStatusKeys = Object.keys(taskStatus)
  let taskStatusName = taskStatusKeys[Math.floor(Math.random() * taskStatusKeys.length)]
  let taskName = taskNames[Math.floor(Math.random() * taskNames.length)]

  tasks.push({
    startDate: d3.timeHour.offset(lastEndDate, Math.ceil(1 * Math.random())),
    endDate: d3.timeHour.offset(lastEndDate, (Math.ceil(Math.random() * 3)) + 1),
    taskName: taskName,
    status: taskStatusName,
  })

  changeTimeDomain(timeDomainString)
  gantt.redraw(tasks)
}

function removeTask() {
  tasks.pop()
  changeTimeDomain(timeDomainString)
  gantt.redraw(tasks)
}