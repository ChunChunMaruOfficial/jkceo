import styles from './style.module.scss'
import { worker, addworker, setproduction, addtoinventory } from '../../_slices/baseslice';

import tea from '../../../assets/svg/workers/tea.svg'
import noproduction from '../../../assets/svg/maininterface/noproduction.svg'
import { useDispatch, useSelector } from 'react-redux'
import hammock from '../../../assets/svg/maininterface/hammock.svg'
import { RootState } from '../../mainstore'
import { useEffect, useState, useRef, useCallback } from 'react'
import axios from 'axios'
import { NoteInterface } from '../../_slices/baseslice';

export default function Workers({ seconds, productionselect, currentworker, setcurrentworker }: { seconds: number, productionselect: React.RefObject<HTMLDivElement | null>, currentworker:number, setcurrentworker: React.Dispatch<React.SetStateAction<number>> }) {

    const dispatch = useDispatch()
    const workers: worker[] = useSelector((state: RootState) => state.base.workersarray);
    const notes: NoteInterface[] = useSelector((state: RootState) => state.base.notes);
    const intervalsRef = useRef<{ [key: number]: NodeJS.Timeout }>({});

    const [workerprogress, setworkerprogress] = useState<number[]>(new Array(workers.length).fill(0))
    const [workerstatus, setworkerstatus] = useState<boolean[]>(new Array(workers.length).fill(true))

    useEffect(() => {
        if (workers.length === 0) {
            axios.get('http://localhost:3001/getmyworkers').then((res) => {
                res.data.workers.forEach((v: worker) => dispatch(addworker(v)));
                setworkerprogress(new Array(res.data.workers.length).fill(0));
                setworkerstatus(new Array(res.data.workers.length).fill(true));
            });
        }
    }, []);

    useEffect(() => {
        workers.forEach((worker, i) => {
            if (intervalsRef.current[i] || !workerstatus[i] || worker.production === '') return;

            intervalsRef.current[i] = setInterval(() => {
                setworkerprogress(prev => {
                    const newProgress = [...prev]

                    if (typeof newProgress[i] !== 'number' || newProgress[i] < 0) {
                        newProgress[i] = 0
                    }

                    if (newProgress[i] >= 100) {
                        clearInterval(intervalsRef.current[i])
                        delete intervalsRef.current[i]
                        dispatch(addtoinventory(worker.production))
                        handleRestart(i, worker.statistic.drawers.value)
                        newProgress[i] = 0
                    } else {
                        newProgress[i] += 1
                    }

                    return newProgress;
                });
            }, worker.statistic.table.value);
        });

        return () => {
            Object.values(intervalsRef.current).forEach(clearInterval);
            intervalsRef.current = {}
        };
    }, [workers, seconds, workerstatus])

    const handleRestart = useCallback((id: number, coldown: number) => {
        setworkerstatus(ws => ws.map((v, i) => (i == id ? false : v)));
        setTimeout(() => {
            setworkerstatus(ws => ws.map((v, i) => (i == id ? true : v)));
        }, coldown);
    }, []);

    return (
        workers.length > 0 && (<div id={styles.workers}>
            <h2>Ваши работники:</h2>
            <div>
                {workers.length > 0 && workers.map((v, i) => (v && (<div key={i} className={styles.worker}>
                    <p className={styles.productionitem}>{workerprogress[i] < 0 ? 'работник отдыхает' : (v.production != '' ? v.production : 'выберите продукт')}</p>
                    <span onClick={() => setcurrentworker(i)} style={{ background: workerprogress[i] && workerprogress[i] > 0 ? `linear-gradient(to top, #CB997E ${workerprogress[i]}%, rgba(255, 0, 0, 0) 10%)` : 'none' }}><img src={workerprogress[i] < 0 ? hammock : ('../src/assets/svg/workers/' + v.imgsrc + '.svg')} alt="" />{(!intervalsRef.current[i] || v.production == '') && (<img className={styles.tea} src={v.production == '' ? noproduction : tea} />)}</span>
                    <p className={styles.productionpercent}>{workerprogress[i] < 0 ? 'просьба не беспокоить' : (workerprogress[i] == 0 ? 'небольшой перерыв' : (workerprogress[i] + (v.production && '%')))}</p>
                </div>)))}
                {currentworker >= 0 && notes.length > 0 && (<div ref={productionselect} className={styles.productionselect}>
                    {notes.map((v, i) => (<p key={i} onClick={() => { dispatch(setproduction([currentworker, v.title])); setcurrentworker(-1) }}>• {v.title}</p>))}
                </div>)}
            </div>
        </div>)
    )
}