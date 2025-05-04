import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './style.module.scss'
import axios from 'axios';

import { RootState } from '../mainstore';
import { setname } from '../_slices/baseslice';
import { Link } from 'react-router-dom';
import ai from '../../assets/svg/system/ai.svg'
import accept from '../../assets/svg/system/accept.svg'
import loading from '../../assets/svg/system/loading.svg'

export default function Professionformulation() {
    const dispatch = useDispatch()

    const [professionformulation, setprofessionformulation] = useState<string>(useSelector((state: RootState) => state.base.professionformulation))
    const [examplename, setexamplename] = useState<string>('test')
    const [isLoading, setisLoading] = useState<boolean>(false)
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
            dispatch(setname(inputRef.current.value))
            axios.post('http://localhost:3001/getexamplename', {name: inputRef.current.value})
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
    }, [])

    return (
        <div className={styles.parent}>
            <h1>{headtext}</h1>
            <div className={styles.maingroup}>
                <div className={styles.inputgroup} data-hint={`Пример: ${examplename}`}>
                    <input ref={inputRef} type="text" className={styles.inputfield} id="name" placeholder=' '/>
                    <label htmlFor="name" className={styles.inputlabel}>Имя</label>
                </div>
                <div>
                    <button onClick={() => getexample(true)}><img className={isLoading ? styles.isLoading : ''} src={isLoading ? loading : ai} alt="" /></button>
                   <Link to='../workplace'> <button onClick={() => setnamefunction()}><img src={accept} alt="" /></button></Link>
                </div>
            </div>
            <h2>{professionformulation}</h2>
        </div>
    )
}