import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './style.module.scss'
import axios from 'axios';

import { RootState } from '../mainstore';
import { setname } from '../_slices/baseslice';
import { Link, useNavigate } from 'react-router-dom';
import ai from '../../assets/svg/system/ai.svg'
import accept from '../../assets/svg/system/accept.svg'
import loading from '../../assets/svg/system/loading.svg'
import { addnewnote } from '../_slices/baseslice';

export default function Professionformulation() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [professionformulation, setprofessionformulation] = useState<string>(useSelector((state: RootState) => state.base.professionformulation))
    const [examplename, setexamplename] = useState<string>('test')
    const [isLoading, setisLoading] = useState<boolean>(false)
    const [allisdone, setallisdone] = useState<boolean>(false)
    const [headtext, setlabelvalue] = useState<string>('Как вы хотите, чтобы люди знали вас?')

    const inputRef = useRef<HTMLInputElement>(null)

    const getexample = (bool?: boolean) => {
        bool && setisLoading(true)
        axios.get('http://localhost:3001/getexamplename')
            .then((res) => {
                setexamplename(res.data.answer);
                if (inputRef.current) {
                    bool ? inputRef.current.value = res.data.answer : 0
                    setisLoading(false)
                }
            })
    }

    const setnamefunction = () => {
        if (inputRef.current && inputRef.current.value != '') {
            setallisdone(true)
            setTimeout(() => {
                dispatch(setname(inputRef.current!.value))
                axios.post('http://localhost:3001/getexamplename', { name: inputRef.current!.value })

                const newnote = {
                    title: inputRef.current!.value,
                    text: professionformulation
                }

                dispatch(addnewnote(newnote))
                navigate('../workplace');
            }, 1800)
        } else {
            setlabelvalue("Даруй себе имя!")
        }
    }

    useEffect(() => {
        getexample()
        if (professionformulation == '') {
            axios.get('http://localhost:3001/getprofessionformulation')
                .then((res) => {
                    setprofessionformulation(res.data.answer);
                })
        }
        axios.get('http://localhost:3001/getmaterials')
            .then((res) => {
                console.log(res.data.answer);
            })
    }, [])

    return (
        <div className={styles.parent}>
            <h1 className={allisdone ? styles.hideelement : ''}>{headtext}</h1>
            <div className={allisdone ? styles.maingroup + ' ' + styles.hideelement : styles.maingroup}>
                <div className={styles.inputgroup} data-hint={`Пример: ${examplename}`}>
                    <input ref={inputRef} type="text" className={styles.inputfield} id="name" placeholder=' ' />
                    <label htmlFor="name" className={styles.inputlabel}>Имя</label>
                </div>
                <div>
                    <button onClick={() => !isLoading && getexample(true)}><img className={isLoading ? styles.isLoading : ''} src={isLoading ? loading : ai} alt="" /></button>
                     <button onClick={() => setnamefunction()}><img src={accept} alt="" /></button>
                </div>
            </div>
            <h2 className={allisdone ? styles.hideelement : ''}>{professionformulation}</h2>
        </div>
    )
}