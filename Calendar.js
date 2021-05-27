import styles from './css/Calendar.module.css'
import HabitRow from './HabitRow'
import HabitInput from './HabitInput'
import { days, firstDayOfWeek, lastWeek, nextWeek, isToday } from './DateHelper'

import React from 'react';

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    let startDate = new Date();
    startDate = firstDayOfWeek(startDate);

    this.state = {
      addingHabit: false,
      i: 0,
      j: 0,
      startDate: startDate,
      reordering: false,
      selected: null,
      habits: []
    };

    this.back = this.back.bind(this);
    this.forward = this.forward.bind(this);
    this.swap = this.swap.bind(this);
  }

  back() {
    this.setState({ startDate: lastWeek(this.state.startDate) });
  }

  forward() {
    this.setState({ startDate: nextWeek(this.state.startDate) });
  }

  stopReordering() {
    this.props.swapHabits(this.state.i, this.state.j);
    this.setState({ reordering: false });
  }

  startReordering(selected) {
    let habits = [...this.props.habits];
    let index = habits.indexOf(selected);
    this.setState({
      i: index,
      j: index,
      habits: habits,
      reordering: true,
      selected: selected
    });
  }

  swap(i) {
    let habits = [...this.state.habits];
    let index = habits.indexOf(this.state.selected);
    habits.splice(index, 1);
    habits.splice(i, 0, this.state.selected);
    this.setState({ j: i, habits: habits })
  }

  buildHeader() {
    let tableHeader = [];
    let date = new Date(this.state.startDate);
    for (let i = 0; i < 7; i++) {
      let classes = [styles.dateHeader, isToday(date) ? styles.today : ""].join(' ');
      let dateLabel = date.getDate();
      if (i === 0) {
        dateLabel = `${date.getMonth() + 1}/${dateLabel}`;
      }
      tableHeader.push((<td className={classes}>{dateLabel}<br />{days[date.getDay()]}</td>));
      date.setDate(date.getDate() + 1);
    }
    return tableHeader;
  }

  render() {
    let habitRows = [];

    if (this.state.reordering) {
      for (let i = 0; i < this.state.habits.length; i++) {
        let isSelected = this.state.habits[i] === this.state.selected;
        habitRows.push((
          <HabitRow
            selected={isSelected}
            onMouseEnter={isSelected ? null : () => this.swap(i)}
            updateHabit={this.props.updateHabit}
            deleteHabit={this.props.deleteHabit}
            toggleCheck={this.props.toggleCheck}
            habit={this.state.habits[i]}
            startDate={this.state.startDate}
          />));
      }
    } else {
      for (let i = 0; i < this.props.habits.length; i++) {
        habitRows.push((
          <HabitRow
            selected={false}
            onClick={(e) => { e.preventDefault(); this.startReordering(this.props.habits[i]) }}
            updateHabit={this.props.updateHabit}
            deleteHabit={this.props.deleteHabit}
            toggleCheck={this.props.toggleCheck}
            habit={this.props.habits[i]}
            startDate={this.state.startDate}
          />));
      }
    }
    return (
      <>
        {this.state.adding && <HabitInput cancelAdd={() => this.setState({ adding: false })} addHabit={this.props.addHabit} />}
        <div
          onMouseUp={() => { if (this.state.reordering) this.stopReordering() }}
          onMouseLeave={() => { if (this.state.reordering) this.stopReordering() }}
          className={styles.calendar}>
          <table>
            <thead className={styles.calendarHeader}>
              <tr>
                <td></td>
                <td></td>
                <td colSpan={7}>
                  <div className={styles.calendarButtons} >
                    <a href="" onClick={(e) => (e.preventDefault(), this.back())}> {'<'} last week</a>
                    {!this.state.adding && <a href="" onClick={(e) => (e.preventDefault(), this.setState({ adding: true }))} >+habit </a>}
                    <a href="" onClick={(e) => (e.preventDefault(), this.forward())}>next week {'>'} </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                {this.buildHeader()}
                <td colSpan={4}className={styles.spacer}></td>
              </tr>
            </thead>
            <tbody>
              {habitRows}
            </tbody>
          </table>
        </div>
      </>);
  }

}

export default Calendar;