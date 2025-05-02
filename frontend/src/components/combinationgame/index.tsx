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

    const CreateComponents = (length: number) => {
        const result = [...new Array(length)].map((v, i) => {
            return {
                text: queue[i],
                top: getRandom(0, parentheight),
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
            setintervalState(intervalState => { if (intervalState == false) clearInterval(fillinterval); console.log(intervalState); return intervalState })

            setfillstate(fs => fs.map((v, i) => i == index ? v + 1 : v))
            setfillstate(fs => { fs.forEach((v) => v == 100 && clearInterval(fillinterval)); console.log(fs); return fs })
        }, 32)
    }, [fillstate, intervalState])

    const unfilling = useCallback((index: number) => {
        setintervalState(false)
        const unfillinterval = setInterval(() => {
            setintervalState(intervalState => { if (intervalState == true || fillstate[index] == 100 || fillstate[index] == 1) clearInterval(unfillinterval); console.log('un', intervalState); return intervalState })
            setfillstate(fs => fs.map((v, i) => i == index ? v - 1 : v))
            setfillstate(fs => { fs.forEach((v, i) => i == index && (v < 1 || v == 100) && clearInterval(unfillinterval)); console.log(fs); return fs })
        }, 32)
    }, [fillstate, intervalState])

    return (
        <div ref={parentRef} className={styles.parent}>
            {componentsarray.map((v, i) => (
                <div onMouseDown={() => filling(i)}
                    onMouseUp={() => fillstate[i] != 100 && unfilling(i)}
                    onMouseOut={() => fillstate[i] != 100 && fillstate[i] > 0 && unfilling(i)}
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
