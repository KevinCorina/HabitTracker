import styles from './css/CheckCell.module.css'
import { isToday } from './DateHelper';

import React from 'react';


class CheckCell extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let date = new Date(this.props.date);
        return (
            <td className={[isToday(date) ? styles.today : "", this.props.over ? styles.over : ""].join(' ')}>
                <div className={[styles.cell, this.props.isChecked ? styles.on : styles.off].join(' ')}
                    onClick={event => this.props.toggleCheck(this.props.habitId, new Date(this.props.date), this.props.isChecked)}
                >
                </div>
            </td>
        );
    }

}


export default CheckCell;