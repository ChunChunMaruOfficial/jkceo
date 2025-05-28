import axios from 'axios';
import styles from './styles.module.scss'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { addnewnote, deletecurrentnote, NoteInterface, worker, addworker, setproduction, addtoinventory, removefrominventory, setmainproduct } from '../_slices/baseslice';
import { RootState } from '../mainstore';

import CombinationGame from '../combinationgame';
import Statistic from './Statistic';
import Client from './Client/index';
import clientissatisfied from '../_modules/clientissatisfied';

import newnote from '../../assets/svg/maininterface/newnote.svg'
import back from '../../assets/svg/system/back.svg'
import thinkingimg from '../../assets/svg/maininterface/thinking.svg'
import thinkingprocess from '../../assets/svg/maininterface/thinkingprocess.svg'
import cancel from '../../assets/svg/system/cancel.svg'
import table from '../../assets/svg/maininterface/table.svg'
import tea from '../../assets/svg/workers/tea.svg'
import noproduction from '../../assets/svg/maininterface/noproduction.svg'
import logcabin from '../../assets/svg/maininterface/logcabin.svg'
import message from '../../assets/svg/maininterface/message.svg'
import hammock from '../../assets/svg/maininterface/hammock.svg'

export default function Workplace({ showsidemenu, setshowsidemenu, seconds, setsleeping }: { showsidemenu: number, setshowsidemenu: React.Dispatch<React.SetStateAction<number>>, seconds: number, setsleeping: React.Dispatch<React.SetStateAction<boolean>> }) {

    const daysorder = useRef<{ time: number, text: string, done: boolean }[]>(null)
    const intervalsRef = useRef<{ [key: number]: NodeJS.Timeout }>({});
    const productionselect = useRef<HTMLDivElement>(null)
    const sidemenuRef = useRef<HTMLDivElement>(null)
    const popupRef = useRef<HTMLDivElement>(null)
    const CombinationGameRef = useRef<HTMLDivElement>(null)
    const inputHeadRef = useRef<HTMLInputElement>(null)
    const inputtextRef = useRef<HTMLInputElement>(null)

    const dispatch = useDispatch()
    const workers: worker[] = useSelector((state: RootState) => state.base.workersarray);
    const notes: NoteInterface[] = useSelector((state: RootState) => state.base.notes);
    const rumorsstatus: number = useSelector((state: RootState) => state.base.rumorsstatus);

    const buyerlucky: string[] = useSelector((state: RootState) => state.phrase.lucky);
    const buyerrefusal: string[] = useSelector((state: RootState) => state.phrase.refusal);
    const noanswer: string[] = useSelector((state: RootState) => state.phrase.noanswer);

    const day: number = useSelector((state: RootState) => state.base.day);
    const inventory: { name: string, count: number }[] = useSelector((state: RootState) => state.base.inventory);

    const [stepscurrent, setstepscurrent] = useState<string[]>([])
    const [productiontitle, setproductiontitle] = useState<string>('')
    const [workerprogress, setworkerprogress] = useState<number[]>(new Array(workers.length).fill(0))
    const [workerstatus, setworkerstatus] = useState<boolean[]>(new Array(workers.length).fill(true))
    const [thinking, setthinking] = useState<boolean>(false)
    const [currentworker, setcurrentworker] = useState<number>(-200)
    const [newnoteisopen, setnewnoteisopen] = useState<number>(2)
    const [ispopupopen, setispopupopen] = useState<number>(0)

    const [buyerword, setbuyerword] = useState<string>('')
    const [buyerstatus, setbuyerstatus] = useState<boolean | null>(null)
    const [buyertime, setbuyertime] = useState<number>(0)

    const [buyerarray, setbuyerarray] = useState<{ name: string, count: number }[]>([])

    const deletenote = (note: NoteInterface) => {
        dispatch(deletecurrentnote(note))
    }

    const memoizedStatistic = useMemo(() => <Statistic />, []);

    const thinkingfunc = () => {
        setthinking(true)
        axios.get('http://localhost:3001/getsteps')
            .then((res) => {
                setthinking(false)
                const newnote = {
                    title: res.data.answer.split(',')[0],
                    text: res.data.answer.split(',').slice(1).join(',')
                }

                dispatch(addnewnote(newnote));
                dispatch(setmainproduct(newnote.title));
                axios.post('http://localhost:3001/addnewnote', { note: newnote })
            })
    }

useEffect(() => {
    workers.forEach((worker, i) => {
        if (intervalsRef.current[i] || !workerstatus[i] || worker.production === '') return;
        
        intervalsRef.current[i] = setInterval(() => {
            setworkerprogress(prev => {
                const newProgress = [...prev];
                
                // Если прогресс не число или меньше 0 - сброс
                if (typeof newProgress[i] !== 'number' || newProgress[i] < 0) {
                    newProgress[i] = 0;
                }
                
                // Логика обновления для конкретного воркера
                if (newProgress[i] >= 100) {
                    clearInterval(intervalsRef.current[i]);
                    delete intervalsRef.current[i];
                    dispatch(addtoinventory(worker.production));
                    handleRestart(i, worker.statistic.drawers.value);
                    newProgress[i] = 0;
                } else {
                    newProgress[i] += 1;
                }
                
                return newProgress;
            });
        }, worker.statistic.table.value);
    });

    return () => {
        Object.values(intervalsRef.current).forEach(clearInterval);
        intervalsRef.current = {};
    };
}, [workers, seconds, workerstatus]); // Убрал workerprogress и seconds из зависимостей

    const handleRestart = useCallback((id: number, coldown: number) => {
        setworkerstatus(ws => ws.map((v, i) => (i == id ? false : v)));
        setTimeout(() => {
            setworkerstatus(ws => ws.map((v, i) => (i == id ? true : v)));
        }, coldown);
    }, []);

    useEffect(() => {
        if (workers.length === 0) {
            axios.get('http://localhost:3001/getmyworkers').then((res) => {
                res.data.workers.forEach((v: worker) => dispatch(addworker(v)));
                setworkerprogress(new Array(res.data.workers.length).fill(0));
                setworkerstatus(new Array(res.data.workers.length).fill(true));
            });
        }
    }, []);

    // Загрузка инвентаря
    useEffect(() => {
        if (inventory.length === 0) {
            axios.get('http://localhost:3001/getinventory').then((res) => {
                res.data.inventory.forEach((v: { name: string, count: number }) =>
                    dispatch(addtoinventory(v))
                );
            });
        }
    }, []);

    // Загрузка заметок
    useEffect(() => {
        if (notes.length === 0) {
            axios.get('http://localhost:3001/getnotes').then((res) => {
                res.data.notes.forEach((v: NoteInterface) =>
                    dispatch(addnewnote({ title: v.title, text: v.text }))
                );
            });
        }
    }, []);

    const getRumorsText = (): string => {
        switch (Math.round(rumorsstatus)) {
            case 1:
                return 'Преникчемные'
            case 2:
                return 'Убогие'
            case 3:
                return 'Сносные'
            case 4:
                return 'Ладные'
            case 5:
                return 'Преславные'
        }
        return ''
    }

    return (<main onClick={(e) => {
        if (sidemenuRef.current && CombinationGameRef.current && !sidemenuRef.current.contains(e.target as Node) && !CombinationGameRef.current.contains(e.target as Node)) {
            setshowsidemenu((ssm: number) => {
                if (ssm != 2) return 0
                else return 2
            })
        }
        if (productionselect.current && !productionselect.current.contains(e.target as Node)) {
            setcurrentworker(-1)
        }
    }}>

        <div>
            {/* ------------------------------ CLOCK ------------------------------ */}
            <div className={styles.clockplace}>
                <div className={styles.clock}>
                    <div onClick={() => setsleeping(true)} className={styles.button}></div>
                    <div className={styles.clockdisplay}>
                        <p>{Math.floor((seconds / 60) % 24) < 12 ? 'AM' : 'PM'}</p>
                        <h1>{Math.floor((seconds / 60) % 12) < 10 ? '0' : ''}{Math.floor((seconds / 60) % 12)}:{seconds % 60 < 10 ? '0' : ''}{seconds % 60}</h1>
                        <p>{day}</p>
                    </div>
                    {Math.floor((seconds / 60) % 24) < 2 && (<span>
                        <img src={message} alt="" />
                        <p>идти спать</p>
                    </span>)}
                </div>
                <img src={table} alt="" />
            </div>

            {/* ------------------------------ WORKERS ------------------------------ */}

            {workers.length > 0 && (<div className={styles.workers}>
                <h2>Ваши работники:</h2>
                <div>
                    {workers.length > 0 && workers.map((v, i) => (v && (<div key={i} className={styles.worker}>
                        <p className={styles.productionitem}>{workerprogress[i] < 0 ? 'работник отдыхает' : (v.production != '' ? v.production : 'выберите продукт')}</p>
                        <span onClick={() => setcurrentworker(i)} style={{ background: workerprogress[i] && workerprogress[i] > 0 ? `linear-gradient(to top, #CB997E ${workerprogress[i]}%, rgba(255, 0, 0, 0) 10%)` : 'none' }}><img src={workerprogress[i] < 0 ? hammock : ('../src/assets/svg/workers/' + v.imgsrc + '.svg')} alt="" />{(!intervalsRef.current[i] || v.production == '') && (<img className={styles.tea} src={v.production == '' ? noproduction : tea} />)}</span>
                        <p className={styles.productionpercent}>{workerprogress[i] < 0 ? 'просьба не беспокоить' : (workerprogress[i] + (v.production && '%'))}</p>
                    </div>)))}
                    {currentworker >= 0 && notes.length > 0 && (<div ref={productionselect} className={styles.productionselect}>
                        {notes.map((v, i) => (<p key={i} onClick={() => { dispatch(setproduction([currentworker, v.title])); setcurrentworker(-1) }}>• {v.title}</p>))}
                    </div>)}
                </div>
            </div>)}

            {/* ------------------------------ SCREEN BUTTONS ------------------------------ */}

            <div onClick={() => setispopupopen(1)} className={styles.logcabin}>
                <img src={logcabin} alt="" />
                <h2>Зайти на склад</h2>
            </div>
            <div className={styles.rumors}>
                <h2>Слухи о вас</h2>
                <img alt='' src={'../src/assets/svg/rumors/' + Math.round(rumorsstatus) + '.svg'} />
                <h1>{getRumorsText()}</h1>
            </div>
            {/* <div className={styles.messenger}>
                <h2>Every day the messenger brings</h2>
                <h1>{messengerrange}</h1>
                <h3>raw materials</h3>
            </div>
            */}

            {memoizedStatistic}

            {/* ------------------------------ CLIENT ------------------------------ */}
            <Client setispopupopen={setispopupopen} seconds={seconds} setbuyerword={setbuyerword} buyerword={buyerword} setbuyerstatus={setbuyerstatus} buyerstatus={buyerstatus} setbuyertime={setbuyertime} buyertime={buyertime} daysorder={daysorder} />

        </div>

        {/* ------------------------------ CombinationGame ------------------------------ */}

        {stepscurrent.length != 0 && (<div ref={CombinationGameRef} className={styles.gameplace}>
            <CombinationGame steps={stepscurrent} setstepscurrent={setstepscurrent} title={productiontitle} />

        </div>)}

        {/* ------------------------------ INVENTORY ------------------------------ */}

        {ispopupopen > 0 && (<div onClick={(e) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setispopupopen(0)
            }
        }} className={styles.popupwrapper}>
            <div ref={popupRef} className={styles.popup}>
                <div>
                    {inventory.length == 0 ? (<h1>Ваш склад пуст..</h1>) : (<><h1>Вещи на вашем складе</h1><hr />
                        {inventory.map((v, i) => (
                            <ul key={i} onClick={() => {
                                ispopupopen == 2 && (dispatch(removefrominventory(v.name)) && setbuyerarray(ba => {
                                    const itemExists = ba.some(v1 => v1.name === v.name);
                                    if (itemExists) {
                                        return ba.map(v1 => (v1.name === v.name ? { ...v1, count: v1.count + 1 } : v1));
                                    } else {
                                        return [...ba, { name: v.name, count: 1 }];
                                    }
                                })
                                )
                            }} className={styles.dottedlist}>
                                <li>
                                    <span className={styles.text}>{v.name}</span>
                                    <span className={styles.dots}></span>
                                    <span className={styles.number}>{v.count}</span>
                                </li>
                            </ul>
                        ))}</>)}

                </div>
                {ispopupopen == 2 && (<div className={styles.sending}>
                    {buyerarray.length == 0 && (<h2>выберите товар для покупателя</h2>)}
                    {buyerarray.map((v, i) => (<div key={i}>{v.name} x {v.count} <img onClick={() => { setbuyerarray(ba => ba.filter((_, i1) => i1 != i)); dispatch(addtoinventory(v)) }} src={cancel} alt="" /></div>))}
                    {buyerarray.length > 0 && (<button onClick={() => {clientissatisfied(true, setbuyerword, setbuyertime, setispopupopen, setbuyerstatus, daysorder, buyerlucky, buyerrefusal, noanswer,buyertime); setbuyerarray([])}} className={styles.giving}>отдать</button>)}
                </div>)}
            </div>

        </div>)
        }

        {/* ------------------------------ SIDEMENU ------------------------------ */}

        <div ref={sidemenuRef} className={styles.sidemenu + ' ' + (showsidemenu == 0 ? styles.hidesidemenu : showsidemenu == 1 && styles.showsidemenu)}>
            <span><img onClick={() => setshowsidemenu(0)} src={back} alt="" /><h1>Ваши записи</h1><img onClick={() => { setnewnoteisopen(newnoteisopen == 1 ? 0 : 1) }} src={newnote} alt="" /></span>
            <div className={styles.allnotes}>
                {notes.map((v, i) => (<div key={i}>
                    <span>
                        <h2 onClick={() => {
                            setstepscurrent(v.text.split(',')); setshowsidemenu(2); setproductiontitle(v.title)
                        }}>{v.title}</h2> <img onClick={() => deletenote(v)} src={cancel} alt="" /></span>
                    <p>{v.text.split(',').map((v) => (<>• {v} <br /></>))}</p>
                </div>))}
                <span onClick={() => thinkingfunc()}>
                    <img src={thinking ? thinkingprocess : thinkingimg} alt="" />
                    <h4>Думать над новым продуктом...</h4>
                </span>
            </div>
            <div className={styles.newnote + ' ' + (newnoteisopen == 0 ? styles.hidenewnote : newnoteisopen == 1 && styles.shownewnote)}>
                <div className={styles.inputgroup}>
                    <input ref={inputHeadRef} type="text" className={styles.inputfield} id="title" placeholder=' ' />
                    <label htmlFor="title" className={styles.inputlabel}>Название</label>
                </div>
                <div className={styles.inputgroup}>
                    <input ref={inputtextRef} type="text" className={styles.inputfield} id="text" placeholder=' ' />
                    <label htmlFor="text" className={styles.inputlabel}>Текст заметки</label>
                </div>
                <button onClick={() => {
                    setnewnoteisopen(0); dispatch(addnewnote({
                        title: inputHeadRef.current?.value,
                        text: inputtextRef.current?.value
                    })); inputHeadRef.current!.value = ''; inputtextRef.current!.value = ''
                }}>Сохранить</button>
            </div>
        </div>
    </main >)
}
