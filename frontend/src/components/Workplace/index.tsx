import axios from 'axios';
import styles from './styles.module.scss'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useState, useMemo } from 'react';
import { NoteInterface, addtoinventory, removefrominventory, setinventory } from '../_slices/baseslice';
import { RootState } from '../mainstore';

import getRandom from '../_modules/getRandom';
import generatebuyerword from '../_modules/generatebuyerword';

import CombinationGame from '../combinationgame';
import Statistic from './Statistic';
import Client from './Client/index';
import clientissatisfied from '../_modules/clientissatisfied';
import Clock from './Clock';
import Workers from './Workers';
import Sidemenu from './Sidemenu';


import cancel from '../../assets/svg/system/cancel.svg'
import logcabin from '../../assets/svg/maininterface/logcabin.svg'


export default function Workplace({ showsidemenu, setshowsidemenu, seconds, setsleeping }: { showsidemenu: number, setshowsidemenu: React.Dispatch<React.SetStateAction<number>>, seconds: number, setsleeping: React.Dispatch<React.SetStateAction<boolean>> }) {

    const daysorder = useRef<{ time: number, text: string, done: boolean }[]>(null)

    const productionselect = useRef<HTMLDivElement>(null)
    const sidemenuRef = useRef<HTMLDivElement>(null)
    const popupRef = useRef<HTMLDivElement>(null)
    const CombinationGameRef = useRef<HTMLDivElement>(null)

    const dispatch = useDispatch()

    const notes: NoteInterface[] = useSelector((state: RootState) => state.base.notes);
    const rumorsstatus: number = useSelector((state: RootState) => state.base.rumorsstatus);

    const mainproduct: string[] = useSelector((state: RootState) => state.base.mainproduct);
    const buyerlucky: string[] = useSelector((state: RootState) => state.phrase.lucky);
    const buyerrefusal: string[] = useSelector((state: RootState) => state.phrase.refusal);
    const noanswer: string[] = useSelector((state: RootState) => state.phrase.noanswer);
    const wrong: string[] = useSelector((state: RootState) => state.phrase.wrong);


    const inventory: { name: string, count: number }[] = useSelector((state: RootState) => state.base.inventory);

    const [stepscurrent, setstepscurrent] = useState<string[]>([])
    const [productiontitle, setproductiontitle] = useState<string>('')
    const [currentworker, setcurrentworker] = useState<number>(-200)
    const [ispopupopen, setispopupopen] = useState<number>(0)

    const [wrongitem, setwrongitem] = useState<string>('')
    const [buyerword, setbuyerword] = useState<string>('')
    const [buyerstatus, setbuyerstatus] = useState<boolean | null>(null)
    const [buyertime, setbuyertime] = useState<number>(0)
    const [newmoney, setnewmoney] = useState<number>(0)

    const [buyerarray, setbuyerarray] = useState<{ name: string, count: number }[]>([])
    const [becomemoney, setbecomemoney] = useState<boolean>(false)
    const memoizedStatistic = useMemo(() => <Statistic />, []);



    useEffect(() => {
        if (inventory.length === 0) {
            axios.get('http://localhost:3001/getinventory').then((res) => {
                dispatch(setinventory(res.data.inventory))
            });
        }
    }, []);

    useEffect(() => {
        buyerarray.length > 0 && setbuyerarray(ba => {
            let sum = 0;
            ba.map(v => sum += (notes.find(v1 => v1.title == v.name)?.price ?? 1) * v.count);
            setnewmoney(sum); return ba
        })

    }, [buyerarray]);



    const getRumorsText = (): string => {
        switch (Math.round(rumorsstatus)) {
            case 1:
                return 'Преникчемные'
            case 2:
                return 'Убогие'
            case 3:
                return 'Сносные'
            case 4:
                return 'Ладные'
            case 5:
                return 'Преславные'
        }
        return ''
    }

    const clientmidleware = () => {
        buyerarray.some(item => mainproduct.includes(item.name)) ?
            (clientissatisfied(true, setbuyerword, setbuyertime, setispopupopen, setbuyerstatus, daysorder, buyerlucky, buyerrefusal, noanswer, buyertime), setbuyerarray([]), setbecomemoney(true))
            : (generatebuyerword(wrong[getRandom(0, wrong.length - 1)], setwrongitem, daysorder))
    }

    return (<main onClick={(e) => {
        if (sidemenuRef.current && CombinationGameRef.current && !sidemenuRef.current.contains(e.target as Node) && !CombinationGameRef.current.contains(e.target as Node)) {
            setshowsidemenu((ssm: number) => {
                if (ssm != 2) return 0
                else return 2
            })
        }
        if (productionselect.current && !productionselect.current.contains(e.target as Node)) {
            setcurrentworker(-1)
        }
    }}>

        <div>
            <Clock seconds={seconds} setsleeping={setsleeping} />
            <Workers seconds={seconds} productionselect={productionselect} currentworker={currentworker} setcurrentworker={setcurrentworker} />

            {/* ------------------------------ SCREEN BUTTONS ------------------------------ */}

            <div onClick={() => setispopupopen(1)} className={styles.logcabin}>
                <img src={logcabin} alt="" />
                <h2>Зайти на склад</h2>
            </div>
            <div className={styles.rumors}>
                <h2>Слухи о вас</h2>
                <img alt='' src={'../src/assets/svg/rumors/' + Math.round(rumorsstatus) + '.svg'} />
                <h1>{getRumorsText()}</h1>
            </div>
            {/* <div className={styles.messenger}>
                <h2>Every day the messenger brings</h2>
                <h1>{messengerrange}</h1>
                <h3>raw materials</h3>
            </div>
            */}

            {memoizedStatistic}


            <Client setispopupopen={setispopupopen} seconds={seconds} setbuyerword={setbuyerword} buyerword={buyerword} setbuyerstatus={setbuyerstatus} buyerstatus={buyerstatus} setbuyertime={setbuyertime} buyertime={buyertime} daysorder={daysorder} wrongitem={wrongitem} becomemoney={becomemoney} setbecomemoney={setbecomemoney} newmoney={newmoney} setnewmoney={setnewmoney} />

        </div>



        {stepscurrent.length != 0 && (<div ref={CombinationGameRef} className={styles.gameplace}>
            <CombinationGame steps={stepscurrent} setstepscurrent={setstepscurrent} title={productiontitle} />

        </div>)}

        {/* ------------------------------ INVENTORY ------------------------------ */}

        {ispopupopen > 0 && (<div onClick={(e) => {
            axios.post('http://localhost:3001/updateinventory', { inventory: inventory })
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setispopupopen(0)
            }
        }} className={styles.popupwrapper}>
            <div ref={popupRef} className={styles.popup}>
                <div>
                    {inventory.length == 0 ? (<h1>Ваш склад пуст..</h1>) : (<><h1>Вещи на вашем складе</h1><hr />
                        {inventory.map((v, i) => (
                            <ul key={i} onClick={() => {
                                ispopupopen == 2 && (dispatch(removefrominventory(v.name)) && setbuyerarray(ba => {
                                    const itemExists = ba.some(v1 => v1.name === v.name);
                                    if (itemExists) {
                                        return ba.map(v1 => (v1.name === v.name ? { ...v1, count: v1.count + 1 } : v1));
                                    } else {
                                        return [...ba, { name: v.name, count: 1 }];
                                    }
                                })
                                )
                            }} className={styles.dottedlist}>
                                <li>
                                    <span className={styles.text}>{v.name}</span>
                                    <span className={styles.dots}></span>
                                    <span className={styles.number}>{v.count}</span>
                                </li>
                            </ul>
                        ))}</>)}

                </div>
                {ispopupopen == 2 && (<div className={styles.sending}>
                    {buyerarray.length == 0 && (<h2>выберите товар для покупателя</h2>)}
                    {buyerarray.map((v, i) => (<div key={i}>{v.name} x {v.count} <img onClick={() => { setbuyerarray(ba => ba.filter((_, i1) => i1 != i)); dispatch(addtoinventory(v.name)); setwrongitem('') }} src={cancel} alt="" /></div>))}
                    {buyerarray.length > 0 && (<><button onClick={() => clientmidleware()} className={styles.giving}>отдать</button><p>{newmoney}</p></>)}
                </div>)}
            </div>

        </div>)
        }

        {/* ------------------------------ SIDEMENU ------------------------------ */}
        <Sidemenu showsidemenu={showsidemenu} setshowsidemenu={setshowsidemenu} setproductiontitle={setproductiontitle} sidemenuRef={sidemenuRef} setstepscurrent={setstepscurrent}/>

    </main >)
}
