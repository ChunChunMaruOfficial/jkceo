import styles from './style.module.scss'
import getRandom from '../_modules/getRandom'

import axios from 'axios'
import { useEffect, useState } from 'react'
import approval from '../../assets/svg/system/approval.svg'
import Questioning from '../../assets/svg/system/Questioning.svg'
import cancel from '../../assets/svg/system/cancel.svg'
import renderCoins from '../_modules/renderCoins'
import deal from '../../assets/svg/workers/deal.svg'
import facepalm from '../../assets/svg/workers/facepalm.svg'
import noworkers from '../../assets/svg/workers/noworkers.svg'
import { RootState } from '../mainstore';
import { useSelector } from 'react-redux';
import { workerInterface } from '../_Interfaces/workerInterface'
import { useDispatch } from 'react-redux'
import { setworkers, deleteworker, addaworker } from '../_slices/personsslice'
import { addworker, deletemyworker } from '../_slices/baseslice'

export default function Workers() {
    const workers: workerInterface[] = useSelector((state: RootState) => state.base.workersarray); //мои
    const newworkers: workerInterface[] = useSelector((state: RootState) => state.persons.workers); // не мои
    const workersmax = useSelector((state: RootState) => state.skills.workersmax);
    const dispatch = useDispatch()

    const [workersarray, setworkersarray] = useState<workerInterface[]>([])
    const [storycurrent, setstorycurrent] = useState<string>('')
    const [newworker, setnewworker] = useState<number>(0)
    const [sumincome, setsumincome] = useState<number>(0)
    const [getmoretext, setgetmoretext] = useState<string>('Смотреть дальше..')
    const [currentworker, setcurrentworker] = useState<workerInterface | null>()

    const addworkerfunc = (worker: workerInterface) => {
        console.log('addworker');
        
        if (workers.length >= workersmax.value) {
            setnewworker(2)
            setTimeout(() => {
                setnewworker(0)
                setcurrentworker(null)
            }, 2000)
            return 0
        }
        setcurrentworker(null)
        dispatch(addworker(worker))
        dispatch(deleteworker(worker))
        setworkersarray(wa => wa.filter(v => v != worker))

        axios.post('http://localhost:3001/addnewworker', { worker: worker })
        setnewworker(1)
        setTimeout(() => {
            setnewworker(0)
        }, 2000)
    }

    const deletecurrentworker = (worker: workerInterface) => {
                console.log('deleteworker');

        dispatch(addaworker(worker))
        dispatch(deletemyworker(worker))
        setworkersarray(wa => [...wa, worker])
        axios.post('http://localhost:3001/deletemyworker', { worker: worker })
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
                const efficiency = Math.round(income / Math.PI)
                const workerdata: workerInterface = {
                    name: v1[0],
                    surname: v1[1],
                    age: v1[2],
                    sex: v1[3],
                    prof: v1[4],
                    imgsrc: v1[3].toLowerCase().trim() == 'мужской' ? `/m/${getRandom(1, 11)}` : `/f/${getRandom(1, 8)}`,
                    income: income,
                    efficiency: efficiency,
                    production: { name: '', ingredients: [] },
                    statistic: {
                        drawers: {
                            value: Math.round(2000 / efficiency * 200),
                            level: 0,
                            maxlevel: Math.floor(efficiency / 25)
                        },
                        lamp: {
                            value: 20,
                            level: 0,
                            maxlevel: Math.floor(efficiency / 25),
                        },
                        mug: {
                            value: 10,
                            level: 0,
                            maxlevel: Math.floor(efficiency / 25)
                        },
                        table: {
                            value: Math.round(2000 / efficiency),
                            level: 0,
                            maxlevel: Math.floor(efficiency / 25)
                        }
                    }
                }
                setworkersarray(workersarray => [...workersarray, workerdata])
                dispatch(setworkers(workerdata))
            })
            setgetmoretext('Смотреть дальше..')
        })
    }

    useEffect(() => {
        newworkers.length == 0 ? getworkers() : setworkersarray(newworkers)
        if (workers.length == 0) {
            axios.get('http://localhost:3001/getmyworkers').then((res) => {
                res.data.workers.map((v: workerInterface) => dispatch(addworker(v)))
                console.log(res.data.workers);
                
            })
        }
    }, [])


    useEffect(() => {
        let sum = 0
        workers.map(v => {
            sum += v.income
        })
        setsumincome(sum)
    }, [workers])

    return (

        <div className={styles.parent}>
            <div>
                <h1>Наймите себе <span>раб</span>отника ({workersarray.length}): </h1>
                {workers.length > 0 && !currentworker && !newworker && <h1>Ваши рабочие ({workers.length}/{workersmax.value}) :</h1>}
            </div>
            <main>
                <div className={styles.list}>

                    {workersarray.length > 0 ? workersarray.map((v, i) =>
                    (<div key={i} onClick={() => { setnewworker(0); setcurrentworker(v), getcurrent(Object.values(v)) }}>
                        <img alt='' src={'../src/assets/svg/workers/' + v.imgsrc + '.svg'} />
                        <span><h2>{v.name} {v.surname}</h2><p>{v.age} лет • {v.sex} • {v.prof}</p></span>
                        <h2>Желаемый заработок: {renderCoins(v.income)}</h2>
                    </div>)) : (<span className={styles.loading}><img src={approval} alt="" /><p>Смотрим на доску объявлений..</p></span>)}
                    {workersarray.length > 0 && (<button onClick={() => getworkers()}>{getmoretext}</button>)}
                </div>
                {currentworker && (storycurrent != 'loading' && newworker != 2 ? (<div className={styles.currentworker}>
                    <img src={'../src/assets/svg/workers/' + currentworker?.imgsrc + '.svg'} alt="" />
                    <div>
                        <h1>{currentworker?.name} {currentworker?.surname}</h1>
                        <div><h2><span>Возраст:</span> {currentworker?.age}</h2><h2><span>Пол:</span> {currentworker?.sex}</h2><h2><span>Специальность:</span>{currentworker?.prof}</h2><h2><span>Мастерство:</span> {currentworker?.efficiency}</h2> </div>
                        <h3>{storycurrent}</h3>
                        <h2>Желаемый заработок: {renderCoins(currentworker.income)}</h2>
                        <div><button onClick={() => setcurrentworker(null)}>Пропуск</button><button onClick={() => addworkerfunc(currentworker)}>Нанять</button></div>
                    </div>
                </div>) : newworker != 2 && (<span className={styles.loading}><img src={Questioning} alt="" /><p>Пытаемся разобрать подчерк..</p></span>))}
                {newworker == 1 ? (<span className={styles.loading}><img src={deal} alt="" /><p>Новый коллега выйдет на работу сегодня же!</p></span>) : newworker == 2 && (<span className={styles.loading}><img src={facepalm} alt="" /><p>Максимальное число рабочих достигнуто..</p></span>)}
                {!newworker && !currentworker && (<div className={styles.myworkers}>{workers.map((v, i) => (
                    <div key={i}>
                        <img alt='' src={'../src/assets/svg/workers/' + v.imgsrc + '.svg'} />
                        <span><h2>{v.name} {v.surname}</h2><p>{v.age} лет • {v.sex} • {v.prof}</p></span>
                        <img onClick={() => deletecurrentworker(v)} className={styles.deleteworker} src={cancel} alt="" /><h2 className={styles.income}>Заработок: {renderCoins(v.income)}</h2>
                    </div>
                ))}
                   {sumincome == 0 ? (<span className={styles.loading}><img src={noworkers} alt="" /><p>вы можете нанять рабочих в любое время</p></span>) : ( <h2>ежедневная выплата рабочим: {renderCoins(sumincome)}</h2>)}</div>)}
            </main>
        </div>
    )
}