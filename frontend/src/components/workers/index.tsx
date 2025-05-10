import styles from './style.module.scss'
import getRandom from '../_modules/getRandom'

import axios from 'axios'
import { useEffect, useState } from 'react'
import approval from '../../assets/svg/system/approval.svg'
import Questioning from '../../assets/svg/system/Questioning.svg'
import bronze from '../../assets/svg/coins/bronze.svg'
import silver from '../../assets/svg/coins/silver.svg'
import deal from '../../assets/svg/workers/deal.svg'
import { RootState } from '../mainstore';
import { useSelector } from 'react-redux';
import { worker } from '../_slices/baseslice'
import { useDispatch } from 'react-redux'
import { setworkers, deleteworker } from '../_slices/personsslice'
import { addworker } from '../_slices/baseslice'

export default function Workers() {
    const workers: worker[] = useSelector((state: RootState) => state.base.workersarray); //мои
    const newworkers: worker[] = useSelector((state: RootState) => state.persons.workers); // не мои

    const dispatch = useDispatch()

    const [workersarray, setworkersarray] = useState<worker[]>([])
    const [storycurrent, setstorycurrent] = useState<string>('')
    const [newworker, setnewworker] = useState<boolean>(false)
    const [getmoretext, setgetmoretext] = useState<string>('Смотреть дальше..')
    const [currentworker, setcurrentworker] = useState<worker | null>()

    const addworkerfunc = (worker: worker) => {
        setcurrentworker(null)
        dispatch(addworker(worker))
        dispatch(deleteworker(worker))
        setworkersarray(wa => wa.filter(v => v != worker))
        setnewworker(true)
        setTimeout(() => {
            setnewworker(false)
        }, 2000)
    }

    const getcurrent = (v1: string[]) => {
        setstorycurrent('loading')
        axios.post('http://localhost:3001/getstory', { worker: v1.join(',') }).then((res) => {
            setstorycurrent(res.data.answer);
        })
    }

    const getworkers = () => {
        setgetmoretext('Перелистываем страницу..')
        axios.get('http://localhost:3001/getworkers').then((res) => {
            res.data.answer.slice(0, -1).split('.').map((v: string) => {
                const v1 = v.split(',');
                const income = getRandom(80, 500)
                const workerdata: worker = { name: v1[0], surname: v1[1], age: v1[2], sex: v1[3], prof: v1[4], imgsrc: v1[3].toLowerCase().trim() == 'мужской' ? `/m/${getRandom(1, 11)}` : `/f/${getRandom(1, 8)}`, income: income, efficiency: Math.round(income / Math.PI) }
                setworkersarray(workersarray => [...workersarray, workerdata])
                dispatch(setworkers(workerdata))
            })
            setgetmoretext('Смотреть дальше..')
        })
    }

    useEffect(() => {
        newworkers.length == 0 ? getworkers() : setworkersarray(newworkers)
    }, [])

    return (

        <div className={styles.parent}>
            <div>
                <h1>Наймите себе <span>раб</span>отника ({workersarray.length}): </h1>
               { workers.length > 0 && !currentworker && !newworker && <h1>Ваши рабочие:</h1>}
            </div>
            <main>
                <div className={styles.list}>

                    {workersarray.length > 0 ? workersarray.map((v) =>
                    (<div onClick={() => { setnewworker(false); setcurrentworker(v), getcurrent(Object.values(v)) }}>
                        <img alt='' src={'../src/assets/svg/workers/' + v.imgsrc + '.svg'} />
                        <span><h2>{v.name} {v.surname}</h2><p>{v.age} лет • {v.sex} • {v.prof}</p></span>
                        <h2>Желаемый заработок: {Math.floor(v.income / 100) > 0 && (<>{Math.floor(v.income / 100)} <img alt='' src={silver} /></>)}   {v.income % 100} <img src={bronze} alt="" /></h2>
                    </div>)) : (<span className={styles.loading}><img src={approval} alt="" /><p>Смотрим на доску объявлений..</p></span>)}
                    {workersarray.length > 0 && (<button onClick={() => getworkers()}>{getmoretext}</button>)}
                </div>
                {currentworker && (storycurrent != 'loading' ? (<div className={styles.currentworker}>
                    <img src={'../src/assets/svg/workers/' + currentworker?.imgsrc + '.svg'} alt="" />
                    <div>
                        <h1>{currentworker?.name} {currentworker?.surname}</h1>
                        <div><h2><span>Возраст:</span> {currentworker?.age}</h2><h2><span>Пол:</span> {currentworker?.sex}</h2><h2><span>Специальность:</span>{currentworker?.prof}</h2><h2><span>Мастерство:</span> {currentworker?.efficiency}</h2> </div>
                        <h3>{storycurrent}</h3>
                        <h2>Желаемый заработок: {Math.floor(currentworker?.income / 100) > 0 && (<>{Math.floor(currentworker?.income / 100)} <img alt='' src={silver} /></>)}   {currentworker?.income % 100} <img src={bronze} alt="" /></h2>
                        <div><button onClick={() => setcurrentworker(null)}>Пропуск</button><button onClick={() => addworkerfunc(currentworker)}>Нанять</button></div>
                    </div>
                </div>) : (<span className={styles.loading}><img src={Questioning} alt="" /><p>Пытаемся разобрать подчерк..</p></span>))}
                {newworker && (<span className={styles.loading}><img src={deal} alt="" /><p>Новый коллега выйдет на работу завтра</p></span>)}
                {!newworker && !currentworker && (<div className={styles.myworkers}>{workers.map((v) => (
                    <div>
                        <img alt='' src={'../src/assets/svg/workers/' + v.imgsrc + '.svg'} />
                        <span><h2>{v.name} {v.surname}</h2><p>{v.age} лет • {v.sex} • {v.prof}</p></span>
                        <h2>Заработок: {Math.floor(v.income / 100) > 0 && (<>{Math.floor(v.income / 100)} <img alt='' src={silver} /></>)}   {v.income % 100} <img src={bronze} alt="" /></h2>
                    </div>
                ))}</div>)}
            </main>
        </div>
    )
}