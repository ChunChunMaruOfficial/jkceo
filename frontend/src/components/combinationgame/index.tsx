import styles from './style.module.scss';
import getRandom from '../_modules/getRandom';
import { useDispatch } from 'react-redux';
import { addtoinventory } from '../_slices/baseslice';

import { Ref, useMemo, useCallback, useLayoutEffect, useRef, useState, useEffect } from 'react';

import close from '../../assets/svg/system/cancel.svg'


export default function CombinationGame({ steps, setstepscurrent, title }: { steps: string[], setstepscurrent: React.Dispatch<React.SetStateAction<string[]>>, title: string }) {
    const dispatch = useDispatch()
    const parentRef = useRef<HTMLDivElement>(null)

    const [ismistake, setismistake] = useState(false)
    const [stepnumber, setstepnumber] = useState(0)
    const [isworkdone, setisworkdone] = useState(false)
    const [intervalState, setintervalState] = useState(false)
    const [parentheight, useparentheight] = useState(0)
    const [parentwidth, useparentwidth] = useState(0)
    const [fillstate, setfillstate] = useState<number[]>(new Array(steps.length).fill(0))
    const [isdragging, setisdragging] = useState<boolean>(false)
    const [newX, setnewX] = useState<number>(0)
    const [newY, setnewY] = useState<number>(0)


    const CreateComponents = () => {
        const result = steps.map((v, i) => {
            return {
                text: steps[i],
                top: getRandom(0, parentheight - 100),
                Xposition: getRandom(0, parentwidth / 2),
                isLeft: getRandom(0, 1) ? true : false,
            };
        });
        return result;
    };

    useEffect(() => {
        setfillstate(new Array(steps.length).fill(0))
    }, [steps])

    useEffect(() => {

        fillstate.every(v => v >= 100) ? setisworkdone(true) : setisworkdone(false)
    }, [fillstate])

    const componentsarray: { text: string, top: number, Xposition: number, isLeft: boolean }[] = useMemo(() => CreateComponents(), [parentheight, parentwidth, steps])

    const componentsRef = useRef<(HTMLDivElement | null)[]>([]);

    useLayoutEffect(() => {
        if (parentRef.current) {
            useparentwidth(parentRef.current.getBoundingClientRect().width);
            useparentheight(parentRef.current.getBoundingClientRect().height);
        }
        if (componentsRef.current) {
            componentsRef.current = componentsRef.current.slice(0, componentsarray.length);
        }
    }, []);



    const filling = useCallback((index: number) => {
        setintervalState(true)

        const fillinterval = setInterval(() => {
            setintervalState(intervalState => {
                if (intervalState == false) clearInterval(fillinterval)
                return intervalState
            })
            setfillstate(fs => fs.map((v, i) => i == index ? v + 1 : v))
            setfillstate(fs => {
                fs.forEach((v, i) => {
                    i == index && setismistake(false)
                    if (i == index && v == 100) {
                        setstepnumber(stepnumber => {
                            if (stepnumber == index) { setstepnumber(num => num + 1) } else {
                                setintervalState(false)
                                setismistake(true)
                                setstepnumber(0)
                                componentsarray.map((v, i) => fs[i] > 0 && unfilling(i))
                            }; return stepnumber
                        }); clearInterval(fillinterval)
                    }
                }); return fs
            })
        }, 32)
    }, [fillstate, intervalState])



    const unfilling = useCallback((index: number) => {
        setintervalState(false)
        const unfillinterval = setInterval(() => {
            setintervalState(intervalState => {
                if (intervalState == true || fillstate[index] == 1) clearInterval(unfillinterval);
                return intervalState
            })
            setfillstate(fs => fs.map((v, i) => i == index ? v - 1 : v))
            setfillstate(fs => {
                fs.forEach((v, i) => { i == index && v < 3 && (clearInterval(unfillinterval), v = 0) });
                return fs
            })
        }, 32)
    }, [fillstate, intervalState])


    const grabbing = (e: unknown, i: number) => {
        if (!componentsRef.current[i] || !parentRef.current) return
        const trueE = e as MouseEvent;
        setisdragging(true)
        setnewX(trueE.clientX - parentRef.current?.getBoundingClientRect().left - (componentsRef.current[i].getBoundingClientRect().left - parentRef.current?.getBoundingClientRect().left))
        setnewY(trueE.clientY - parentRef.current?.getBoundingClientRect().top - (componentsRef.current[i].getBoundingClientRect().top - parentRef.current?.getBoundingClientRect().top))


    }

    const moving = (e: unknown, i: number) => {
        if (!isdragging || !parentRef.current) return;
        if (!componentsRef.current[i]) return
        // Обновляем позицию элемента
        const trueE = e as MouseEvent;
        const boolvalueX = trueE.clientX > parentRef.current?.getBoundingClientRect().left
        const boolvalueY = trueE.clientY > parentRef.current?.getBoundingClientRect().top
        boolvalueX ? componentsRef.current[i].style.left = `${trueE.clientX - parentRef.current?.getBoundingClientRect().left - newX}px` : 0
        boolvalueX ? componentsRef.current[i].style.right = 'auto' : 0
        boolvalueY ? componentsRef.current[i].style.top = `${trueE.clientY - parentRef.current?.getBoundingClientRect().top - newY}px` : 0
    }


    return (
        <div ref={parentRef} className={styles.parent}>
            <h2 style={{ top: ismistake ? '10px' : '-60px' }}>Надо строго следовать инструкции..</h2>
            <img src={close} onClick={() => { setstepscurrent([]) }} className={styles.close} alt="" />
            {componentsarray.map((v, i) => (
                <div onMouseDown={(e) => { fillstate[i] != 100 && filling(i); grabbing(e, i);if (componentsRef.current[i]) componentsRef.current[i].style.zIndex = '2'  }}
                    onMouseUp={(e) => { fillstate[i] != 100 && unfilling(i); setisdragging(false); if (componentsRef.current[i]) componentsRef.current[i].style.zIndex = '1' }}
                    onMouseOut={(e) => { fillstate[i] != 100 && fillstate[i] > 0 && unfilling(i); setisdragging(false) }}
                    onMouseMove={(e) => moving(e, i)}
                    ref={el => { componentsRef.current[i] = el; }}
                    key={i}
                    style={{
                        top: `${v.top}px`,
                        left: v.isLeft ? `${v.Xposition}px` : '',
                        right: v.isLeft ? '' : `${v.Xposition}px`,
                        background: `linear-gradient(to top, #CB997E ${fillstate[i]}%, #6b705c 1%)`
                    }} >
                    {v.text} {fillstate[i]}%
                </div>
            ))}
            {isworkdone && (<button onClick={() => { dispatch(addtoinventory(title)); setstepscurrent([]) }}> Закончить работу </button>)}
        </div >
    );
}
