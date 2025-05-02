import { useSelector, useDispatch } from 'react-redux';
import getRandom from '../_modules/getRandom';

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

import settings from '../../assets/svg/system/settings.svg'
import { RootState } from '../mainstore';
import { useRef,useEffect } from 'react';

export default function Mainscreen() {

    //это вроде данные, которые мы получаем из слайса
    const messengerrange: number = useSelector((state: RootState) => state.base.messengerrange);
    const rumorsstatus: number = useSelector((state: RootState) => state.base.rumorsstatus);
    const workers: number = useSelector((state: RootState) => state.base.workers);
    const goodsPerHour: number = useSelector((state: RootState) => state.base.goodsPerHour);
    const productionArray: number[] = useSelector((state: RootState) => state.base.productionArray);

    const getRumorsText = (): string => {
        switch (Math.round(rumorsstatus)) {
            case 1:
                return 'Most wretched'
            case 2:
                return 'Wretched'
            case 3:
                return 'Not ignoble'
            case 4:
                return 'Virtuous'
            case 5:
                return ' Divine favor'
        }
        return ''
    }




    let productionmax: number = 0
    productionArray.map(v => v > productionmax ? productionmax = v : 0)

    const headerarray = [customer, provider, providerway, rating, upgradegear, worker, ad]
    const coinsarray = [goldencoin, silvercoin, bronze]
    return (
        <div className={styles.parent}>
            <div className={styles.top}>
                <img src={settings} alt="" />
                <header>{headerarray.map((v, i) => (<img src={v} alt={i.toString()} />))}</header>
                <img className={styles.bag} src={bag} alt="" />
                <span className={styles.coins}>
                    {coinsarray.map((v, i) => (<span><p>{i}</p><img src={v} alt="" /></span>))}
                </span>
            </div>
            <main>
                <div>
                    <div className={styles.messenger}>
                        <h2>Every day the messenger brings</h2>
                        <h1>{messengerrange}</h1>
                        <h3>raw materials</h3>
                    </div>
                    <div className={styles.rumors}>
                        <h2>Rumors about you</h2>
                        <h1> {rumorsstatus == 0 ? 'should appear soon' : (<><img alt='' src={'../src/assets/svg/rumors/' + rumorsstatus + '.svg'} /> {getRumorsText()} </>)}</h1>
                    </div>
                    <div className={styles.masters}>
                        <h2>Your masters (number)</h2>
                        <span>{[...new Array(workers)].map(() => (<img alt='' src={'../src/assets/svg/workers/' + getRandom(1, 13) + '.svg'} />))}</span>
                    </div>
                    <div className={styles.produces}>
                        <h2>your business produces</h2>
                        <h1>{goodsPerHour}</h1>
                    </div>
                    <div className={styles.production}>
                        <span>
                            <p>{productionmax}</p>
                            <p>{productionmax / 2}</p>
                            <p>0</p>
                        </span>
                        {productionArray.map((v, i) => (<p style={{ height: `${v / productionmax * 100}%`, background: v / productionmax > .7 ? '#b2f2bb' : v / productionmax > .4 ? '#ffec99' : '#ffc9c9', borderColor: v / productionmax > .7 ? '#2f9e44' : v / productionmax > .4 ? '#f08c00' : '#e03131' }}>{i}</p>))}
                    </div>
                </div>
                <div className={styles.gameplace}>
                  
                </div>
            </main>
        </div>
    )
}