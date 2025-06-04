import styles from './style.module.scss'
import { useEffect } from 'react'
import drawers from '../../assets/svg/equipment/drawers.svg'
import lamp from '../../assets/svg/equipment/lamp.svg'
import mug from '../../assets/svg/equipment/mug.svg'
import table from '../../assets/svg/equipment/table.svg'

import next from '../../assets/svg/system/next.svg'

import { workerInterface } from '../_Interfaces/workerInterface'
import renderCoins from '../_modules/renderCoins'
import drawersselected from '../../assets/svg/equipment/selected/drawers.svg'
import lampselected from '../../assets/svg/equipment/selected/lamp.svg'
import muselected from '../../assets/svg/equipment/selected/mug.svg'
import tableselected from '../../assets/svg/equipment/selected/table.svg'

import noworkers from '../../assets/svg/equipment/noworkers.svg'

import gauge from '../../assets/svg/equipment/statistic/gauge.svg'
import sisyphus from '../../assets/svg/equipment/statistic/sisyphus.svg'
import clock from '../../assets/svg/equipment/statistic/clock.svg'
import backstretch from '../../assets/svg/equipment/statistic/backstretch.svg'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../mainstore'
import { useState } from 'react'
import { addworker, upgradestatistic, setmoney } from '../_slices/baseslice'

import axios from 'axios'

export default function Equipment() {
    const dispatch = useDispatch()
    const [notenough, setnotenough] = useState<boolean>(false)
    const myworkers: workerInterface[] = useSelector((state: RootState) => state.base.workersarray)
    const money: number = useSelector((state: RootState) => state.base.money)
    const [selectedequipment, setselectedequipment] = useState<number>(-1)
    const [workerindex, setworkerindex] = useState<number>(0)
    const [neworkerstyle, setneworkerstyle] = useState(styles.nextshowing)

    useEffect(() => {
        if (myworkers.length == 0) {
            axios.get('http://localhost:3001/getmyworkers').then((res) => {
                res.data.workers.map((v: workerInterface) => dispatch(addworker(v)))
            })
        }
    }, [])

    const nextworker = () => {
        setworkerindex(prevIndex => prevIndex - 1);
        setneworkerstyle(styles.nextshowing)
        setTimeout(() => {
            setneworkerstyle('')
        }, 1000)
    }

    const backworker = () => {
        setworkerindex(prevIndex => prevIndex + 1);
        setneworkerstyle(styles.backshowing)
        setTimeout(() => {
            setneworkerstyle('')
        }, 1000)
    }


    const upgradestat = (i: number) => {
        if (money > statistics[i].price) {
            dispatch(setmoney(money - statistics[i].price))
            dispatch(upgradestatistic([workerindex, characteristic[i]]))
        } else {
            setnotenough(true)
            setTimeout(() => setnotenough(false), 3000)
        }
    }

    const characteristic = ['drawers', 'lamp', 'mug', 'table']

    const imgs = [{ class: styles.drawers, src: drawers, selected: drawersselected },
    { class: styles.lamp, src: lamp, selected: lampselected },
    { class: styles.mug, src: mug, selected: muselected },
    { class: styles.table, src: table, selected: tableselected }]

    const paragraphs = [
        { class: styles.uprgadedrawers, text: "оборудование" },
        { class: styles.uprgadelamp, text: 'освещение' },
        { class: styles.uprgademug, text: "качество отдыха" },
        { class: styles.uprgadetable, text: "рабочее место" }
    ]

    const statistics = [
        { text: 'Время перерыва между производством', imgsrc: sisyphus, value: 2, part: 0, price: 30 },
        { text: 'Уход с работы домой', imgsrc: backstretch, value: 4, part: 0, price: 20 },
        { text: 'Выход на работу в новый рабочий день', imgsrc: clock, value: 3, part: 0, price: 30 },
        { text: 'Скорость производства единицы товара', imgsrc: gauge, value: 1, part: 0, price: 40 }
    ]

    return (<>

        {myworkers.length > 0 ? (<> <span className={styles.panel}>{workerindex != 0 && (<img onClick={() => nextworker()} className={styles.next + " " + styles.back} src={next} alt="" />)}<h1><img alt='' src={'../src/assets/svg/workers/' + myworkers[workerindex].imgsrc + '.svg'} />  {myworkers[workerindex].name} {myworkers[workerindex].surname}</h1>{myworkers.length - 1 > workerindex && (<img onClick={() => backworker()} className={styles.next} src={next} alt="" />)}</span><div className={styles.statistic + ' ' + neworkerstyle}>

            {statistics.map((v, i) => { const currentstat = Object.values(myworkers[workerindex].statistic)[i]; return (<span key={i}><img src={v.imgsrc} alt="" /><h2>{v.text}</h2><div style={{ background: currentstat.level != 0 ? `linear-gradient(to right, #CB997E ${Math.floor((currentstat.level / currentstat.maxlevel) * 100)}%, rgba(255, 0, 0, 0) 10%)` : 'none' }}>{currentstat.value.toFixed(2)}  {i == 1 && 'PM'}{i == 2 && 'AM'}</div></span>) })}
        </div>
            <div className={styles.parent + ' ' + neworkerstyle}>
                {imgs.map((v, i) => (<img key={i} onClick={() => upgradestat(i)} onMouseOver={() => setselectedequipment(i)} onMouseOut={() => setselectedequipment(-1)} className={v.class} src={selectedequipment == i ? v.selected : v.src} />))}
                {paragraphs.map((v, i) => selectedequipment == i && (<p onClick={() => upgradestat(i)} key={i} onMouseOver={() => setselectedequipment(i)} onMouseOut={() => setselectedequipment(-1)} className={v.class + ' ' + styles.upgrade}>{v.text} {renderCoins(statistics[i].price)}</p>))}
            </div></>) : (<span className={styles.noworkers}><img src={noworkers} alt="" /><p>У вас еще нет работников, <br /> чтобы улучшать для них оборудования</p></span>)}
        {notenough && (<h1 className={styles.warning}>Недостаточно денег!!</h1>)}
    </>
    )
}