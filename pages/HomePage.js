import '../css/App.css';
import {toIsoDate } from '../DateHelper'
import Calendar from '../Calendar'

import React from 'react';
import { listHabits } from '../graphql/queries.js'
import { createHabit, deleteHabit, updateHabit } from '../graphql/mutations.js'
import { Link } from 'react-router-dom'
import { API, Auth, graphqlOperation } from 'aws-amplify'

//TODO: is there a better data structure to store habits in?
//a dictionary would probably make looking up a habit by id much easier... 

//TODO: re-introduce the month view
// let isWeekView = true;

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      habits: [],
      checks: []
    };
    this.swapHabits = this.swapHabits.bind(this);
    this.deleteHabit = this.deleteHabit.bind(this);
    this.addHabit = this.addHabit.bind(this);
    this.toggleCheck = this.toggleCheck.bind(this);
    this.updateHabit = this.updateHabit.bind(this);
  }

  async fetchHabits() {
    try {
      const habitData = await API.graphql(graphqlOperation(listHabits))
      let habits = habitData.data.listHabits.items;
      //TODO: you can probably configure your GraphQL queries to do this sort for you (GSI?)
      habits.sort(function (a, b) { return (a.ord > b.ord) ? 1 : ((b.ord > a.ord) ? -1 : 0) });
      this.setState({ habits: habits });
    } catch (err) {
      console.log('Error fetching habits:', err)
    }
  }

  async deleteHabit(id) {
    try {
      let habits = [... this.state.habits];
      let habitIndex = habits.findIndex(h => h.id == id);
      habits.splice(habitIndex, 1);
      this.setState({ habits: habits });

      await API.graphql(graphqlOperation(deleteHabit, { input: { id: id } }));
    } catch (err) {
      console.log('Error deleting habit:', err);
    }
  }

  async deleteCheck(id, date) {
    try {
      //what's the tradeoff of find + splice vs filter?
      let habits = [... this.state.habits];
      let habitIndex = habits.findIndex(h => h.id == id);
      let habit = habits[habitIndex]
      habit.done.splice(habit.done.indexOf(toIsoDate(date)), 1);

      this.setState({ habits: habits });

      await API.graphql(graphqlOperation(updateHabit, { input: { id: id, done: [...habit.done] } }))
    } catch (err) {
      console.log('Error deleting check:', err);
    }
  }

  async addHabit(habitName, habitTarget, habitRepeat) {
    try {
      let ord = 0;
      if (this.state.habits.length > 0) {
        ord = this.state.habits[this.state.habits.length - 1].ord + 1
      }
      let habit = { name: habitName, target: habitTarget, repeat: habitRepeat, done: [], ord: ord };
      let habits = [...this.state.habits];
      habits.push(habit);
      this.setState({ habits: habits });
      
      await API.graphql(graphqlOperation(createHabit, { input: habit }));
      this.fetchHabits();
    } catch (err) {
      console.log('Error creating habit:', err);
    }
  }

  async addCheck(id, date) {
    try {
      let habits = [... this.state.habits];
      let habitIndex = habits.findIndex(h => h.id == id);
      let habit = habits[habitIndex]
      habit.done.push(toIsoDate(date));
      this.setState({ habits: habits });
      await API.graphql(graphqlOperation(updateHabit, { input: { id: id, done: [...habit.done] } }))
    } catch (err) {
      console.log('error adding check:', err);
    }
  }

  toggleCheck(habitId, date, isChecked) {
    if (isChecked) {
      this.deleteCheck(habitId, date)
    } else {
      this.addCheck(habitId, date)
    }
  }

  async swapHabits(i, j) {
    try {
      let habits = [...this.state.habits];
      let temp = habits[i];
      habits.splice(i, 1);
      habits.splice(j, 0, temp);
      this.setState({ habits: habits })

      for (let k = 0; k < habits.length; k++) {
        let habit = { id: habits[k].id, ord: k };
        await API.graphql(graphqlOperation(updateHabit, { input: habit }))
      }
    } catch (err) {
      console.log('Error reordering habits:', err);
    }
  }

  async updateHabit(id, habitName, habitTarget, habitRepeat) {
    try {
      let habits = [... this.state.habits];
      let habit = habits.filter(h => h.id == id)[0];
      habit.name = habitName;
      habit.target = habitTarget;
      habit.repeat = habitRepeat;
      this.setState({ habits: habits });

      const updatedHabit = { id: id, name: habitName, target: habitTarget, repeat: habitRepeat };
      await API.graphql(graphqlOperation(updateHabit, { input: updatedHabit }))
      this.fetchHabits();

    } catch (err) {
      console.log('Error updating habit:', err);
    }
  }

  componentDidMount() {
    this.fetchHabits();
  }

  render() {
    return (
      <>
        <nav>
          <ul>
            <li><a href="" onClick={(e) => (e.preventDefault(), Auth.signOut())}>sign out</a></li>
            <li><Link to="/AccountSettings">account</Link></li>
          </ul>
        </nav>
        <body className="app">
          <h1>Habit Tracker</h1>
          <Calendar
            addHabit={this.addHabit}
            updateHabit={this.updateHabit}
            deleteHabit={this.deleteHabit}
            toggleCheck={this.toggleCheck}
            swapHabits={this.swapHabits}
            habits={this.state.habits}
          />
        </body>
      </>
    );
  }
}

export default HomePage;
