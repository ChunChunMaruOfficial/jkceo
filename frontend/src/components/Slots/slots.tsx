import { useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import graph1 from '../../assets/svg/slots/graph1.svg'
import graph2 from '../../assets/svg/slots/graph2.svg'
import circlegraph1 from '../../assets/svg/slots/circlegraph1.svg'
import circlegraph2 from '../../assets/svg/slots/circlegraph2.svg'
import getRandom from '../modules/getRandom';
import axios from 'axios';

export default function Slots() {
    const slotsspeedarray = [styles.speed1, styles.speed2, styles.speed3, styles.speed4, styles.speed5]
    const dragRef = useRef<HTMLDivElement>(null);
    const parentRef = useRef<HTMLDivElement>(null);
    const fisrstslotRef = useRef<HTMLDivElement>(null);
    const secondslotRef = useRef<HTMLDivElement>(null);
    const thirdslotRef = useRef<HTMLDivElement>(null);
    const [maxTop, setmaxTop] = useState(0)
    const [servertext, setservertext] = useState('')
    const [slotsspeed, setslotsspeed] = useState<number>(0)
    const [slotsisactive, setslotsisactive] = useState(false)
    const pos = useRef({ y: 0, top: 0 });
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
        if (!dragRef.current || !parentRef.current || !fisrstslotRef.current || !secondslotRef.current || !thirdslotRef.current) return;
        setmaxTop(parentRef.current.offsetHeight - dragRef.current?.offsetHeight)
        axios.get('http://localhost:3001/getdata')
        .then((res) => setservertext(res.data.answer))
        .catch((err) => console.error('Ошибка:', err));
        console.log(servertext);

    }, [])

    useEffect(() => {
        if (slotsisactive) {
            const times = getRandom(20, 25)
            startslots(fisrstslotRef.current, times)
            setTimeout(() => {
                startslots(secondslotRef.current, times + getRandom(4, 6))
            }, 200);
            setTimeout(() => {
                startslots(thirdslotRef.current, times + getRandom(8, 12))
            }, 400);
        }
    }, [slotsisactive])

    const startslots = (parent: HTMLDivElement | null, times: number) => { // старт каждого слота
        let count = 0
        if (parent) {
            let inter = setInterval(() => {
                const chld = document.createElement('p');
                setslotsspeed(prev => {
                    chld.classList.add(slotsspeedarray[prev]);

                    return prev
                })
                chld.textContent = `${getRandom(0, 100)}`;

                if (count == times) {
                    chld.classList.toggle(styles.finalslot);
                    clearInterval(inter)
                    setslotsisactive(false)
                } else {
                    chld.classList.toggle(styles.activateslots);

                    count++
                }

                parent.appendChild(chld)
            }, getRandom(500, 1000) / (slotsspeed + 1))
        }
    }

    const slotshide = (array: HTMLCollection) => {
        Array.from(array).map(v => (v as HTMLParagraphElement).style.opacity = '0')
    }

    const slotscleaning = (array: HTMLCollection) => {
        Array.from(array).map(v => (v.classList.contains(styles.activateslots) && v.remove(), v.classList.contains(styles.finalslot) && v.classList.replace(styles.finalslot, styles.finalslotend)))
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!dragRef.current) return;

        const newTop = pos.current.top + e.clientY - pos.current.y;

        if (maxTop - 10 < newTop && fisrstslotRef.current && secondslotRef.current && thirdslotRef.current) { //поочередный старт слотов
            //здесь триггер только на левер, нажатый до конца
            if (!slotsisactive) {
                slotscleaning(fisrstslotRef.current.children)
                slotscleaning(secondslotRef.current.children)
                slotscleaning(thirdslotRef.current.children)
                setslotsisactive(true)
            } else {
                setslotsspeed(slotsspeed + 1)
                slotshide(fisrstslotRef.current.children)
                slotshide(secondslotRef.current.children)
                slotshide(thirdslotRef.current.children)
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
    };


    return (
        <div className={styles.parent}>

            <div>

                <span className={styles.bolt}><div></div></span>
                <span className={styles.bolt}><div></div></span>
            </div>

            {/*  */}

            <div>
                <div>
                    <div className={styles.sidepart}>
                        <span className={styles.microbolt}></span>
                        <span className={styles.microbolt}></span>
                    </div>
                    <div>
                        <div>
                            <img src={graph1} alt="" />
                            {[...Array(4)].map(() => (<span className={styles.point}></span>))}
                            <img src={circlegraph1} alt="" />
                        </div>
                        <div className={styles.headtext}>
                            <h2>JKCEO </h2>
                            <h2>{servertext}</h2>
                        </div>
                        <div>
                            <img src={circlegraph2} alt="" />
                            {[...Array(4)].map(() => (<span className={styles.point}></span>))}
                            <img src={graph2} alt="" />
                        </div>
                    </div>
                    <div className={styles.sidepart}>
                        <span className={styles.microbolt}></span>
                        <span className={styles.microbolt}></span>
                    </div>
                </div>
                <div>
                    <div className={styles.main}>
                        <div className={styles.display}>
                            <span></span>
                            <div  ><div ref={fisrstslotRef} className={styles.slot}></div></div>
                            <span></span>
                            <div><div ref={secondslotRef} className={styles.slot}></div></div>
                            <span></span>
                            <div><div ref={thirdslotRef} className={styles.slot}></div></div>
                            <span></span>
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

            {/*  */}

            <div>

                <span className={styles.bolt}><div></div></span>
                <span className={styles.bolt}><div></div></span>
            </div>
        </div>
    )
}