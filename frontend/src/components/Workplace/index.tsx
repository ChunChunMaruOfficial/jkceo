import axios from 'axios';
import styles from './styles.module.scss'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { addnewnote, deletecurrentnote, NoteInterface, worker, addworker, setproduction, addtoinventory } from '../_slices/baseslice';
import { RootState } from '../mainstore';

import CombinationGame from '../combinationgame';

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


export default function Workplace({ showsidemenu, setshowsidemenu, seconds, setsleeping }: { showsidemenu: number, setshowsidemenu: any, seconds: number, setsleeping: any }) {

    const intervalsRef = useRef<{ [key: number]: NodeJS.Timeout }>({});
    const productionselect = useRef<HTMLDivElement>(null)
    const sidemenuRef = useRef<HTMLDivElement>(null)
    const inputHeadRef = useRef<HTMLInputElement>(null)
    const inputtextRef = useRef<HTMLInputElement>(null)

    const dispatch = useDispatch()
    const workers: worker[] = useSelector((state: RootState) => state.base.workersarray);
    const notes: NoteInterface[] = useSelector((state: RootState) => state.base.notes);
    const rumorsstatus: number = useSelector((state: RootState) => state.base.rumorsstatus);
    const productionArray: number[] = useSelector((state: RootState) => state.base.productionArray);
    const day: number = useSelector((state: RootState) => state.base.day);
    const inventory: { name: string, count: number }[] = useSelector((state: RootState) => state.base.inventory);

    const [stepscurrent, setstepscurrent] = useState<string[]>([])
    const [productiontitle, setproductiontitle] = useState<string>('')
    const [workerprogress, setworkerprogress] = useState<number[]>(new Array(workers.length).fill(0))
    const [thinking, setthinking] = useState<boolean>(false)
    const [currentworker, setcurrentworker] = useState<number>(-1)
    const [newnoteisopen, setnewnoteisopen] = useState<number>(2)
    const [isRunning, setIsRunning] = useState(true);
    const [count, setcount] = useState<number>(0)
    const [ispopupopen, setispopupopen] = useState<boolean>(false)


    const deletenote = (note: NoteInterface) => {
        dispatch(deletecurrentnote(note))
    }

    const thinkingfunc = () => {
        setthinking(true)
        axios.get('http://localhost:3001/getsteps')
            .then((res) => {
                setthinking(false)
                console.log(res.data.answer)
                const newnote = {
                    title: res.data.answer.split(',')[0],
                    text: res.data.answer.split(',').slice(1).join(',')
                }
                dispatch(addnewnote(newnote));
                axios.post('http://localhost:3001/addnewnote', { note: newnote })
            })
    }


    useEffect(() => {
        if (!isRunning) return;

        workers.forEach((worker, i) => {
            if (intervalsRef.current[i] || worker.production == '') return;

            intervalsRef.current[i] = setInterval(() => {
                setworkerprogress(wp => {

                    const newWp = [...wp];
                    if (typeof newWp[i] !== 'number') {
                        newWp[i] = 0;
                    }

                    if (newWp[i] >= 100) {
                        clearInterval(intervalsRef.current[i]);
                        delete intervalsRef.current[i];
                        dispatch(addtoinventory(worker.production))
                        handleRestart(worker.statistic.drawers.value);
                        newWp[i] = 0;
                    } else {
                        newWp[i] += 1;
                    }

                    return newWp;
                });
            }, worker.statistic.table.value);
        });
        return () => {
            if (!isRunning) {
                Object.values(intervalsRef.current).forEach(clearInterval);
                intervalsRef.current = {};
            }
        };
    }, [workers, isRunning]);

    const handleRestart = (coldown: number) => {
        setIsRunning(false);
        setTimeout(() => setIsRunning(true), coldown);
    };


    useEffect(() => {
        if (workers.length == 0) {
            axios.get('http://localhost:3001/getmyworkers').then((res) => {
                res.data.workers.map((v: worker) => dispatch(addworker(v)))
                setworkerprogress(new Array(workers.length).fill(0))
            })
        }

        notes.length == 0 && axios.get('http://localhost:3001/getnotes')
            .then((res) => {
                res.data.notes.map((v: NoteInterface) => {
                    dispatch(addnewnote({
                        title: v.title,
                        text: v.text
                    }));
                })
            })
    }, [])

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

    return (<main onClick={(e) => {
        if (sidemenuRef.current && !sidemenuRef.current.contains(e.target as Node)) {
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
            <div className={styles.clockplace}>
                <div className={styles.clock}>
                    <div onClick={() => setsleeping(true)} className={styles.button}></div>
                    <div className={styles.clockdisplay}>
                        <p>{Math.floor((seconds / 60) % 24) < 12 ? 'AM' : 'PM'}</p>
                        <h1>{Math.floor(seconds / 60) < 10 ? '0' : ''}{Math.floor((seconds / 60) % 24)}:{seconds % 60 < 10 ? '0' : ''}{seconds % 60}</h1>
                        <p>{day}</p>
                    </div>
                    {Math.floor((seconds / 60) % 24) > 24 && (<span>
                        <img src={message} alt="" />
                        <p>идти спать</p>
                    </span>)}
                </div>
                <img src={table} alt="" />


            </div>
            {workers.length > 0 && (<div className={styles.workers}>
                <h2>Ваши работники:</h2>
                <div>
                    {workers.map((v, i) => (<div key={i} className={styles.worker}>
                        <p className={styles.productionitem}>{v.production ? v.production : 'выберите продукт'}</p>
                        <span onClick={() => setcurrentworker(i)} style={{ background: workerprogress[i] && workerprogress[i] != 0 ? `linear-gradient(to top, #CB997E ${workerprogress[i]}%, rgba(255, 0, 0, 0) 10%)` : 'none' }}><img src={'../src/assets/svg/workers/' + v.imgsrc + '.svg'} alt="" />{(!intervalsRef.current[i] || v.production == '') && (<img className={styles.tea} src={v.production == '' ? noproduction : tea} />)}</span>
                        <p className={styles.productionpercent}>{workerprogress[i]} {v.production && '%'}</p>
                    </div>))}
                    {currentworker != -1 && (<div ref={productionselect} className={styles.productionselect}>
                        {notes.map((v) => (<p onClick={() => { dispatch(setproduction([currentworker, v.title])); setcurrentworker(-1) }}>• {v.title}</p>))}
                    </div>)}
                </div>
            </div>)}
            <div onClick={() => setispopupopen(true)} className={styles.logcabin}>
                <img src={logcabin} alt="" />
                <h2>Зайти на склад</h2>
            </div>
            {/* <div className={styles.messenger}>
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
            </div>*/}
            {productionArray.length > 0 && (<div className={styles.production}>
                <span>
                    <p>{productionmax}</p>
                    <p>{productionmax / 2}</p>
                    <p>0</p>
                </span>
                {productionArray.map((v, i) => (<p key={i} style={{ height: `${v / productionmax * 100}%`, background: v / productionmax > .7 ? '#b2f2bb' : v / productionmax > .4 ? '#ffec99' : '#ffc9c9', borderColor: v / productionmax > .7 ? '#2f9e44' : v / productionmax > .4 ? '#f08c00' : '#e03131' }}>{i}</p>))}
            </div>)}
        </div>
        {stepscurrent.length != 0 && (<div className={styles.gameplace}>
            <CombinationGame steps={stepscurrent} setstepscurrent={setstepscurrent} title={productiontitle} />

        </div>)}

        {ispopupopen && (<div onClick={() => setispopupopen(false)} className={styles.popupwrapper}>
            <div className={styles.popup}>
                <h1>Вещи на вашем складе</h1>
                {inventory.map((v) => (<ul className={styles.dottedlist}>
                    <li>
                        <span className={styles.text}>{v.name}</span>
                        <span className={styles.dots}></span>
                        <span className={styles.number}>{v.count}</span>
                    </li>
                </ul>
                ))}
            </div>
        </div>)}

        <div ref={sidemenuRef} className={styles.sidemenu + ' ' + (showsidemenu == 0 ? styles.hidesidemenu : showsidemenu == 1 && styles.showsidemenu)}>
            <span><img onClick={() => setshowsidemenu(0)} src={back} alt="" /><h1>Ваши записи</h1><img onClick={() => { setnewnoteisopen(newnoteisopen == 1 ? 0 : 1) }} src={newnote} alt="" /></span>
            <div className={styles.allnotes}>
                {notes.map((v, i) => (<div key={i}>
                    <span>
                        <h2 onClick={() => {
                            setstepscurrent(v.text.split(',')); setshowsidemenu(false); setproductiontitle(v.title)
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
    </main>)
}