import { useSelector, useDispatch } from 'react-redux';
import Professionformulation from '../Professionformulation';
import { useState } from 'react';

import customer from '../../assets/svg/maininterface/customer.svg'
import provider from '../../assets/svg/maininterface/provider.svg'
import providerway from '../../assets/svg/maininterface/providerway.svg'
import rating from '../../assets/svg/maininterface/rating.svg'
import upgradegear from '../../assets/svg/maininterface/upgradegear.svg'
import worker from '../../assets/svg/maininterface/worker.svg'
import ad from '../../assets/svg/maininterface/ad.svg'

import bag from '../../assets/svg/coins/bag.svg'

import goldencoin from '../../assets/svg/coins/gold.svg'
import silvercoin from '../../assets/svg/coins/silver.svg'
import bronze from '../../assets/svg/coins/bronze.svg'

import styles from './style.module.scss'

import { Route, Routes } from 'react-router-dom';
import notes from '../../assets/svg/maininterface/notes.svg'
import { RootState } from '../mainstore';
import Workplace from '../Workplace';

export default function Mainscreen() {
    const [showsidemenu, setshowsidemenu] = useState<number>(2)

    //это вроде данные, которые мы получаем из слайса
    const money: number = useSelector((state: RootState) => state.base.money)
    const headerarray = [customer, provider, providerway, rating, upgradegear, worker, ad]
    const coinsarray = [goldencoin, silvercoin, bronze]

    return (
        <div className={styles.parent}>
            <div className={styles.top}>
                <img onClick={() => setshowsidemenu(1)} src={notes} alt="" />
                <header>{headerarray.map((v, i) => (<img src={v} alt={i.toString()} />))}</header>
                <img className={styles.bag} src={bag} alt="" />
                <span className={styles.coins}>
                    {coinsarray.map((v, i) => (<span><p>{Math.floor(i == 0 ? (money / 100) : (i == 1 ? money % 100 / 10 : money % 10))}</p><img src={v} alt="" /></span>))}
                </span>
            </div>
            <Routes>
                <Route path='formulation' element={<Professionformulation />}></Route>

                    <Route path='workplace' element={<Workplace showsidemenu={showsidemenu} setshowsidemenu={setshowsidemenu} />}></Route>

            </Routes>

            {/* */}
        </div>
    )
}