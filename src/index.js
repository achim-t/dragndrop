import React from 'react'
import ReactDOM from 'react-dom'
import '@atlaskit/css-reset'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import initialData from './initial-data'
import Column from './Column'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
`
class InnerList extends React.PureComponent {
  render() {
    const { column, taskMap, index, isDropDisabled } = this.props
    const tasks = column.taskIds.map(taskId => taskMap[taskId])
    return (
      <Column
        column={column}
        tasks={tasks}
        index={index}
        isDropDisabled={isDropDisabled}
      />
    )
  }
}

class App extends React.Component {
  state = initialData

  onDragStart = start => {
    const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId)

    this.setState({
      homeIndex
    })
  }
  onDragEnd = result => {
    this.setState({
      homeIndex: null
    })
    const { destination, source, draggableId, type } = result
    if (!destination) {
      return
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    if (type === 'column') {
      const newColumnOrder = Array.from(this.state.columnOrder)
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)
      this.setState({
        ...this.state,
        columnOrder: newColumnOrder
      })
      return
    }

    const sourceColumn = this.state.columns[source.droppableId]
    const destinationColumn = this.state.columns[destination.droppableId]

    const newSourceTaskIds = Array.from(sourceColumn.taskIds)
    newSourceTaskIds.splice(source.index, 1)
    if (sourceColumn === destinationColumn) {
      newSourceTaskIds.splice(destination.index, 0, draggableId)
    }
    const newSourceColumn = {
      ...sourceColumn,
      taskIds: newSourceTaskIds
    }
    if (sourceColumn === destinationColumn) {
      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newSourceColumn.id]: newSourceColumn
        }
      }
      this.setState(newState)
    } else {
      const newDestinationTaskIds = Array.from(destinationColumn.taskIds)
      newDestinationTaskIds.splice(destination.index, 0, draggableId)
      const newDestinationColumn = {
        ...destinationColumn,
        taskIds: newDestinationTaskIds
      }

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newSourceColumn.id]: newSourceColumn,
          [newDestinationColumn.id]: newDestinationColumn
        }
      }
      this.setState(newState)
    }
  }

  render() {
    return (
      <DragDropContext
        onDragEnd={this.onDragEnd}
        onDragStart={this.onDragStart}
      >
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {provided => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              {this.state.columnOrder.map((columnId, index) => {
                const column = this.state.columns[columnId]
                // const tasks = column.taskIds.map(
                //   taskId => this.state.tasks[taskId]
                // )

                const isDropDisabled = index < this.state.homeIndex

                return (
                  <InnerList
                    key={column.id}
                    column={column}
                    taskMap={this.state.tasks}
                    isDropDisabled={isDropDisabled}
                    index={index}
                  />
                )
              })}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}
ReactDOM.render(<App />, document.getElementById('root'))
