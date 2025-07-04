import styles from './style.module.scss'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import getRandom from '../../_modules/getRandom'
import generatebuyerword from '../../_modules/generatebuyerword'
import { setrefusal, setlucky, setwrong, setnoanswer } from '../../_slices/phraseslice'
import { setmoney } from '../../_slices/baseslice'
import { RootState } from '../../mainstore'

import clientissatisfied from '../../_modules/clientissatisfied'
import talksound from '../../../assets/sounds/talk.wav'
import likeatable from '../../../assets/svg/maininterface/likeatable.svg'
import dis from '../../../assets/svg/maininterface/buyerreaction/dis.svg'
import ok from '../../../assets/svg/maininterface/buyerreaction/ok.svg'
import back from '../../../assets/svg/system/back.svg'
import money from '../../../assets/svg/buyer/money.svg'

export default function Client({ setispopupopen, seconds, setbuyerword, buyerword, setbuyerstatus, buyerstatus, setbuyertime, buyertime, daysorder, wrongitem, becomemoney, setbecomemoney, newmoney, setnewmoney, isshield, setisshield }: { setispopupopen: React.Dispatch<React.SetStateAction<number>>, seconds: number, setbuyerword: React.Dispatch<React.SetStateAction<string>>, buyerword: string, setbuyerstatus: React.Dispatch<React.SetStateAction<boolean | null>>, buyerstatus: boolean | null, setbuyertime: React.Dispatch<React.SetStateAction<number>>, buyertime: number, daysorder: React.MutableRefObject<{ time: number; text: string; done: boolean }[] | null>, wrongitem: string, becomemoney: boolean, setbecomemoney: React.Dispatch<React.SetStateAction<boolean>>, newmoney: number, setnewmoney: React.Dispatch<React.SetStateAction<number>>, isshield: boolean, setisshield: React.Dispatch<React.SetStateAction<boolean>> }) {

    const dispatch = useDispatch()
    const talksoundRef = useRef<HTMLAudioElement>(null)
    const rumorsstatus: number = useSelector((state: RootState) => state.base.rumorsstatus);
    const day: number = useSelector((state: RootState) => state.base.day);
    const mymoney: number = useSelector((state: RootState) => state.base.money);

    const [buyerpfp, setbuyerpfp] = useState<string>('')


    const buyerlucky: string[] = useSelector((state: RootState) => state.phrase.lucky);
    const buyerrefusal: string[] = useSelector((state: RootState) => state.phrase.refusal);
    const noanswer: string[] = useSelector((state: RootState) => state.phrase.noanswer);


    useEffect(() => {
        axios.get('http://localhost:3001/getselleranswers').then((res) => {
            dispatch(setrefusal(res.data.refuse))
            dispatch(setlucky(res.data.lucky))
            dispatch(setwrong(res.data.wrong))
            dispatch(setnoanswer(res.data.noanswer))
        })
    }, [])

    useEffect(() => {
        if (buyerword.length > 0 && talksoundRef.current) {
            talksoundRef.current.play().catch(e => console.log("Audio play failed:", e));
        }
    }, [buyerword]);

    useEffect(() => {
        day > 0 && axios.post('http://localhost:3001/getorder', { count: getRandom(1, 5) * Math.round(rumorsstatus) }).then((res) => {
            const answer = res.data.answer.split('?').join('?.').split('.')
            daysorder.current = Array.from({ length: answer.length - 1 }, (_, i) => ({
                time: getRandom(370 * 1.2, 1320),
                text: answer[i].trim(),
                done: false
            }))
            daysorder.current = daysorder.current.filter((v) => v.text.length > 8)
        })
    }, [day])

    useEffect(() => {
        becomemoney == true && setTimeout(() => {
            dispatch(setmoney([mymoney + newmoney, false]))
            setbecomemoney(false)
            setnewmoney(0)
        }, 4000)
    }, [becomemoney])

    useEffect(() => {
        isshield && (setbuyerword(''), setbuyertime(0))
    }, [isshield])


    const startbuyertimer = () => {
        const buyertimeInterval = setInterval(() => {
            setbuyertime(bt => {
                bt == 0 && clearInterval(buyertimeInterval);
                if (bt < 1.5 && bt != 0) {
                    setispopupopen(0)
                    clearInterval(buyertimeInterval);
                    clientissatisfied(false, setbuyerword, setbuyertime, setispopupopen, setbuyerstatus, daysorder, buyerlucky, buyerrefusal, noanswer, buyertime);
                    return 0
                }
                else return bt - .3
            })
        }, 50)
    }


    useEffect(() => {
        if (!daysorder.current || isshield) return;

        const order = daysorder.current.find(v =>
            v.time < seconds && !v.done && buyerword === ''
        );

        if (order) {
            setbuyerword(' ');
            setbuyertime(100);
            setbuyerpfp(getRandom(0, 1) ? `/m/${getRandom(1, 11)}` : `/f/${getRandom(1, 8)}`);

            setTimeout(() => {
                generatebuyerword(order.text, setbuyerword, daysorder, daysorder.current!.indexOf(order));
                startbuyertimer();
            }, 27);
        }
    }, [seconds, buyerword, isshield]);


    return (<>
        <div id={styles.clientwrapper}>
            <div onClick={() => isshield == true && setisshield(false)} className={isshield ? (styles.shield + ' ' + styles.active) : styles.shield}>
                {[...Array(4)].map((_, i) => (<span key={i}></span>))}
                <button onClick={() => setisshield(true)} className={styles.close}><img src={back} alt="" /></button>
            </div>
            <div className={styles.time} style={{ background: buyertime > 0 ? `linear-gradient(to right, #CB997E ${buyertime}%, rgba(255, 0, 0, 0) 10%)` : 'none' }}></div>
            <div className={styles.client}>
                <audio ref={talksoundRef} src={talksound}></audio>
                <p>{buyerword}</p>
                <div>
                    {buyerword && (<img className={buyerstatus == null ? (styles.clientimg + ' ' + styles.clientscomming) : (buyerstatus == true ? (styles.clientimg + ' ' + styles.clientsatisfied) : (styles.clientimg + ' ' + styles.clientdissatisfied))} src={`../src/assets/svg/workers${buyerpfp}.svg`} alt="" />)}
                    <img className={styles.likeatable} src={likeatable} alt="" />
                </div>
                {becomemoney && (<span className={styles.money}>
                    <p> + {newmoney}</p>
                    <img src={money} alt="" />
                </span>)}
            </div>
            {buyerword && buyertime > 0 && (<span className={styles.bottompanel}>
                <button onClick={() => clientissatisfied(false, setbuyerword, setbuyertime, setispopupopen, setbuyerstatus, daysorder, buyerlucky, buyerrefusal, noanswer, buyertime)}><img src={dis} /></button>
                <button onClick={() => setispopupopen(2)}><img src={ok} /></button>
            </span>)}
        </div>
        {wrongitem.length > 0 && (<div id={styles.wrongitem}>
            <p>{wrongitem}</p>
            <img src={`../src/assets/svg/workers${buyerpfp}.svg`} alt="" />
        </div>)}
    </>
    )
}