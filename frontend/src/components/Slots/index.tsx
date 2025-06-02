import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './style.module.scss';
import sword from '../../assets/svg/slots/sword.svg'
import scales from '../../assets/svg/slots/scales.svg'
import decor from '../../assets/svg/slots/decoration.svg'
import getRandom from '../_modules/getRandom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import income from '../../assets/svg/start/income.svg'
import generatebuyerword from '../_modules/generatebuyerword';
import talksound from '../../assets/sounds/talk.wav'
import { setmoney, setprofessionformulation } from '../_slices/baseslice';
import setactiveCharacter from '../_modules/setactiveCharacter';



export default function Slots() {
    const dispatch = useDispatch()
    const badanswer = 'Кажется боги не отвечают.. твою судьбу они не предрешат!'

    const slotsspeedarray = [styles.speed1, styles.speed2, styles.speed3, styles.speed4, styles.speed5]
    const audiotalkRef = useRef<HTMLAudioElement>(null);
    const dragRef = useRef<HTMLDivElement>(null);
    const parentRef = useRef<HTMLDivElement>(null);
    const fisrstslotRef = useRef<HTMLDivElement>(null);
    const secondslotRef = useRef<HTMLDivElement>(null);
    const thirdslotRef = useRef<HTMLDivElement>(null);
    const [maxTop, setmaxTop] = useState<number>(0)
    const [serveremoji, setserveremoji] = useState<{ emoji: String, name: string }[]>([])
    const [silvercoins, setsilvercoins] = useState<number>(500)
    const [serveranswer, setserveranswer] = useState<string>('')

    const [hellowords, sethellowords] = useState<string>('')
    const fatewords = useRef([])
    const choisewords = useRef([])

    const [attempts, setattempts] = useState<number>(0)
    const [winning, setwinning] = useState<string[]>()
    const [slotsspeed, setslotsspeed] = useState<number>(0)
    const [slotsisactive, setslotsisactive] = useState<boolean>(false)
    const pos = useRef({ y: 0, top: 0 })

    const fatesaccept = () => {
        dispatch(setmoney(silvercoins / 10))
        dispatch(setprofessionformulation(serveranswer))
        setactiveCharacter('professionformulation', serveranswer)
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        pos.current = {
            y: e.clientY,
            top: parseInt(window.getComputedStyle(dragRef.current!).top || '0')
        }
        document.addEventListener('mousemove', handleMouseMove as EventListener)
        document.addEventListener('mouseup', handleMouseUp)
        e.preventDefault()
    }

    useEffect(() => {  //задать высоту слотов при загрузке страницы

        axios.get('http://localhost:3001/getslots')
            .then((res) => {
                fatewords.current = (res.data.fate);
                choisewords.current = (res.data.choise);
                console.log(fatewords.current);

                generatebuyerword(fatewords.current[getRandom(0, fatewords.current.length - 1)], sethellowords)
            })


        if (!dragRef.current || !parentRef.current || !fisrstslotRef.current || !secondslotRef.current || !thirdslotRef.current) return;
        setmaxTop(parentRef.current.offsetHeight - dragRef.current?.offsetHeight)
        axios.get('http://localhost:3001/getdata')
            .then((res) => {
                setserveremoji(res.data.answer);
            })
    }, [])

    useEffect(() => {
        if (winning?.length == 3) {
            generatebuyerword(choisewords.current[getRandom(0, choisewords.current.length - 1)], sethellowords)
            axios.post('http://localhost:3001/getwinningtext', { promt: winning.join() })
                .then((res) => {
                    setserveranswer(res.data.answer)
                })
        }
    }, [winning])

    useEffect(() => {
        if (slotsisactive) {
            setsilvercoins(coins => coins - 30)
            slotscleaning(fisrstslotRef.current!.children)
            slotscleaning(secondslotRef.current!.children)
            slotscleaning(thirdslotRef.current!.children)
            setwinning([])
            setattempts(att => att + 1)
            const times = getRandom(10, 11)
            startslots(fisrstslotRef.current, times)
            setTimeout(() => {
                startslots(secondslotRef.current, times + getRandom(1, 2))
            }, 200);
            setTimeout(() => {
                startslots(thirdslotRef.current, times + getRandom(3, 4))
            }, 400);
        }
    }, [slotsisactive])

    useEffect(() => {
        if (audiotalkRef.current) {
            audiotalkRef.current.play().catch(e => console.log("Audio play failed:", e));
        }
    }, [hellowords]);


    const startslots = (parent: HTMLDivElement | null, times: number) => { // старт каждого слота
        let count: number = 0
        if (parent) {
            let inter = setInterval(() => {
                const chld = document.createElement('p');
                setslotsspeed(prev => {
                    chld.classList.add(slotsspeedarray[prev]);
                    return prev
                })
                const item = serveremoji[getRandom(0, serveremoji.length)].emoji
                chld.textContent = `${item}`;


                if (count >= times) {
                    clearInterval(inter)
                    chld.classList.toggle(styles.finalslot);
                }
                if (count == times) {
                    setslotsisactive(false)
                    setwinning(win => [...(win ?? []), String(item)]);
                } else {
                    chld.classList.toggle(styles.activateslots);
                    count++
                }

                parent.appendChild(chld)
            }, getRandom(600, 900) / (slotsspeed + 1))
        }
    }

    const slotscleaning = (array: HTMLCollection) => {
        Array.from(array).map(v => (v.classList.contains(styles.activateslots)
            && v.remove(), setTimeout(() => v.classList.contains(styles.finalslotend) && v.remove(), 1500), v.classList.contains(styles.finalslot) && v.classList.replace(styles.finalslot, styles.finalslotend)))
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!dragRef.current) return;

        const newTop = pos.current.top + e.clientY - pos.current.y;

        if (maxTop - 10 < newTop && fisrstslotRef.current && secondslotRef.current && thirdslotRef.current) { //поочередный старт слотов
            //здесь триггер только на левер, нажатый до конца
            if (!slotsisactive) { //если не активен
                serveremoji.length == 0 ? setserveranswer(badanswer) :
                    setslotsisactive(true)
            } else { //во время крутки
                slotsspeed < 4 && setslotsspeed(slotsspeed + 1)
            }
        }

        dragRef.current.style.top = `${Math.max(0, Math.min(maxTop, newTop))}px`; //смотреть, не залазит ли левер за родителя
        dragRef.current.style.transition = 'none'
    };

    const handleMouseUp = () => {
        //здесь триггер на любое движение левера
        if (dragRef.current) { //плавное возвращение левера
            dragRef.current.style.transition = 'top .7s ease-out';
            dragRef.current.style.top = '0px';
        }
        document.removeEventListener('mousemove', handleMouseMove as EventListener);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    return (
        <div className={styles.mainparent}>
            <audio ref={audiotalkRef} src={talksound} autoPlay />
            <div className={styles.person}>
                <h2>{hellowords}</h2>
                <img src={income} alt="" />
            </div>
            <div className={styles.parent}>

                <div>

                    <span className={styles.bolt}><div></div></span>
                    <span className={styles.bolt}><div></div></span>
                </div>
                <div>
                    <div>
                        <div className={styles.sidepart}>
                            <span className={styles.microbolt}></span>
                            <span className={styles.microbolt}></span>
                        </div>
                        <div>
                            <div>
                                <img src={scales} alt="" />
                                {[...Array(4)].map((_, i) => (<span key={i} className={styles.point}></span>))}
                                <img src={sword} className={styles.rotated} alt="" />
                            </div>
                            <div className={styles.headtext}>
                                <h2>JKCEO </h2>
                                <h2>MACHINE</h2>
                            </div>
                            <div>
                                <img src={sword} alt="" />
                                {[...Array(4)].map((_, i) => (<span key={i} className={styles.point}></span>))}
                                <img src={scales} className={styles.rotated} alt="" />
                            </div>
                        </div>
                        <div className={styles.sidepart}>
                            <span className={styles.microbolt}></span>
                            <span className={styles.microbolt}></span>
                        </div>
                    </div>
                    <div>
                        <div className={styles.main}>
                            <div>
                                <div className={styles.display}>
                                    <img src={decor} alt="" />
                                    <span></span>
                                    <div><div ref={fisrstslotRef} className={styles.slot}></div></div>
                                    <span></span>
                                    <div><div ref={secondslotRef} className={styles.slot}></div></div>
                                    <span></span>
                                    <div><div ref={thirdslotRef} className={styles.slot}></div></div>
                                    <span></span>
                                    <img src={decor} alt="" />
                                </div>
                            </div>
                            <div className={styles.botompanel}>
                                <div>
                                    <span>Гроссо</span>
                                    <span>{silvercoins}</span>
                                </div>

                                <div className={styles.botomcenter}>
                                    {[...Array(4)].map(() => (<p className={styles.microbolt}></p>))}
                                    <div className={styles.botomcenter_front}>
                                        <p className={styles.textarea}>{typeof serveranswer == 'string' && serveranswer}</p>
                                    </div>
                                    <div className={styles.botomcenter_back}>
                                        {serveranswer && serveranswer != badanswer && (<Link to='../current/formulation'> <button onClick={() => fatesaccept()}>принять свою участь</button> </Link>)}

                                    </div>
                                </div>
                                <div>
                                    <span>Попытки</span>
                                    <span>{attempts}</span>
                                </div>
                                <div> {[...Array(4)].map((_, i) => (<p style={{ background: slotsspeed <= i ? "#F0EFEB" : '#A5A58D' }} className={styles.microbolt}></p>))}</div>
                            </div>
                        </div>
                        <div className={styles.lever}>
                            <div className={styles.sidepart}>
                                <span className={styles.microbolt}></span>
                                <span className={styles.microbolt}></span>
                            </div>
                            <div>
                                <span ref={parentRef} ><div
                                    ref={dragRef}
                                    onMouseDown={handleMouseDown}
                                    className={styles.circle}></div></span>
                            </div>
                            <div className={styles.sidepart}>
                                <span className={styles.microbolt}></span>
                                <span className={styles.microbolt}></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>

                    <span className={styles.bolt}><div></div></span>
                    <span className={styles.bolt}><div></div></span>
                </div>
            </div>
        </div>
    )
}