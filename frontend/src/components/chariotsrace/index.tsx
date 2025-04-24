import { useEffect, useRef, useState } from 'react'
import getRandom from '../_modules/getRandom'

import chariot1 from '../../assets/svg/chariots/1.svg'
import chariot2 from '../../assets/svg/chariots/2.svg'
import chariot3 from '../../assets/svg/chariots/3.svg'
import chariot4 from '../../assets/svg/chariots/4.svg'
import chariot5 from '../../assets/svg/chariots/5.svg'

import bg from '../../assets/img/racebg.jpg'
import finish from '../../assets/svg/chariots/finish.svg'

import styles from './style.module.scss'

export default function ChariotsRace() {
    const chariots = [chariot1, chariot2, chariot3, chariot4, chariot5]
    const [counter, setcounter] = useState(0)
    const raceRef = useRef<HTMLDivElement>(null);
    const chariotRef1 = useRef<HTMLImageElement>(null);
    const chariotRef2 = useRef<HTMLImageElement>(null);
    const chariotRef3 = useRef<HTMLImageElement>(null);
    const chariotRef4 = useRef<HTMLImageElement>(null);
    const chariotRef5 = useRef<HTMLImageElement>(null); //простите а как в массиве все это организовать
    const chariotRefs = [chariotRef1,chariotRef2,chariotRef3,chariotRef4,chariotRef5]
    
const startrace = () => {
    chariotRefs.map(v => {
        setInterval(() => {
            
            v.current!.style.left = `${v.current!.getBoundingClientRect().left - raceRef.current!.getBoundingClientRect().left + getRandom(1,5)}px` 
        }, 150)
    })
}

const startCounter = () => {
   const countinterval = setInterval(() => {
       setcounter(counter => counter - 1)
       setcounter(counter => {counter == 0 && (clearInterval(countinterval), startrace()); return counter})
       counter < 0 && clearInterval(countinterval)
   }, 1000)
}

    return (
        <div className={styles.parent}>
            <img src={bg} alt="" />
            <div ref={raceRef}>
                <h1>{counter != 0 && counter}</h1>
                {chariots.map((v,i) => (<div>
                    <img className={styles.chariot} ref={chariotRefs[i]} src={v} alt="" /> <img src={finish} alt="" />
                </div>))}
            </div>
            <button onClick={() => {setcounter(3), startCounter()}}>start</button>
        </div>
    )
}