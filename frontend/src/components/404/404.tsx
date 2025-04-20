import notfound from '../../assets/svg/system/404.svg'
import styles from './style.module.scss'


import camels from '../../assets/img/camels.png'
export default function Notfound() {
    return (
        <div className={styles.parent} style={{ backgroundImage: `url('${camels}')` }}>
            <div>
                <h1>Lord, here's 404 camels!</h1>
                <img src={notfound} alt="" />
            </div>
        </div>
    )
}