import axios from 'axios'
import plane from '../../assets/svg/spaceinvaders/plane.svg'
import getRandom from '../_modules/getRandom'
import star from '../../assets/svg/spaceinvaders/star.svg'
import clock from '../../assets/svg/spaceinvaders/clock.svg'
import stop from '../../assets/svg/spaceinvaders/stop.svg'
import styles from './style.module.scss'
import { useEffect, useRef, useState } from 'react'
import { RootState } from '../mainstore'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function AntiqueInvaders() {

    const planeRef = useRef<HTMLImageElement>(null)
    const parentRef = useRef<HTMLImageElement>(null)

    const hates = useRef([])
    const prides = useRef([])
    let parentwidth = 0
    let parentheight = 0
    const [isdragging, setisdragging] = useState<boolean>(false)
    const [newX, setnewX] = useState<number>(0)
    const [newY, setnewY] = useState<number>(0)
    const [starttimer, setstarttimer] = useState<number>(3)
    const [maintimer, setmaintimer] = useState<number>(100)
    const invadersscale = useSelector((state: RootState) => state.skills.invadersscale);
    const bulletspeed = useSelector((state: RootState) => state.skills.bulletspeed);
    const isgoodinitial: boolean = getRandom(0, 4) == 0 ? true : false
    const [invadersArray, setinvadersArray] = useState<{ top: number, left: number, good: boolean }[]>([{ top: getRandom(-150, -50), left: getRandom(-100, parentRef.current ? (parentwidth - 200) : 300), good: isgoodinitial }])
    const [rate, setrate] = useState<number>(0)

    const invadersRender = () => {
        const invadersRenderinterval = setInterval(() => {
            let invaders: any = []
            try {
                invaders = Array.from(parentRef.current?.children as HTMLCollectionOf<HTMLParagraphElement>).filter(child => child.matches('p'))
            } catch {
                clearInterval(invadersRenderinterval)
            }
            const lastinvader = invaders[invaders.length - 1]

            const listyle = lastinvader.getBoundingClientRect()

            invaders.map((v: HTMLParagraphElement) => (v.getBoundingClientRect().top >= (parentRef.current!.getBoundingClientRect().height + 300)) && v.remove())

            listyle.left < (parentwidth / 2) ? (lastinvader.style.left = (listyle.left + getRandom(100, parentwidth)) + 'px') : ((listyle.left + getRandom(100, parentwidth)) + 'px')
            lastinvader.style.top = listyle.top + parentheight + 300 + 'px'
            const isgoodinitial: boolean = getRandom(0, 4) == 0 ? true : false
            setinvadersArray(invadersArray => [...invadersArray, { top: getRandom(-150, -100), left: getRandom(-100, parentRef.current ? (parentwidth - 200) : 300), good: isgoodinitial }])

            setmaintimer((mt) => {
                if (mt < 2) { clearInterval(invadersRenderinterval) } return mt
            })
        }, 800)
    }

    const bulletsRender = () => {
        const bulletsInterval = setInterval(() => {
            if (!planeRef.current || !parentRef.current) return 0
            const newbullet = document.createElement('div')
            Array.from(parentRef.current?.children as HTMLCollectionOf<HTMLElement>).filter(child => child.classList.contains(styles.bullet)).map(v => (v.getBoundingClientRect().top < 40) && v.remove())
            newbullet.style.top = planeRef.current!.getBoundingClientRect().top + 'px'
            newbullet.style.left = (planeRef.current!.getBoundingClientRect().left + (planeRef.current!.getBoundingClientRect().width / 2)) + 'px'
            newbullet.classList.toggle(styles.bullet);
            parentRef.current.appendChild(newbullet)

            setmaintimer((mt) => {
                if (mt < 2) { clearInterval(bulletsInterval) } return mt
            })
            console.log('newbullet');

            setTimeout(() => {
                newbullet.style.top = '-20px'
            }, 1);
        }, bulletspeed.value)
    }

    const checkCollision = () => {
        const CollisionInterval = setInterval(() => {

            let invaders: any = []
            let bullets: any = []
            try {
                invaders = Array.from(parentRef.current?.children as HTMLCollectionOf<HTMLParagraphElement>).filter(child => child.matches('p'))
                bullets = Array.from(parentRef.current?.children as HTMLCollectionOf<HTMLDivElement>).filter(child => child.matches('div'))
            } catch {
                clearInterval(CollisionInterval)
            }
            invaders?.length > 0 && invaders?.map((invader: HTMLParagraphElement) => (bullets.map((bullet: HTMLDivElement) => {
                if (
                    bullet.getBoundingClientRect().right > invader.getBoundingClientRect().left &&
                    bullet.getBoundingClientRect().left < invader.getBoundingClientRect().right &&
                    bullet.getBoundingClientRect().bottom > invader.getBoundingClientRect().top &&
                    bullet.getBoundingClientRect().top < invader.getBoundingClientRect().bottom
                ) {
                    bullet.remove()
                    const lastmessage = document.createElement('span');
                    lastmessage.innerHTML = Number(invader.innerText) != 1 ? hates.current[getRandom(0, hates.current.length - 1)] : prides.current[getRandom(0, prides.current.length - 1)]
                    lastmessage.style.position = 'absolute';
                    lastmessage.style.color = Number(invader.innerText) != 0 ? "#658761" : '#AC5045'
                    lastmessage.style.left = `${invader.getBoundingClientRect().left}px`;
                    lastmessage.style.top = `${invader.getBoundingClientRect().top}px`
                    parentRef.current!.appendChild(lastmessage)
                    invader.remove()
                    setTimeout(() => {
                        lastmessage.remove()
                    }, 3010)
                    setrate(r => Number(invader.innerText) != 1 ? r + 1 : (r == 0 ? 0 : r - 1))
                }
            })))
        }, 16)
    }

    const startmaininterval = () => {
        const mainInter = setInterval(() => {
            setmaintimer((mt) => {
                if (mt < 2) { clearInterval(mainInter); return 0 } else return mt - 1
            })
        }, 1000)
    }


    useEffect(() => {

        axios.get('http://localhost:3001/getinvaders').then((res) => {
            hates.current = res.data.hate
            prides.current = res.data.pride
        });

        parentwidth = parentRef.current!.getBoundingClientRect().width
        parentheight = parentRef.current!.getBoundingClientRect().height + 200 //+200!!!!!!!!!!!!

        const startInter = setInterval(() => {
            setstarttimer(st => {
                if (st < 2) { clearInterval(startInter); invadersRender(); checkCollision(); bulletsRender(); startmaininterval(); return 0 } else return st - 1
            })
        }, 1000)

        if (planeRef.current) {
            planeRef.current.style.left = `${(parentwidth / 2) - 50}px`
            planeRef.current.style.top = `${(parentheight / 2)}px`
        }

    }, [])

    const grabbing = (e: unknown) => {
        if (!planeRef.current) return
        const trueE = e as MouseEvent;
        setisdragging(true)
        setnewX(trueE.clientX - planeRef.current.getBoundingClientRect().left)
        setnewY(trueE.clientY - planeRef.current.getBoundingClientRect().top)
    }

    const moving = (e: unknown) => {
        if (!isdragging) return;
        if (!planeRef.current) return
        // Обновляем позицию элемента
        const trueE = e as MouseEvent;
        planeRef.current.style.left = `${trueE.clientX - newX}px`;
        planeRef.current.style.top = `${trueE.clientY - newY}px`;
    }

    return (
        <div ref={parentRef} className={styles.parent}>
            {maintimer == 0 && (<section className={styles.popupwrapper}>
                <section className={styles.popup}><h1><img src={stop} alt="" />На сегодня все!<img src={stop} alt="" /></h1>
                    <hr />
                    <h2>Вы набрали: &nbsp; <h3> {rate}</h3><img src={star} alt="" /></h2>
                    <Link to={'../current/workplace'}><button>Вернуться домой</button></Link>
                    <h5>Этот результат изменит слухи о вас</h5>
                </section>
            </section>)}
            {starttimer > 0 && (<h1 className={styles.timer}>{starttimer}</h1>)}
            <h1><span className={maintimer < 20 ? styles.bounce : ''}>{maintimer}</span><img src={clock} alt="" /> | <img src={star} alt="" />{rate}</h1>
            <main ref={planeRef} className={styles.plane} style={{ opacity: starttimer == 0 ? '1' : '0' }} onMouseDown={(e) => grabbing(e)} onMouseMove={(e) => moving(e)} onMouseUp={() => setisdragging(false)}>
                <img src={plane} alt="" />
            </main>
            {invadersArray.map((v, i) => (<p key={i} style={{ scale: v.good ? invadersscale.value : invadersscale.value, top: v.top, left: v.left, backgroundColor: v.good ? "#658761" : '#AC5045' }} >{v.good ? '1' : '0'}</p>))}

        </div>
    )
}