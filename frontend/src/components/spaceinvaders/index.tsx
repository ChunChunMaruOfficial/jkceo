import plane from '../../assets/svg/spaceinvaders/plane.svg'
import getRandom from '../_modules/getRandom'

import bronze from '../../assets/svg/coins/bronze.svg'

import styles from './style.module.scss'
import { useEffect, useRef, useState } from 'react'

export default function AntiqueInvaders() {
    const planeRef = useRef<HTMLImageElement>(null)
    const parentRef = useRef<HTMLImageElement>(null)
    let parentwidth = 0
    let parentheight = 0
    const [isdragging, setisdragging] = useState<boolean>(false)
    const [newX, setnewX] = useState<number>(0)
    const [newY, setnewY] = useState<number>(0)
    const [invadersArray, setinvadersArray] = useState<{ top: number, left: number }[]>([{ top: getRandom(-150, -50), left: getRandom(-100, parentRef.current ? (parentwidth + 100) : 300) }])

    const invadersRender = () => {
        setInterval(() => {
            const invaders = Array.from(parentRef.current?.children as HTMLCollectionOf<HTMLElement>).filter(child => child.matches('img'))
            const lastinvader = invaders[invaders.length - 1]
            invaders.map(v => (v.getBoundingClientRect().top >= parentRef.current!.getBoundingClientRect().height) && v.remove())
            lastinvader.getBoundingClientRect().left < (parentwidth / 2) ? (lastinvader.style.left = (lastinvader.getBoundingClientRect().left + getRandom(100, parentwidth)) + 'px') : ((lastinvader.getBoundingClientRect().left + getRandom(100, parentwidth)) + 'px')
            lastinvader.style.top = lastinvader.getBoundingClientRect().top + parentheight + 'px'
            setinvadersArray(invadersArray => [...invadersArray, { top: getRandom(-150, -50), left: getRandom(-100, parentRef.current ? (parentwidth + 100) : 300) }])
        }, 1000)
    }

    const bulletsRender = () => {
        setInterval(() => {
            if (!planeRef.current || !parentRef.current) return 0
            const newbullet = document.createElement('div')
            Array.from(parentRef.current?.children as HTMLCollectionOf<HTMLElement>).filter(child => child.classList.contains(styles.bullet)).map(v => (v.getBoundingClientRect().top == -20) && v.remove())
            newbullet.style.top = planeRef.current!.getBoundingClientRect().top + 'px'
            newbullet.style.left = (planeRef.current!.getBoundingClientRect().left + (planeRef.current!.getBoundingClientRect().width / 2)) + 'px'
            parentRef.current.appendChild(newbullet)
            newbullet.classList.toggle(styles.bullet);
            setTimeout(() => {
                newbullet.style.top = '-20px'
            }, 5);
        }, 500)
    }

    const checkCollision = () => {
        setInterval(() => {
            const invaders = Array.from(parentRef.current?.children as HTMLCollectionOf<HTMLElement>).filter(child => child.matches('img'))
            const bullets = Array.from(parentRef.current?.children as HTMLCollectionOf<HTMLElement>).filter(child => child.matches('div'))
           invaders.map(invader => (bullets.map(bullet => {
            if (
                bullet.getBoundingClientRect().right > invader.getBoundingClientRect().left &&
                bullet.getBoundingClientRect().left < invader.getBoundingClientRect().right &&
                bullet.getBoundingClientRect().bottom > invader.getBoundingClientRect().top &&
                bullet.getBoundingClientRect().top < invader.getBoundingClientRect().bottom
              ) {
             bullet.remove()
             invader.remove()
              
              }
           })))
        }, 16)
    }




    useEffect(() => {
        parentwidth = parentRef.current!.getBoundingClientRect().width
        parentheight = parentRef.current!.getBoundingClientRect().height + 200 //+200!!!!!!!!!!!!
        invadersRender()
        checkCollision()
        bulletsRender()
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
            <main ref={planeRef} className={styles.plane} onMouseDown={(e) => grabbing(e)} onMouseMove={(e) => moving(e)} onMouseUp={() => setisdragging(false)}>
                <img src={plane} alt="" />
            </main>
            {invadersArray.map(v => (<img alt='' style={{ top: v.top, left: v.left }} src={bronze} />))}
        </div>
    )
}