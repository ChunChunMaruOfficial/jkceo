import styles from './style.module.scss'

import table from '../../../assets/svg/maininterface/table.svg'
import message from '../../../assets/svg/maininterface/message.svg'

import { useSelector } from 'react-redux';
import { RootState } from '../../mainstore';

import speedup from '../../../assets/svg/clock/speedup.svg'

export default function ({ isspeedup, setisspeedup, seconds, setsleeping, setisshield }: { isspeedup: boolean, setisspeedup: React.Dispatch<React.SetStateAction<boolean>>, seconds: number, setsleeping: React.Dispatch<React.SetStateAction<boolean>>, setisshield: React.Dispatch<React.SetStateAction<boolean>> }) {

    const day: number = useSelector((state: RootState) => state.base.day);

    return (
        <div id={styles.clockplace}>
            <div className={styles.clock}>
                <div onClick={() => { setsleeping(true); setisshield(true) }} className={styles.button}></div>
                <div className={styles.clockdisplay}>
                    <p>{Math.floor((seconds / 60) % 24) < 12 ? 'AM' : 'PM'}</p>
                    <h1>{Math.floor((seconds / 60) % 12) < 10 ? '0' : ''}{Math.floor((seconds / 60) % 12)}:{seconds % 60 < 10 ? '0' : ''}{seconds % 60}</h1>
                    <p>{day}</p>
                    <span onClick={() => setisspeedup(su => {return !su})} className={styles.speedup}>
                        {isspeedup && (<img src={speedup} className={styles.isup} alt="" />)}
                        <img src={speedup} alt="" />
                    </span>
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