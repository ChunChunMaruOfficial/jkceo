import { useSelector, useDispatch } from 'react-redux';
import Professionformulation from '../Professionformulation';
import { useEffect, useState } from 'react';

import customer from '../../assets/svg/maininterface/customer.svg'
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
import { setmoney } from '../_slices/baseslice';

import Workplace from '../Workplace';
import Workers from '../workers';
import Provider from '../providers';
import Equipment from '../equipment';
import Sleeping from '../sleeping';
import AntiqueInvaders from '../spaceinvaders';
import axios from 'axios';

export default function Mainscreen() {
    const location = useLocation();
    const dispatch = useDispatch()
    const money: number = useSelector((state: RootState) => state.base.money)

    const [showsidemenu, setshowsidemenu] = useState<number>(2)
    const [seconds, setseconds] = useState<number>(720)  //360 - 6 утра 
    const [mainbutton, setmainbutton] = useState<boolean>(false)
    const [sleeping, setsleeping] = useState<boolean>(false)

    useEffect(() => {
        axios.get('http://localhost:3001/getmoney')
            .then((res) => {
                dispatch(setmoney(res.data.money));
            });
        setInterval(() => {
            setseconds(sec => sec + 10)            
        }, 7000) // 150000
    }, [])


    useEffect(() => {
        window.location.pathname == '/current/workplace' ? setmainbutton(true) : setmainbutton(false)
    }, [location.pathname])

    const headerarray = [{ img: customer, text: 'Клиенты', link: 'customer' },
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
                    {coinsarray.map((v, i) => (<span key={i}><p>{Math.floor(i == 0 ? (money / 100) : (i == 1 ? money % 100 / 10 : money % 10))}</p><img src={v} alt="" /></span>))}
                </span>
            </div>
            <Routes>
                <Route path='formulation' element={<Professionformulation />}></Route>
                <Route path='workplace' element={<Workplace showsidemenu={showsidemenu} setshowsidemenu={setshowsidemenu} seconds={seconds} setsleeping={setsleeping}/>}></Route>
                <Route path='workers' element={<Workers />}></Route>
                <Route path='providers' element={<Provider />}></Route>
                <Route path='upgradegear' element={<Equipment />}></Route>
                <Route path='rating' element={<AntiqueInvaders />}></Route>

            </Routes>

            {/* */}
        </div>
    )
}