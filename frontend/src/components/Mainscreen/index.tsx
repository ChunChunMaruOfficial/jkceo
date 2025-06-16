import { useSelector, useDispatch } from 'react-redux';
import Professionformulation from '../Professionformulation';
import { useEffect, useRef, useState } from 'react';

import skills from '../../assets/svg/maininterface/skills.svg'
import provider from '../../assets/svg/maininterface/provider.svg'
import rating from '../../assets/svg/maininterface/rating.svg'
import upgradegear from '../../assets/svg/maininterface/upgradegear.svg'
import worker from '../../assets/svg/maininterface/worker.svg'

import home from '../../assets/svg/maininterface/home.svg'
import bag from '../../assets/svg/coins/bag.svg'

import goldencoin from '../../assets/svg/coins/gold.svg'
import silvercoin from '../../assets/svg/coins/silver.svg'
import bronzecoin from '../../assets/svg/coins/bronze.svg'

import styles from './style.module.scss'

import { Link, Route, Routes, useLocation } from 'react-router-dom';
import notes from '../../assets/svg/maininterface/notes.svg'
import { RootState } from '../mainstore';
import { setmoney, setinventory, setday, setproductionArray } from '../_slices/baseslice';
import Workplace from '../Workplace';
import Workers from '../workers';
import Provider from '../providers';
import Equipment from '../equipment';
import Sleeping from '../sleeping';
import AntiqueInvaders from '../spaceinvaders';
import Skills from '../Skills';
import axios from 'axios';
import { setskills } from '../_slices/skillsslice';



export default function Mainscreen() {
    const location = useLocation();
    const dispatch = useDispatch();
    const secondsRef = useRef<NodeJS.Timeout | null>(null);
    const money: number = useSelector((state: RootState) => state.base.money)
    const [showsidemenu, setshowsidemenu] = useState<number>(2)
    const [seconds, setseconds] = useState<number>(360)
    const [mainbutton, setmainbutton] = useState<boolean>(false)
    const [sleeping, setsleeping] = useState<boolean>(false)
    const [isspeedup, setisspeedup] = useState<boolean>(false)

    useEffect(() => {
        axios.get('http://localhost:3001/getstartstates')
            .then((res) => {
                dispatch(setinventory(res.data.inventory));
                dispatch(setday(res.data.day));
                dispatch(setproductionArray(res.data.productionArray));
                setseconds(res.data.seconds)
                dispatch(setskills(res.data.skills));
                dispatch(setmoney(res.data.money));
            });
    }, [])


    useEffect(() => {
        window.location.pathname == '/current/workplace' ? setmainbutton(true) : setmainbutton(false)
    }, [location.pathname])

    useEffect(() => {
        if (secondsRef.current != null) {
            clearInterval(secondsRef.current)
        }
        secondsRef.current = setInterval(() => {
            setseconds(sec => {
                if (sec % 60 == 0) {
                    axios.post('http://localhost:3001/settime', { time: sec })
                } return sec + 10
            })

        }, isspeedup ? 2000 : 6500)
    }, [isspeedup])

    const headerarray = [{ img: skills, text: 'Навыки', link: 'skills' },
    { img: provider, text: 'Поставка', link: 'providers' },
    { img: rating, text: 'Огласка', link: 'rating' },
    { img: upgradegear, text: 'Оборудование', link: 'upgradegear' },
    { img: worker, text: 'Рабочие', link: 'workers' }]

    const coinsarray = [goldencoin, silvercoin, bronzecoin]

    return (
        <div className={styles.parent}>
            {sleeping && (<Sleeping hour={Math.floor((seconds / 60) % 24)} sethour={setseconds} setsleeping={setsleeping} />)}
            <div className={styles.top}>
                <Link to={!mainbutton ? '../current/workplace' : ''}><img onClick={() => mainbutton && setshowsidemenu(1)} src={mainbutton ? notes : home} alt="" /></Link>
                <header>{headerarray.map((v, i) => (<Link key={i} onClick={() => setshowsidemenu(2)} to={'../current/' + v.link}><span><img src={v.img} alt={i.toString()} /><p>{v.text}</p></span></Link>))}</header>
                <img className={styles.bag} src={bag} alt="" />
                <span className={styles.coins}>
                    {coinsarray.map((v, i) => (<span key={i}><p>{Math.floor(i == 0 ? (money / 10000) : (i == 1 ? money % 1000 / 100 : money % 100))}</p><img src={v} alt="" /></span>))}
                </span>
            </div>
            <Routes>
                <Route path='formulation' element={<Professionformulation />}></Route>
                <Route path='workplace' element={<Workplace isspeedup={isspeedup} setisspeedup={setisspeedup} showsidemenu={showsidemenu} setshowsidemenu={setshowsidemenu} seconds={seconds} setsleeping={setsleeping} />}></Route>
                <Route path='workers' element={<Workers />}></Route>
                <Route path='providers' element={<Provider />}></Route>
                <Route path='upgradegear' element={<Equipment />}></Route>
                <Route path='rating' element={<AntiqueInvaders />}></Route>
                <Route path='skills' element={<Skills />}></Route>

            </Routes>

            {/* */}
        </div>
    )
}