import styles from './styles.module.scss'

import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { announcements } from '../_slices/personsslice'
import getRandom from '../_modules/getRandom'
import loading from '../../assets/svg/providers/loading.svg'
import { addannouncements, setnewprice } from '../_slices/personsslice'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../mainstore';
import { addtoinventory, setmoney } from '../_slices/baseslice'
import renderCoins from '../_modules/renderCoins'

import shrug from '../../assets/svg/providers/shrug.svg'

export default function Provider() {
    const dispatch = useDispatch()
    const popupRef = useRef<HTMLDivElement>(null)

    const announcementsslice: announcements[] = useSelector((state: RootState) => state.persons.announcements);
    const money: number = useSelector((state: RootState) => state.base.money);

    const getRandoms = () => {
        return [getRandom(0, 29), getRandom(0, 29), getRandom(0, 29), getRandom(0, 29), getRandom(0, 29), getRandom(0, 29)]
    }

    const [announcements, setannouncements] = useState<announcements[]>([])
    const [inputvalue, setinputvalue] = useState<number>(0)
    const [maxprice, setmaxprice] = useState<number>(0)
    const [currentannouncement, setcurrentannouncement] = useState<number>(0)
    const [ispopupopen, setispopupopen] = useState<boolean>(false)
    const [answers, setanswers] = useState<number[]>(getRandoms())

    const [dealeranswer, setdealeranswer] = useState<string>('') //2 - положительный ответ, 1 - удовлетворительный, 0 - отказ

    const [notenoughmoney, setnotenoughmoney] = useState<string[]>([]) // нет деняк

    const [deal, setdeal] = useState<string[]>([]) // 2
    const [concessions, setconcessions] = useState<string[]>([]) // 1
    const [breakdeal, setbreakdeal] = useState<string[]>([]) // 0

    const [refusal, setrefusal] = useState<string[]>([])
    const [agreement, setagreement] = useState<string[]>([])
    const [offers, setoffers] = useState<string[]>([])

    useEffect(() => {
        setannouncements(announcementsslice)
    }, [announcementsslice])


    const dealing = (materials: string[], price: number, answer: string) => {

        if ((money - price) > 0) {
            dispatch(setmoney(money - price))
            setdealeranswer(answer)

            materials.map((v) => {
                const match = v.match(/^([^(]+)\((\d+)\)$/);
                if (match) {
                    for (let i = 0; i < parseInt(match[2], 10); i++) {
                        dispatch(addtoinventory(match[1].trim()))
                    }
                }
            })

        } else setdealeranswer(notenoughmoney[answers[3]])

        setTimeout(() => {
            setispopupopen(false)
            setdealeranswer('')
            dispatch(setnewprice([currentannouncement, 0]))
            return 0
        }, 2000)
    }


    const bidding = (materials: string[], price: number) => {
        const rndm = getRandom(0, 100)
        const userpricepercent = Math.floor((inputvalue / maxprice) * 100)
        switch (true) {
            case inputvalue >= maxprice:
                dealing(materials, price, deal[answers[3]])
                break;
            case rndm < userpricepercent:
                dealing(materials, price, concessions[answers[5]])
                return 0
            case rndm >= userpricepercent:
                dispatch(setnewprice([currentannouncement, price * 2]))
                setdealeranswer(breakdeal[answers[4]])
                break;
        }
        setTimeout(() => {
            setispopupopen(false)
            setdealeranswer('')
            return 0
        }, 2000)
    }

    useEffect(() => {

        axios.get('http://localhost:3001/getmessages')
            .then((res) => {
                setoffers(res.data.offers)
                setagreement(res.data.agreement)
                setrefusal(res.data.refusal)
                setdeal(res.data.deal)
                setbreakdeal(res.data.breakdeal)
                setconcessions(res.data.concessions)
                setnotenoughmoney(res.data.notenoughmoney)
            })

        announcementsslice.length == 0 ? axios.get('http://localhost:3001/getmaterialannouncement')
            .then((res) => {
                res.data.answer = res.data.answer.endsWith('.') || res.data.answer.endsWith(';') ? res.data.answer.slice(0, -1) : res.data.answer
                res.data.answer.split(';').map((v: string) => {
                    console.log(v)

                    const middleraw = v.split('.')
                    console.log(middleraw)
                    const obj = {
                        name: middleraw[middleraw.length - 2],
                        materials: middleraw[middleraw.length - 3].split(','),
                        text: middleraw.slice(0, -3).join('.').trim(),
                        date: getRandom(3, 10),
                        imgsrc: getRandom(0, 2) ? `/m/${getRandom(1, 11)}` : `/f/${getRandom(1, 8)}`,
                        price: Number(middleraw[middleraw.length - 1].trim()) / 10
                    }
                    setannouncements(an => [...an, obj])
                    dispatch(addannouncements(obj))
                })
            }) : setannouncements(announcementsslice)
    }, [])

    return (
        <div className={styles.parent} >
            <h1>Доска объявлений</h1>
            <div className={styles.providersarray}>
                {announcements.length == 0 ? (<span><img src={loading} alt="" />
                    <h2>идем к доске объявлений..</h2>
                </span>) : announcements.map((v, i) => (
                    <div key={i} className={styles.provider}>
                        {v.price == 0 && (<span className={styles.notavaible}> <img src={shrug} alt="" /><p>уже раскупили</p></span>)}
                        <div>
                            <h3>{v.text}</h3>
                            <h2>{v.materials.join(', ')}</h2>
                            <p>Действует еще: <span>{v.date}</span> дней</p>
                            <span><img src={'../src/assets/svg/workers/' + v.imgsrc + '.svg'} alt="" /><p>{v.name}</p></span>
                        </div>
                        <button onClick={() => {
                            setmaxprice(v.price); setispopupopen(true);
                            setcurrentannouncement(i); setanswers(getRandoms())
                        }}>Ознакомится с ценой</button>
                    </div>
                ))}
            </div>
            {ispopupopen && (<div onClick={(e) => {
                if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                    setispopupopen(false)
                }
            }} className={styles.popupwrapper}>
                <div ref={popupRef} className={styles.popup}>
                    <h2>{announcements[currentannouncement].materials.join(', ')}</h2>
                    <span className={styles.dealermessage}><img src={`../src/assets/svg/workers${announcements[currentannouncement].imgsrc}.svg`} alt="" /><p>{offers[answers[0]]} <b> {renderCoins(announcements[currentannouncement].price)}</b></p></span>
                    <p onClick={() => dealing(announcements[currentannouncement].materials, announcements[currentannouncement].price, deal[answers[3]])}>{agreement[answers[1]]}</p>

                    <p onClick={() => bidding(announcements[currentannouncement].materials, inputvalue)}>Неа, возьму за <b>  {renderCoins(inputvalue)}</b></p>

                    <p onClick={() => setispopupopen(false)}>{refusal[answers[2]]}</p>

                    {dealeranswer == '' ? (<span>
                        <p>1</p>
                        <input type="range" min="1" max={Math.floor(maxprice * 1.3)} value={inputvalue} onChange={(e) => setinputvalue(Number(e.target.value))} />
                        <p>{Math.floor(maxprice * 1.3)}</p>
                    </span>) : (<span className={styles.dealermessage}><img src={`../src/assets/svg/workers${announcements[currentannouncement].imgsrc}.svg`} alt="" /><p>{dealeranswer}</p></span>)}
                </div>
            </div>)}
        </div>
    )
}