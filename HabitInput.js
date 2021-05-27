import styles from './css/HabitInput.module.css';

import React from 'react';

class HabitInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      habitName: "",
      habitTarget: 5,
      habitRepeat: "week"
    };
  }

  render() {
    return (
      <div className={styles.habitInput}>
        <a href="" onClick={(e) => (e.preventDefault(), this.props.cancelAdd())} className={styles.hideButton}>hide</a><br />
        I want to &nbsp;
        <input
          onChange={event => this.setState({ habitName: event.target.value })}
          value={this.state.habitName}
          placeholder="habit name"
          value={this.state.habitName}
        />
          &nbsp;
        <input
          value={this.state.habitTarget}
          type="number"
          onChange={event => this.setState({ habitTarget: event.target.value })} />
          &nbsp; time(s) every &nbsp;
        <select onChange={event => this.setState({ habitRepeat: event.target.value })} value={this.state.habitRepeat}>
          <option value="week">week</option>
          <option value="month">month</option>
        </select>.
        <br />

        <a href="" className={styles.addButton} onClick={(event) => {
          event.preventDefault();
          this.props.addHabit(this.state.habitName, this.state.habitTarget, this.state.habitRepeat);
          this.setState({ habitName: "", habitTarget: 5, habitRepeat: "week" });
        }}>add</a>
        <br />
        <br />
      </div>
    );
  }
}


export default HabitInput;