import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import renderCoins from '../_modules/renderCoins'
import styles from './style.module.scss'
import sleeping from '../../assets/svg/sleeping/sleeping.svg'
import moon from '../../assets/svg/sleeping/moon.svg'
import sun from '../../assets/svg/sleeping/sun.svg'
import { workerInterface } from '../_Interfaces/workerInterface'
import { setmoney, newday } from '../_slices/baseslice'
import { updateannouncements } from '../_slices/personsslice'
import { RootState } from '../mainstore'
import { AnnouncementsInterface } from '../_Interfaces/AnnouncementsInterface'




export default function Sleeping({ hour, sethour, setsleeping }: { hour: number, sethour: React.Dispatch<React.SetStateAction<number>>, setsleeping: React.Dispatch<React.SetStateAction<boolean>> }) {
    const dispatch = useDispatch()
    const [text, settext] = useState<string>('');
    const announcements: AnnouncementsInterface[] = useSelector((state: RootState) => state.persons.announcements);
    const workers: workerInterface[] = useSelector((state: RootState) => state.base.workersarray);
    const money: number = useSelector((state: RootState) => state.base.money);

    let sum = 0
    workers.map((v) => sum += v.income)

    const cooldown = (7 / (30 - hour)) * 1000
    useEffect(() => {
        const nightinterval = setInterval(() => {
            sethour((h: number) => {
                Math.floor((h / 60) % 24) == 5 && (clearInterval(nightinterval),
                    setTimeout(() => {
                        setsleeping(false)
                    }, 2000)); return h + 60
            })
        }, cooldown)
        dispatch(newday())
        money - sum < 0 ? settext(`Рабочим выплачена зарплата в размере ${renderCoins(sum)}`) : settext(`у вас не хватило денег для зарплаты рабочим..`)
        dispatch(setmoney(money - sum))
        const newannouncements = announcements.map(v => ({ ...v, date: v.date - 1 })).filter(v => v.date > 0)
        dispatch(updateannouncements(newannouncements))

    }, [])




    return (
        <div className={hour == 6 ? styles.parent + ' ' + styles.hide : styles.parent}>
            <h1 className={styles.watch}>{hour < 10 ? '0' : ''}{hour}:00</h1>
            <img className={styles.sleeping} src={sleeping} alt="" />
            <img className={styles.moon} src={moon} alt="" />
            <img className={styles.sun} src={sun} alt="" />
            <h1 className={styles.paycheck}></h1>
        </div>
    )
}