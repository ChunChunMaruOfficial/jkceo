import { useSelector, useDispatch } from 'react-redux';
import styles from './styles.module.scss'
import { RootState } from '../mainstore';
import { worker } from '../_slices/baseslice';
import getRandom from '../_modules/getRandom';
import back from '../../assets/svg/system/back.svg'
import CombinationGame from '../combinationgame';
import newnote from '../../assets/svg/maininterface/newnote.svg'
import { useEffect, useRef, useState } from 'react';
import { addnewnote, deletecurrentnote } from '../_slices/baseslice';
import { NoteInterface } from '../_slices/baseslice';
import thinkingimg from '../../assets/svg/maininterface/thinking.svg'
import thinkingprocess from '../../assets/svg/maininterface/thinkingprocess.svg'
import axios from 'axios';
import cancel from '../../assets/svg/system/cancel.svg'
import table from '../../assets/svg/maininterface/table.svg'


export default function Workplace({ showsidemenu, setshowsidemenu, seconds }: { showsidemenu: number, setshowsidemenu: any, seconds: number }) {

    const sidemenuRef = useRef<HTMLDivElement>(null)
    const workers: worker[] = useSelector((state: RootState) => state.base.workersarray);
    const dispatch = useDispatch()
    const notes: NoteInterface[] = useSelector((state: RootState) => state.base.notes);

    const [stepscurrent, setstepscurrent] = useState<string[]>([])
    const [thinking, setthinking] = useState<boolean>(false)
    const [newnoteisopen, setnewnoteisopen] = useState<number>(2)
    const inputHeadRef = useRef<HTMLInputElement>(null)
    const inputtextRef = useRef<HTMLInputElement>(null)

    const rumorsstatus: number = useSelector((state: RootState) => state.base.rumorsstatus);
    const productionArray: number[] = useSelector((state: RootState) => state.base.productionArray);

    const deletenote = (note: NoteInterface) => {
        dispatch(deletecurrentnote(note))
    }

    const thinkingfunc = () => {
        setthinking(true)
        axios.get('http://localhost:3001/getsteps')
            .then((res) => {
                setthinking(false)
                dispatch(addnewnote({
                    title: 'Нужно попробовать',
                    text: res.data.answer
                }));
            })
    }

    useEffect(() => {
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
            setshowsidemenu((ssm:number) => { if (ssm != 2) return 0  
                else return 2 })
        }
    }}>

        <div>
            <div className={styles.clockplace}>
                <div className={styles.clock}>
                    <div className={styles.button}></div>
                    <div className={styles.clockdisplay}>
                        <p>{Math.floor(seconds / 60) < 12 ? 'AM' : 'PM'}</p>
                        <h1>{Math.floor(seconds / 60) < 10 ? '0' : ''}{Math.floor(seconds / 60)}:{seconds % 60 < 10 ? '0' : ''}{seconds % 60}</h1>
                        <p> 0</p>
                    </div>
                </div>
                <img src={table} alt="" />
            </div>
            {workers.length > 0 && (<div className={styles.workers}>
                <h2>Ваши работники:</h2>
                <div>
                    {workers.map((v) => (<div className={styles.worker}>
                        <span><img src={'../src/assets/svg/workers/' + v.imgsrc + '.svg'} alt="" /></span>
                    </div>))}
                </div>
            </div>)}
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
                {productionArray.map((v, i) => (<p style={{ height: `${v / productionmax * 100}%`, background: v / productionmax > .7 ? '#b2f2bb' : v / productionmax > .4 ? '#ffec99' : '#ffc9c9', borderColor: v / productionmax > .7 ? '#2f9e44' : v / productionmax > .4 ? '#f08c00' : '#e03131' }}>{i}</p>))}
            </div>)}
        </div>
        {stepscurrent.length != 0 && (<div className={styles.gameplace}>
            <CombinationGame steps={stepscurrent} setstepscurrent={setstepscurrent} />

        </div>)}
        <div ref={sidemenuRef} className={styles.sidemenu + ' ' + (showsidemenu == 0 ? styles.hidesidemenu : showsidemenu == 1 && styles.showsidemenu)}>
            <span><img onClick={() => setshowsidemenu(0)} src={back} alt="" /><h1>Ваши записи</h1><img onClick={() => { setnewnoteisopen(newnoteisopen == 1 ? 0 : 1) }} src={newnote} alt="" /></span>
            <div className={styles.allnotes}>
                {notes.map(v => (<div>
                    <span>
                        <h2 onClick={() => {
                            v.title == 'Нужно попробовать' && setstepscurrent(v.text.split(',')); setshowsidemenu(false)
                        }}>{v.title}</h2> <img onClick={() => deletenote(v)} src={cancel} alt="" /></span>
                    <p>{v.title == 'Нужно попробовать' ? v.text.split(',').map(v => (<>• {v} <br /></>)) : v.text}</p>
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