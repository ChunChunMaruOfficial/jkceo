import styles from './styles.module.scss'
import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useMemo, useEffect } from 'react';
import { RootState } from '../mainstore';

import CombinationGame from '../combinationgame';
import Statistic from './Statistic';
import Client from './Client/index';

import Clock from './Clock';
import Workers from './Workers';
import Sidemenu from './Sidemenu';
import Inventory from './Inventory';
import logcabin from '../../assets/svg/maininterface/logcabin.svg'


export default function Workplace({ isspeedup, setisspeedup, showsidemenu, setshowsidemenu, seconds, setsleeping }: { isspeedup: boolean, setisspeedup: React.Dispatch<React.SetStateAction<boolean>>, showsidemenu: number, setshowsidemenu: React.Dispatch<React.SetStateAction<number>>, seconds: number, setsleeping: React.Dispatch<React.SetStateAction<boolean>> }) {

    const daysorder = useRef<{ time: number, text: string, done: boolean }[]>(null)

    const productionselect = useRef<HTMLDivElement>(null)
    const sidemenuRef = useRef<HTMLDivElement>(null)
    const CombinationGameRef = useRef<HTMLDivElement>(null)

    const rumorsstatus: number = useSelector((state: RootState) => state.base.rumorsstatus);
    const inventory: { name: string, count: number }[] = useSelector((state: RootState) => state.base.inventory);


    const [countofitems, setcountofitems] = useState<number>(0)
    const [stepscurrent, setstepscurrent] = useState<string[]>([])
    const [productiontitle, setproductiontitle] = useState<string>('')
    const [currentworker, setcurrentworker] = useState<number>(-200)
    const [ispopupopen, setispopupopen] = useState<number>(0)
    const [isshield, setisshield] = useState<boolean>(false)
    const [wrongitem, setwrongitem] = useState<string>('')
    const [buyerword, setbuyerword] = useState<string>('')
    const [buyerstatus, setbuyerstatus] = useState<boolean | null>(null)
    const [buyertime, setbuyertime] = useState<number>(0)
    const [newmoney, setnewmoney] = useState<number>(0)

    const [becomemoney, setbecomemoney] = useState<boolean>(false)
    const memoizedStatistic = useMemo(() => <Statistic />, []);


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


    useEffect(() => {
        let sum = 0
        inventory.map(v => {
            sum += v.count
        })
        setcountofitems(sum)
    }, [inventory]);

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
            <Clock isspeedup={isspeedup} setisspeedup={setisspeedup} seconds={seconds} setsleeping={setsleeping} setisshield={setisshield} />
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


            <Client setispopupopen={setispopupopen} seconds={seconds} setbuyerword={setbuyerword} buyerword={buyerword} setbuyerstatus={setbuyerstatus} buyerstatus={buyerstatus} setbuyertime={setbuyertime} buyertime={buyertime} daysorder={daysorder} wrongitem={wrongitem} becomemoney={becomemoney} setbecomemoney={setbecomemoney} newmoney={newmoney} setnewmoney={setnewmoney} isshield={isshield} setisshield={setisshield} />

        </div>



        {stepscurrent.length != 0 && (<div ref={CombinationGameRef} className={styles.gameplace}>
            <CombinationGame steps={stepscurrent} setstepscurrent={setstepscurrent} title={productiontitle} countofitems={countofitems} />

        </div>)}

        {/* ------------------------------ INVENTORY ------------------------------ */}

        <Inventory ispopupopen={ispopupopen} setispopupopen={setispopupopen} newmoney={newmoney} setnewmoney={setnewmoney} setwrongitem={setwrongitem} setbuyerword={setbuyerword} setbuyertime={setbuyertime} buyertime={buyertime} daysorder={daysorder} setbuyerstatus={setbuyerstatus} setbecomemoney={setbecomemoney} countofitems={countofitems} />

        <Sidemenu showsidemenu={showsidemenu} setshowsidemenu={setshowsidemenu} setproductiontitle={setproductiontitle} sidemenuRef={sidemenuRef} setstepscurrent={setstepscurrent} />

    </main >)
}
