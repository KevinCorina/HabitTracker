import styles from './css/HabitRow.module.css';

import CheckCell from './CheckCell'
import { toIsoDate, fromIsoDate, firstDayOfMonth, nextMonth, nextWeek } from './DateHelper'

import React from 'react';

class HabitRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editing: false, isMouseIn: false }
    this.cancelEditing = this.cancelEditing.bind(this);
  }

  cancelEditing() {
    this.setState({ editing: false });
  }

  countCompleted() {
    let from, to;
    if (this.props.habit.repeat == "week") {
      from = this.props.startDate;
      to = new Date(nextWeek(from));
    } else {
      from = firstDayOfMonth(this.props.startDate);
      to = nextMonth(from);
    }
    return this.props.habit.done.filter(o => (from < fromIsoDate(o) && fromIsoDate(o) < to)).length;
  }

  render() {
    if (this.state.editing) {
      return (<HabitEditor
        habit={this.props.habit}
        updateHabit={this.props.updateHabit}
        cancelEditing={this.cancelEditing} />);
    } else {

      let checkCells = [];
      let date = new Date(this.props.startDate);
      let today = new Date();

      for (let i = 0; i < 7; i++) {
        if (date > today) {
          checkCells.push((<td className={styles.future}>•</td>));
        } else {
          let checkIndex = this.props.habit.done.findIndex(o => o == toIsoDate(date));
          checkCells.push((
            <CheckCell
              id={this.props.habit.id + toIsoDate(date)}
              date={new Date(date)}
              isChecked={checkIndex != -1}
              habitId={this.props.habit.id}
              over={this.state.isMouseIn || this.props.selected}
              toggleCheck={this.props.toggleCheck}
            />
          ));
        }
        date.setDate(date.getDate() + 1);
      }

      let className = styles.habitRow;
      let style = {};
      if (this.props.selected) {
        className = styles.selected;
        //not certain why this is necessary.
        //.selected already includes the line 
        //  cursor: grabbing;
        //but it seems like something else is overriding it
        style = { cursor: "grabbing" };
      }

      return (
        <tr className={className} style={style}
          onMouseUp={() => this.setState({ isMouseIn: true })}
          onMouseEnter={this.props.onMouseEnter ? this.props.onMouseEnter : () => this.setState({ isMouseIn: true })}
          onMouseLeave={() => this.setState({ isMouseIn: false })}>
          <td>
          </td>
          <td className={styles.habitLabel}>
            {this.props.habit.name}
          </td>
          {checkCells}
          <ProgressInfo completed={this.countCompleted()} target={this.props.habit.target} />
          <td className={styles.editButton} style={style} onClick={() => this.setState({ isMouseIn: false, editing: true })} >
            {this.state.isMouseIn ? "✎" : ""}
          </td>
          <td className={styles.editButton} style={style} onClick={() => this.props.deleteHabit(this.props.habit.id)}>
            {this.state.isMouseIn ? "×" : ""}
          </td>
          <td className={styles.handle} style={style} onMouseDown={this.props.onClick}>
            {this.state.isMouseIn ? "↕" : ""}
          </td>
          <td>
          </td>
        </tr>);
    }
  }
}
class ProgressInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isMouseIn: false }
  }

  render() {
    return (
      <td
        className={styles.progress}
        onMouseEnter={() => this.setState({ isMouseIn: true })}
        onMouseLeave={() => this.setState({ isMouseIn: false })}
      >
        {this.state.isMouseIn
          ? <>{this.props.completed}/{this.props.target}</>
          : <>{Math.trunc(100 * this.props.completed / this.props.target)}%</>}

      </td>
    );
  }
}

class HabitEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = { habitName: props.habit.name, habitTarget: props.habit.target, habitRepeat: props.habit.repeat };
  }
  render() {
    return <>
      <tr className={styles.habitEditor}>
        <td>
        </td>

        <td className={styles.habitLabel}>
          <input
            onChange={event => this.setState({ habitName: event.target.value })}
            value={this.state.habitName}
            placeholder="habit name"
          />
        </td>
        <td colSpan={5} >
          <input
            value={this.state.habitTarget}
            type="number" style={{ width: "2em" }}
            onChange={event => this.setState({ habitTarget: event.target.value })} />
          &nbsp; / &nbsp;
          <select onChange={event => this.setState({ habitRepeat: event.target.value })} value={this.state.habitRepeat}>
            <option value="week">week</option>
            <option value="month">month</option>
          </select>
        </td>
        <td colSpan={3} >
          <a href=""
            onClick={(e) => (
              e.preventDefault(),
              this.props.updateHabit(this.props.habit.id, this.state.habitName, this.state.habitTarget, this.state.habitRepeat),
              this.props.cancelEditing())
            }
          >done</a>
        </td>
        <td colSpan={3} >
          <a href="" onClick={(e) => (e.preventDefault(), this.props.cancelEditing())}>cancel</a>
        </td>
      </tr>
    </>;
  }

}

export default HabitRow;
