import { useEffect, useRef, useState } from 'react'
import getRandom from '../_modules/getRandom'

import axios from 'axios';

import chariot1 from '../../assets/svg/chariots/1.svg'
import chariot2 from '../../assets/svg/chariots/2.svg'
import chariot3 from '../../assets/svg/chariots/3.svg'
import chariot4 from '../../assets/svg/chariots/4.svg'
import chariot5 from '../../assets/svg/chariots/5.svg'

import circle from '../../assets/svg/chariots/circle.svg'
import cloud from '../../assets/svg/chariots/cloud.svg'

import motivationimg from '../../assets/svg/chariots/motivation.svg'
import demotivationimg from '../../assets/svg/chariots/demotivation.svg'

import bg from '../../assets/img/racebg.jpg'
import finish from '../../assets/svg/chariots/finish.svg'
import fireworks from '../../assets/svg/chariots/fireworks.svg'

import win from '../../assets/svg/chariots/win.svg'
import lose from '../../assets/svg/chariots/lose.svg'

import bet from '../../assets/svg/chariots/bet.svg'

import styles from './style.module.scss'

export default function ChariotsRace() {
    const chariots = [chariot1, chariot2, chariot3, chariot4, chariot5]
    const [counter, setcounter] = useState(0)
    const [headtext, setheadtext] = useState('Chariot races')

    const [motivation, setmotivation] = useState<string[]>([])
    const [demotivation, setdemotivation] = useState<string[]>([])

    const [selectedchariot, setselectedchariot] = useState(-1)
    const [winner, setwinner] = useState(-2)
    const [grabing, setgrabing] = useState(false)
    const [wordsarray, setwordsarray] = useState<{ effect: boolean, text: string }[]>()

    const starRef = useRef<HTMLImageElement>(null)
    const finishRef = useRef<HTMLImageElement>(null)

    const [starX, setstarX] = useState(0)
    const [starY, setstarY] = useState(0)

    const raceRef = useRef<HTMLDivElement>(null);
    const chariotRef1 = useRef<HTMLImageElement>(null);
    const chariotRef2 = useRef<HTMLImageElement>(null);
    const chariotRef3 = useRef<HTMLImageElement>(null);
    const chariotRef4 = useRef<HTMLImageElement>(null);
    const chariotRef5 = useRef<HTMLImageElement>(null); //простите а как в массиве все это организовать
    const chariotRefs = [chariotRef1, chariotRef2, chariotRef3, chariotRef4, chariotRef5]
    const [Chariotstimes, setChariotstimes] = useState<number[]>([0, 0, 0, 0, 0])

    const startrace = () => {

        starRef.current!.style.cursor = 'default'
        chariotRefs.map((v, i) => {
            const timerInterval = setInterval(() => {
                setChariotstimes(array => array.map((v1, i1) => i == i1 ? v1 += 0.01 : v1 += 0))
            }, 10)
            const raceInterval = setInterval(() => {
                const newposition = v.current!.getBoundingClientRect().left - raceRef.current!.getBoundingClientRect().left + getRandom(1, 15)
                v.current!.style.left = `${newposition}px`
                if (i == selectedchariot) starRef.current!.style.left = `${newposition + 55}px`
                finishRef.current!.getBoundingClientRect().left <= v.current!.getBoundingClientRect().right && (clearInterval(raceInterval),  
                setChariotstimes(Chariotstimes =>
                    Chariotstimes.map((v1,i1) =>
                      i === i1 ? Number(v1) : v1
                    )
                  ), clearInterval(timerInterval), setwinner(winner => winner == -2 ? i : winner), setwinner(winner => { console.log(winner); return winner }
                ))
            }, 60)

        })
    }



    useEffect(() => {
        axios.get('http://localhost:3001/getmotivation')
            .then((res) => {
                setmotivation(res.data.answer)
            })
        axios.get('http://localhost:3001/getdemotivation')
            .then((res) => {
                setdemotivation(res.data.answer)
            })
    }, [])

    const changeWordsArray = () => {
        const startwordarray: { effect: boolean, text: string }[] = new Array(4).fill(null).map(() => { return getRandom(0, 2) ? { effect: true, text: motivation[getRandom(0, motivation.length)] } : { effect: false, text: demotivation[getRandom(0, demotivation.length)] } })
        console.log(wordsarray);
        setwordsarray(startwordarray)
    }

    useEffect(() => {
        changeWordsArray()
    }, [motivation, demotivation])

    useEffect(() => {
        if (counter != 0) setheadtext(counter.toString())
        if (Chariotstimes[0] > 0) setheadtext('Cheer for thy steed!')
        if (winner >= 0) winner == selectedchariot ? setheadtext('Thou hast emerged victorious') : setheadtext('Thou hast been vanquished')
    }, [winner, counter, Chariotstimes])


    useEffect(() => {
        if (!starRef.current || selectedchariot == -1) return
        starRef.current.style.left = `${chariotRefs[selectedchariot].current!.getBoundingClientRect().left + 60}px`;
        starRef.current.style.top = `${chariotRefs[selectedchariot].current!.getBoundingClientRect().top}px`;
        starRef.current.style.height = '1em'
        setheadtext('Press Start')
        setgrabing(false)
    }, [selectedchariot])

    useEffect(() => {
        chariotRefs.map((chariot, i) => {
            if (
                starRef.current!.getBoundingClientRect().right > chariot.current!.getBoundingClientRect().left &&
                starRef.current!.getBoundingClientRect().left < chariot.current!.getBoundingClientRect().right &&
                starRef.current!.getBoundingClientRect().bottom > chariot.current!.getBoundingClientRect().top &&
                starRef.current!.getBoundingClientRect().top < chariot.current!.getBoundingClientRect().bottom &&
                !grabing
            ) {
                starRef.current!.style.transition = '0.3s ease'
                setselectedchariot(i)
            } else {
                starRef.current!.style.height = '3.5em'
            }
        })
    }, [grabing])

    const startCounter = () => {
        if (selectedchariot == -1) {
            setheadtext('bless one of the racers')
            return
        }
        setcounter(3)
        const countinterval = setInterval(() => {
            setcounter(counter => counter - 1)
            setcounter(counter => { counter == 0 && (clearInterval(countinterval), startrace()); return counter })
            counter < 0 && clearInterval(countinterval)
        }, 1000)
    }

    const stargrabbing = (e: unknown) => {
        if (!starRef.current) return
        starRef.current!.style.transition = 'none'
        const trueE = e as MouseEvent;
        setgrabing(true)
        setstarX(trueE.clientX - starRef.current.getBoundingClientRect().left)
        setstarY(trueE.clientY - starRef.current.getBoundingClientRect().top)
    }

    const starmoving = (e: unknown) => {
        if (!grabing) return;
        if (!starRef.current) return
        // Обновляем позицию элемента
        const trueE = e as MouseEvent;
        starRef.current.style.left = `${trueE.clientX - starX}px`;
        starRef.current.style.top = `${trueE.clientY - starY}px`;
    }

    return (
        <div className={styles.parent}>
            <h2><img src={winner >= 0 ? (winner == selectedchariot ? win : lose) : ''} alt="" /> {headtext}  </h2>
            <img src={bg} alt="" />
            <div className={styles.raceplace} ref={raceRef}>

                {chariots.map((v, i) => (<div>
                    <span  ref={chariotRefs[i]} className={styles.chariot}><img className={styles.cloud} style={{opacity: headtext == 'Cheer for thy steed!' ? '100' : '0'}} src={cloud} alt="" /><img key={v}  src={v} alt="" /></span>{winner == i  && ( <img className={styles.fireworks} src={fireworks} alt="" /> )}<img src={finish} ref={finishRef} alt="" />
                </div>))}
            </div>
            <div className={styles.controlpanel}>
             {Chariotstimes[0] == 0 &&(   <button onClick={() => startCounter()}>start</button>)}

                <img className={styles.star} onMouseDown={(e) => stargrabbing(e)} onMouseMove={(e) => starmoving(e)} onMouseUp={() => setgrabing(false)} ref={starRef} src={bet} alt="" />
                {selectedchariot == -1 && (<div className={styles.starplace}><img src={circle} alt="" />
                    <p>Take a star to bless one of the racers.</p></div>)}
                {Chariotstimes[0] > 0 && (<div className={styles.words}>
                    {wordsarray && wordsarray.map((v, i) => {
                        return (<button
                            onClick={() => {
                                const newleft = chariotRefs[selectedchariot].current!.getBoundingClientRect().left - raceRef.current!.getBoundingClientRect().left
                                chariotRefs[selectedchariot].current!.style.left = v.effect ? `${newleft + getRandom(100, 200)}px` : `${newleft - getRandom(20, 30)}px`;
                                changeWordsArray()
                            }
                            }
                        ><img src={v.effect ? motivationimg : demotivationimg} alt="" />{v.text}</button>)
                    })}
                </div>)}
                <div>
                    {Chariotstimes.map(v =>
                        (<p>{v.toFixed(2)}</p>)
                    )}
                </div>
            </div>
        </div>
    )
}
