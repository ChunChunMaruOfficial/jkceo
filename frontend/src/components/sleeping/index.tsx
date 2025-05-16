import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { newday } from '../_slices/baseslice'

import styles from './style.module.scss'
import sleeping from '../../assets/svg/sleeping/sleeping.svg'
import moon from '../../assets/svg/sleeping/moon.svg'
import sun from '../../assets/svg/sleeping/sun.svg'

export default function Sleeping({ hour, sethour, setsleeping }: { hour: number, sethour: any, setsleeping: any }) {
    const dispatch = useDispatch()

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
    }, [])



    return (
        <div className={hour == 6 ? styles.parent + ' ' + styles.hide : styles.parent}>
            <h1 className={styles.watch}>{hour < 10 ? '0' : ''}{hour}:00</h1>
            <img className={styles.sleeping} src={sleeping} alt="" />
            <img className={styles.moon} src={moon} alt="" />
            <img className={styles.sun} src={sun} alt="" />
        </div>
    )
}