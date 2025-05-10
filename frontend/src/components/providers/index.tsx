import styles from './styles.module.scss'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { announcements } from '../_slices/personsslice'
import getRandom from '../_modules/getRandom'
import loading from '../../assets/svg/providers/loading.svg'
import cancel from '../../assets/svg/providers/cancel.svg'


export default function Provider() {
    const [announcements, setannouncements] = useState<announcements[]>([])
    const [inputvalue, setinputvalue] = useState(0)


    useEffect(() => {
        axios.get('http://localhost:3001/getmaterialannouncement')
            .then((res) => {
                res.data.answer.split(';').map((v: string) => {
                    const middleraw = v.split('.')
                    const obj = {
                        name: middleraw[middleraw.length - 1].trim(),
                        materials: middleraw[middleraw.length - 2].split(','),
                        text: middleraw.slice(0, -2).join('.').trim(),
                        date: getRandom(3, 10),
                        imgsrc: getRandom(0, 2) ? `/m/${getRandom(1, 11)}` : `/f/${getRandom(1, 8)}`
                    }
                    setannouncements(an => [...an, obj])
                })
            })
    }, [])


    return (
        <div className={styles.parent}>
            <h1>Доска объявлений</h1>
            <div className={styles.providersarray}>
                {announcements.length == 0 && (<span><img src={loading} alt="" />
                    <h2>идем к доске объявлений..</h2>
                </span>)}
                {announcements.map(v => (

                    <div className={styles.provider}>
                        <div>
                            <h3>{v.text}</h3>
                            <h2>{v.materials}</h2>
                            <p>Действует еще: <span>{v.date}</span> дней</p>
                            <span><img src={'../src/assets/svg/workers/' + v.imgsrc + '.svg'} alt="" /><p>{v.name}</p></span>
                        </div>
                        <button>Ознакомится с ценой</button>
                    </div>
                ))}
            </div>
            <div className={styles.popup}>
                <span>
                    <img src={cancel} alt="" />
                    <h1>Предложи свою цену</h1>
                </span>
                <span><p>0</p>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={inputvalue}
                            onChange={(e) => setinputvalue(Number(e.target.value))}
                            className={styles.rangeinput}
                            data-value={`${inputvalue}px`} 
                            style={{
                                '--thumb-value': `"${inputvalue}"`,
                                '--thumb-pos': `${inputvalue}%`
                              } as React.CSSProperties}
                      
                            />
                            


                    <p>1000</p></span>

                <span><button>Купить за цену продавца</button><button>Предложить свою цену</button></span>
            </div>
        </div>
    )
}