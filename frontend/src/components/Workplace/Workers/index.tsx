import styles from './style.module.scss'
import {addworker, setproduction, addtoinventory, setinventory } from '../../_slices/baseslice';

import tea from '../../../assets/svg/workers/tea.svg'
import noproduction from '../../../assets/svg/maininterface/noproduction.svg'
import { useDispatch, useSelector } from 'react-redux'
import hammock from '../../../assets/svg/maininterface/hammock.svg'
import { RootState } from '../../mainstore'
import { useEffect, useState, useRef, useCallback } from 'react'
import axios from 'axios'
import { NoteInterface } from '../../_Interfaces/NoteInterface'
import { workerInterface } from '../../_Interfaces/workerInterface';

export default function Workers({ seconds, productionselect, currentworker, setcurrentworker }: { seconds: number, productionselect: React.RefObject<HTMLDivElement | null>, currentworker: number, setcurrentworker: React.Dispatch<React.SetStateAction<number>> }) {

    const dispatch = useDispatch()
    const workers: workerInterface[] = useSelector((state: RootState) => state.base.workersarray);
    const notes: NoteInterface[] = useSelector((state: RootState) => state.base.notes);
    const inventory: { name: string, count: number }[] = useSelector((state: RootState) => state.base.inventory);
    const intervalsRef = useRef<{ [key: number]: NodeJS.Timeout }>({});

    const [workerprogress, setworkerprogress] = useState<number[]>(new Array(workers.length).fill(0))
    const [workersmessages, setworkersmessages] = useState<string[]>(new Array(workers.length).fill(''))
    const [workerstatus, setworkerstatus] = useState<boolean[]>(new Array(workers.length).fill(true))

    useEffect(() => {
        if (workers.length === 0) {
            axios.get('http://localhost:3001/getmyworkers').then((res) => {
                res.data.workers.forEach((v: workerInterface) => dispatch(addworker(v)));
                setworkerprogress(new Array(res.data.workers.length).fill(0));
                setworkerstatus(new Array(res.data.workers.length).fill(true));
                setworkersmessages(new Array(res.data.workers.length).fill(''));
            });
        }
    }, []);
    useEffect(() => {
        setworkersmessages(wm => {
            const newWm = wm.map((_, i) => {
                switch (true) {
                    case workerprogress[i] === -2:
                        return 'нет ингредиентов';
                    case workerprogress[i] === -1:
                        return 'просьба не беспокоить';
                    case workerprogress[i] === 0:
                        return 'небольшой перерыв';
                    default:
                        return '';
                }
            });
            return newWm;
        });
    }, [workerprogress]);


    useEffect(() => {
        setworkerprogress(wp =>
            wp.map((v, i) =>
                (workers[i].statistic.lamp.value <= Math.floor((seconds / 60) % 24) || Math.floor((seconds / 60) % 24) <= (workers[i].statistic.mug.value - 1) ? -1 : (v < 0 ? 0 : v))
            )
        )
    }, [seconds,workerstatus])

    useEffect(() => {
        workers.forEach((worker, i) => {
            if (intervalsRef.current[i] || !workerstatus[i] || worker.production.name === '') return;

            intervalsRef.current[i] = setInterval(() => {
                setworkerprogress(prev => {
                    const newProgress = [...prev]
                    if (newProgress[i] >= 100) {
                        clearInterval(intervalsRef.current[i])
                        delete intervalsRef.current[i]

                        let updatedInventory = [...inventory];
                        worker.production.ingredients.forEach((ingredient) => {
                            updatedInventory = updatedInventory.filter(item => item.count > 0).map(item =>
                                item.name.trim() === ingredient.trim()
                                    ? { name: item.name, count: item.count - 1 }
                                    : item
                            );
                        });
                        dispatch(setinventory(updatedInventory));
                        dispatch(addtoinventory([worker.production.name, true]))
                        handleRestart(i, worker.statistic.drawers.value)
                        newProgress[i] = 0
                    } else {
                        newProgress[i] += 1
                    }

                    if (!worker.production.ingredients.every(v => inventory.some(v1 => v1.name.trim() == v.trim()))) {
                        newProgress[i] = -2                        
                        clearInterval(intervalsRef.current[i])
                        delete intervalsRef.current[i]
                    }

                    if (typeof newProgress[i] !== 'number' || newProgress[i] == -1) {
                        newProgress[i] = 0
                    }

                    return newProgress;
                });                
            }, worker.statistic.table.value);
        });

        return () => {
            Object.values(intervalsRef.current).forEach(clearInterval);
            intervalsRef.current = {}
        };
    }, [workers, seconds, workerstatus, inventory])

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
                    <p className={styles.productionitem}>{workerprogress[i] < 0 ? 'работник отдыхает' : (v.production.name != '' ? v.production.name : 'выберите продукт')}</p>
                    <span onClick={() => workerprogress[i] >= 0 && setcurrentworker(i)} style={{ background: workerprogress[i] && workerprogress[i] > 0 ? `linear-gradient(to top, #CB997E ${workerprogress[i]}%, rgba(255, 0, 0, 0) 10%)` : 'none' }}><img src={workerprogress[i] < 0 ? hammock : ('../src/assets/svg/workers/' + v.imgsrc + '.svg')} alt="" />{(!intervalsRef.current[i] || v.production.name == '') && (<img className={styles.tea} src={v.production.name == '' ? noproduction : tea} />)}</span>
                    <p className={styles.productionpercent}>{workersmessages[i] != '' ? workersmessages[i] : (workerprogress[i] + (v.production && '%'))}</p>
                </div>)))}
                {currentworker >= 0 && notes.length > 0 && (<div ref={productionselect} className={styles.productionselect}>
                    {notes.map((v, i) => v.ingredients && (<p key={i} onClick={() => { dispatch(setproduction([currentworker, v.title, v.ingredients])); setcurrentworker(-1) }}>• {v.title}</p>))}
                </div>)}
            </div>
        </div>)
    )
}