import styles from './style.module.scss'

import table from '../../../assets/svg/maininterface/table.svg'
import message from '../../../assets/svg/maininterface/message.svg'

import { useSelector } from 'react-redux';
import { RootState } from '../../mainstore';

export default function ({seconds, setsleeping} : {seconds: number, setsleeping: React.Dispatch<React.SetStateAction<boolean>>}) {

    const day: number = useSelector((state: RootState) => state.base.day);

    return (
        <div id={styles.clockplace}>
            <div className={styles.clock}>
                <div onClick={() => setsleeping(true)} className={styles.button}></div>
                <div className={styles.clockdisplay}>
                    <p>{Math.floor((seconds / 60) % 24) < 12 ? 'AM' : 'PM'}</p>
                    <h1>{Math.floor((seconds / 60) % 12) < 10 ? '0' : ''}{Math.floor((seconds / 60) % 12)}:{seconds % 60 < 10 ? '0' : ''}{seconds % 60}</h1>
                    <p>{day}</p>
                </div>
                {Math.floor((seconds / 60) % 24) < 2 && (<span>
                    <img src={message} alt="" />
                    <p>идти спать</p>
                </span>)}
            </div>
            <img src={table} alt="" />
        </div>
    )
}