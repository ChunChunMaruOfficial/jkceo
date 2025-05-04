import styles from './style.module.scss';
import getRandom from '../_modules/getRandom';
import { Ref, useMemo, useCallback, useLayoutEffect, useRef, useState, useEffect } from 'react';

export default function CombinationGame() {
    const parentRef = useRef<HTMLDivElement>(null);

    const queue = ['Подготовка ингредиентов', 'Смешивание яиц', 'Разогрев сковороды', 'Добавление яичной смеси', 'Завершение приготовления']
    const [intervalState, setintervalState] = useState(false);
    const [parentheight, useparentheight] = useState(0);
    const [parentwidth, useparentwidth] = useState(0);
    const [fillstate, setfillstate] = useState<number[]>([0, 0, 0, 0, 0, 0])
    const [isdragging, setisdragging] = useState<boolean>(false)
    const [newX, setnewX] = useState<number>(0)
    const [newY, setnewY] = useState<number>(0)


    const CreateComponents = (length: number) => {
        const result = [...new Array(length)].map((v, i) => {
            return {
                text: queue[i],
                top: getRandom(0, parentheight - 100),
                Xposition: getRandom(0, parentwidth / 2),
                isLeft: getRandom(0, 1) ? true : false,
            };
        });
        console.log(result);
        return result;
    };

    const componentsarray: { text: string, top: number, Xposition: number, isLeft: boolean }[] = useMemo(() => CreateComponents(getRandom(3, 5)), [parentheight, parentwidth])
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
            setfillstate(fs => { fs.forEach((v, i) => v == 100 && i == index && clearInterval(fillinterval)); return fs })
        }, 32)
    }, [fillstate, intervalState])



    const unfilling = useCallback((index: number) => {
        setintervalState(false)
        const unfillinterval = setInterval(() => {
            setintervalState(intervalState => { if (intervalState == true || fillstate[index] == 100 || fillstate[index] == 1) clearInterval(unfillinterval); return intervalState })
            setfillstate(fs => fs.map((v, i) => i == index ? v - 1 : v))
            setfillstate(fs => { fs.forEach((v, i) => i == index && (v < 1 || v == 100) && clearInterval(unfillinterval)); return fs })
        }, 32)
    }, [fillstate, intervalState])


    const grabbing = (e: unknown, i: number) => {
        if (!componentsRef.current[i] || !parentRef.current) return
        console.log('grabbing');
        const trueE = e as MouseEvent;
        setisdragging(true)
        setnewX(trueE.clientX - parentRef.current?.getBoundingClientRect().left - (componentsRef.current[i].getBoundingClientRect().left - parentRef.current?.getBoundingClientRect().left))
        setnewY(trueE.clientY - parentRef.current?.getBoundingClientRect().top - (componentsRef.current[i].getBoundingClientRect().top - parentRef.current?.getBoundingClientRect().top))


    }

    const moving = (e: unknown, i: number) => {
        if (!isdragging || !parentRef.current) return;
        if (!componentsRef.current[i]) return
        console.log('moving');

        // Обновляем позицию элемента
        const trueE = e as MouseEvent;
        componentsRef.current[i].style.left = `${trueE.clientX - parentRef.current?.getBoundingClientRect().left - newX}px`;
        componentsRef.current[i].style.right = 'auto'
        componentsRef.current[i].style.top = `${trueE.clientY - parentRef.current?.getBoundingClientRect().top - newY}px`;
    }


    return (
        <div ref={parentRef} className={styles.parent}>
            {componentsarray.map((v, i) => (
                <div onMouseDown={(e) => { filling(i); grabbing(e, i) }}
                    onMouseUp={(e) => { fillstate[i] != 100 && unfilling(i); setisdragging(false) }}
                    onMouseOut={(e) => { fillstate[i] != 100 && fillstate[i] > 0 && unfilling(i); setisdragging(false) }}
                    onMouseMove={(e) => moving(e, i)}
                    ref={el => { componentsRef.current[i] = el; }}
                    key={i}
                    style={{
                        top: `${v.top}px`,
                        left: v.isLeft ? `${v.Xposition}px` : '',
                        right: v.isLeft ? '' : `${v.Xposition}px`,
                        background: `linear-gradient(to top, #ff0000 ${fillstate[i]}%, rgb(31, 75, 75) 1%)`
                    }} >
                    {v.text} | {fillstate[i]}
                </div>
            ))}
        </div >
    );
}
