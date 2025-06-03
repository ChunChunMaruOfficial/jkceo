import { useNavigate } from 'react-router-dom'
import notfound from '../../assets/svg/404/sadface.svg'
import styles from './style.module.scss'


export default function Notfound() {
    const navigate = useNavigate()
    return (
        <div className={styles.parent}>
            <img src={notfound} alt="" />
            <div>
                <h1>Ой, кажется мы заблудились(</h1>
                <h2>404</h2>
                <button onClick={() => navigate('../current/workplace')}>вернуться назад</button>
            </div>
        </div>
    )
}