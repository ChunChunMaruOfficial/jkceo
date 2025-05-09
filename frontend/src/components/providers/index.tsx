import styles from './styles.module.scss'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { announcements } from '../_slices/personsslice'
import getRandom from '../_modules/getRandom'


export default function Provider() {

    const [announcements, setannouncements] = useState<announcements[]>([])
    useEffect(() => {
        console.log('helol');

        axios.get('http://localhost:3001/getmaterialannouncement')
            .then((res) => {
                res.data.answer.split(';').map((v: string) => {
                    const middleraw = v.split('.')
                    const obj = {
                        name: middleraw[middleraw.length - 1].trim(),
                        materials: middleraw[middleraw.length - 2].split(','),
                        text: middleraw.slice(0, -2).join('.').trim(),
                        date: getRandom(3,10),
                        imgsrc: getRandom(0,2) ? `/m/${getRandom(1, 11)}` : `/f/${getRandom(1, 8)}`

                    }
                    console.log(obj);

                    setannouncements(an => [...an, obj])
                })


                // setannouncements();
            })
    }, [])


    return (
        <div className={styles.parent}>
            <h1>Доска объявлений</h1>
            <div className={styles.providersarray}>
                {announcements.map(v => (

                    <div className={styles.provider}>
                    <h3>{v.text}</h3>
                    <h2>{v.materials}</h2>
                    <p>Действует до: {v.date}</p>
                    <span><img src={'../src/assets/svg/workers/' + v.imgsrc + '.svg'} alt="" /><p>{v.name}</p></span>
                </div>
                ))}
            </div>
        </div>
    )
}