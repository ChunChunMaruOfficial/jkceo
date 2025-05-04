import { useSelector, useDispatch } from 'react-redux';
import styles from './styles.module.scss'
import { RootState } from '../mainstore';
import getRandom from '../_modules/getRandom';
import back from '../../assets/svg/system/back.svg'
import CombinationGame from '../combinationgame';


export default function Workplace({ showsidemenu, setshowsidemenu }: { showsidemenu: number, setshowsidemenu: any }) {
    const workers: number = useSelector((state: RootState) => state.base.workers);
    const goodsPerHour: number = useSelector((state: RootState) => state.base.goodsPerHour);
    const messengerrange: number = useSelector((state: RootState) => state.base.messengerrange);
    const rumorsstatus: number = useSelector((state: RootState) => state.base.rumorsstatus);
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

    return (<main>

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
                <span>{[...new Array(workers)].map(() => (<img alt='' src={'../src/assets/svg/workers/' + getRandom(1, 18) + '.svg'} />))}</span>
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
        <CombinationGame/>

        </div>
        <div className={styles.sidemenu + ' ' + (showsidemenu == 0 ? styles.hidesidemenu : showsidemenu == 1 && styles.showsidemenu)}><span><img onClick={() => setshowsidemenu(0)} src={back} alt="" /><h1>Здесь будут ваши записи</h1></span>
            <div>
                <div>
                    <h2>TEst</h2>
                    <p>dkfjgnjk</p>
                    <p>hklehfg</p>
                    <p>lkdjfgglkdfj</p>
                    <p>gflkhjfglj</p>
                </div>

            </div>
        </div>
    </main>)
}