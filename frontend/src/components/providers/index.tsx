import styles from './styles.module.scss'

import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { announcements } from '../_slices/personsslice'
import getRandom from '../_modules/getRandom'
import loading from '../../assets/svg/providers/loading.svg'
import { addannouncements, doubleprice } from '../_slices/personsslice'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../mainstore';

import silvercoin from '../../assets/svg/coins/silver.svg'
import bronzecoin from '../../assets/svg/coins/bronze.svg'

export default function Provider() {
    const dispatch = useDispatch()
    const popupRef = useRef<HTMLDivElement>(null)

    const announcementsslice: announcements[] = useSelector((state: RootState) => state.persons.announcements);

    const getRandoms = () => {
        return [getRandom(0, 29), getRandom(0, 29), getRandom(0, 29), getRandom(0, 29), getRandom(0, 29), getRandom(0, 29)]
    }

    const [announcements, setannouncements] = useState<announcements[]>([])
    const [inputvalue, setinputvalue] = useState<number>(0)
    const [maxprice, setmaxprice] = useState<number>(0)
    const [currentannouncement, setcurrentannouncement] = useState<number>(0)
    const [ispopupopen, setispopupopen] = useState<boolean>(false)
    const [answers, setanswers] = useState<number[]>(getRandoms())

    const [dealeranswer, setdealeranswer] = useState<number>(-1) //2 - положительный ответ, 1 - удовлетворительный, 0 - отказ

    const [deal, setdeal] = useState<string[]>([]) // 2
    const [concessions, setconcessions] = useState<string[]>([]) // 1
    const [breakdeal, setbreakdeal] = useState<string[]>([]) // 0

    const [refusal, setrefusal] = useState<string[]>([])
    const [agreement, setagreement] = useState<string[]>([])
    const [offers, setoffers] = useState<string[]>([])



    const bidding = () => {
        const rndm = getRandom(0, 100)
        const userpricepercent = Math.floor((inputvalue / maxprice) * 100)
        switch (true) {
            case inputvalue >= maxprice:
                setdealeranswer(2)
                break;
            case rndm < userpricepercent:
                setdealeranswer(1)
                break;
            case rndm >= userpricepercent:
                dispatch(doubleprice(currentannouncement))
                setdealeranswer(0)
                break;
        }
        setTimeout(() => {
            setispopupopen(false)
            setdealeranswer(-1)
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
            })

        announcementsslice.length == 0 ? axios.get('http://localhost:3001/getmaterialannouncement')
            .then((res) => {
                res.data.answer = res.data.answer.endsWith('.') ? res.data.answer.slice(0, -1) : res.data.answer
                res.data.answer.split(';').map((v: string) => {
                    const middleraw = v.split('.')
                    const obj = {
                        name: middleraw[middleraw.length - 2].trim(),
                        materials: middleraw[middleraw.length - 3].split(','),
                        text: middleraw.slice(0, -3).join('.').trim(),
                        date: getRandom(3, 10),
                        imgsrc: getRandom(0, 2) ? `/m/${getRandom(1, 11)}` : `/f/${getRandom(1, 8)}`,
                        price: Number(middleraw[middleraw.length - 1].trim())
                    }
                    setannouncements(an => [...an, obj])
                    dispatch(addannouncements(obj))
                })
            }) : setannouncements(announcementsslice)
    }, [])

    const renderCoins = (currency: number) => {
        return <> &nbsp; {Math.floor(currency / 100) > 0 && (<>{Math.floor(currency / 100)} <img alt='' src={silvercoin} /></>)}  {currency % 100 > 0 && (<>{currency % 100} <img src={bronzecoin} alt="" /></>)}</>
    }


    return (
        <div className={styles.parent} >
            <h1>Доска объявлений</h1>
            <div className={styles.providersarray}>
                {announcements.length == 0 && (<span><img src={loading} alt="" />
                    <h2>идем к доске объявлений..</h2>
                </span>)}
                {announcements.map((v, i) => (
                    <div key={i} className={styles.provider}>
                        <div>
                            <h3>{v.text}</h3>
                            <h2>{v.materials.join(', ')}</h2>
                            <p>Действует еще: <span>{v.date}</span> дней</p>
                            <span><img src={'../src/assets/svg/workers/' + v.imgsrc + '.svg'} alt="" /><p>{v.name}</p></span>
                        </div>
                        <button onClick={() => { setmaxprice(v.price); setispopupopen(true); setcurrentannouncement(i); setanswers(getRandoms()) }}>Ознакомится с ценой</button>
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
                    <p>{agreement[answers[1]]}</p>

                    <p onClick={() => bidding()}>Неа, возьму за <b>  {renderCoins(inputvalue)}   </b></p>

                    <p onClick={() => setispopupopen(false)}>{refusal[answers[2]]}</p>
                    {dealeranswer == 2 && (<span className={styles.dealermessage}><img src={`../src/assets/svg/workers${announcements[currentannouncement].imgsrc}.svg`} alt="" /><p>{deal[answers[3]]}</p></span>)}
                    {dealeranswer == 1 && (<span className={styles.dealermessage}><img src={`../src/assets/svg/workers${announcements[currentannouncement].imgsrc}.svg`} alt="" /><p>{concessions[answers[5]]}</p></span>)}
                    {dealeranswer == 0 && (<span className={styles.dealermessage}><img src={`../src/assets/svg/workers${announcements[currentannouncement].imgsrc}.svg`} alt="" /><p>{breakdeal[answers[4]]}</p></span>)}
                    {dealeranswer == -1 && (<span>
                        <p>1</p>
                        <input type="range" min="1" max={Math.floor(maxprice * 1.3)} value={inputvalue} onChange={(e) => setinputvalue(Number(e.target.value))} />
                        <p>{Math.floor(maxprice * 1.3)}</p>
                    </span>)}
                </div>
            </div>)}
        </div>
    )
}