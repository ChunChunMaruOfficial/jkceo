import { useSelector, useDispatch } from 'react-redux';
import Professionformulation from '../Professionformulation';
import { useEffect, useState } from 'react';

import customer from '../../assets/svg/maininterface/customer.svg'
import provider from '../../assets/svg/maininterface/provider.svg'
import providerway from '../../assets/svg/maininterface/providerway.svg'
import rating from '../../assets/svg/maininterface/rating.svg'
import upgradegear from '../../assets/svg/maininterface/upgradegear.svg'
import worker from '../../assets/svg/maininterface/worker.svg'
import ad from '../../assets/svg/maininterface/ad.svg'

import home from '../../assets/svg/maininterface/home.svg'
import bag from '../../assets/svg/coins/bag.svg'

import goldencoin from '../../assets/svg/coins/gold.svg'
import silvercoin from '../../assets/svg/coins/silver.svg'
import bronze from '../../assets/svg/coins/bronze.svg'

import styles from './style.module.scss'

import { Link, Route, Routes,useLocation  } from 'react-router-dom';
import notes from '../../assets/svg/maininterface/notes.svg'
import { RootState } from '../mainstore';
import Workplace from '../Workplace';
import Workers from '../workers';


export default function Mainscreen() {
    const location = useLocation();

    const [showsidemenu, setshowsidemenu] = useState<number>(2)
    const [seconds, setseconds] = useState<number>(360)
    const [mainbutton, setmainbutton] = useState<boolean>(false)

    useEffect(() => {
        setInterval(() => {
            setseconds(sec => sec + 10)
        }, 15000)
    }, [])
    useEffect(() => {
        window.location.pathname == '/current/workplace' ? setmainbutton(true) : setmainbutton(false)
        console.log(mainbutton);
        
    }, [location.pathname])


    //это вроде данные, которые мы получаем из слайса
    const money: number = useSelector((state: RootState) => state.base.money)

    const headerarray = [{ img: customer, text: 'Клиенты', link: 'customer' },
    { img: provider, text: 'Поставка', link: 'providers' },
    { img: providerway, text: 'Маршрут поставок', link: 'providerways' },
    { img: rating, text: 'Огласка', link: 'rating' },
    { img: upgradegear, text: 'Оборудование', link: 'upgradegear' },
    { img: worker, text: 'Рабочие', link: 'workers' },
    { img: ad, text: 'Реклама', link: 'ad' }]

    const coinsarray = [goldencoin, silvercoin, bronze]

    return (
        <div className={styles.parent}>
            <div  className={styles.top}>
                <Link to={!mainbutton ? '../current/workplace' : '' }><img onClick={() => mainbutton && setshowsidemenu(1)} src={mainbutton ? notes : home} alt="" /></Link>
                <header>{headerarray.map((v, i) => (<Link onClick={() => setshowsidemenu(2)} to={'../current/' + v.link}><span><img src={v.img} alt={i.toString()} /><p>{v.text}</p></span></Link>))}</header>
                <img className={styles.bag} src={bag} alt="" />
                <span className={styles.coins}>
                    {coinsarray.map((v, i) => (<span><p>{Math.floor(i == 0 ? (money / 100) : (i == 1 ? money % 100 / 10 : money % 10))}</p><img src={v} alt="" /></span>))}
                </span>
            </div>
            <Routes>
                <Route path='formulation' element={<Professionformulation />}></Route>
                <Route path='workplace' element={<Workplace showsidemenu={showsidemenu} setshowsidemenu={setshowsidemenu} seconds={seconds} />}></Route>
                <Route path='workers' element={<Workers />}></Route>

            </Routes>

            {/* */}
        </div>
    )
}