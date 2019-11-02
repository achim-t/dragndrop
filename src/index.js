import React from 'react'
import ReactDOM from 'react-dom'
import '@atlaskit/css-reset'
import { DragDropContext } from 'react-beautiful-dnd'
import initialData from './initial-data'
import Column from './Column'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
`

class App extends React.Component {
  state = initialData

  onDragEnd = result => {
    const { destination, source, draggableId } = result
    if (!destination) {
      return
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
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
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Container>
          {this.state.columnOrder.map(columnId => {
            const column = this.state.columns[columnId]
            const tasks = column.taskIds.map(taskId => this.state.tasks[taskId])

            return <Column key={column.id} column={column} tasks={tasks} />
          })}
        </Container>
      </DragDropContext>
    )
  }
}
ReactDOM.render(<App />, document.getElementById('root'))
