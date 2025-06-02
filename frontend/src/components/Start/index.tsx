import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
import generatebuyerword from '../_modules/generatebuyerword'
import getRandom from '../_modules/getRandom'

import income from '../../assets/svg/start/income.svg'
import table from '../../assets/svg/start/table.svg'
import mainlogo from '../../assets/svg/system/mainlogo.svg'
import entersound from '../../assets/sounds/enter.wav'
import talksound from '../../assets/sounds/talk.wav'
 
import UserInterface from '../_Interfaces/UserInterface'
import UserClass from '../_Classes/UserClass'

import styles from './styles.module.scss'
import { useNavigate } from 'react-router-dom'

export default function Start() {
    const navigate = useNavigate()
    const audiostartRef = useRef<HTMLAudioElement>(null);
    const audiotalkRef = useRef<HTMLAudioElement>(null);
    const [Keytext, setKeytext] = useState<string>('')
    const [buttonstatus, setbuttonstatus] = useState<number>(-1)
    const [hellowords, sethellowords] = useState<string>('')
    const [isanewmember, setisanewmember] = useState<boolean | null>(null)
    const [isinteracted, setisinteracted] = useState<boolean>(false)

    const ownerisback = useRef([])
    const newperson = useRef([])
    const newpersonbefore = useRef([])
    const users = useRef<UserInterface[]>([])

    const entry = (user: UserInterface) => {
        localStorage.setItem('activeuser', JSON.stringify(user))
        axios.post('http://localhost:3001/setuserinfo', { user })

    }

    const checkverification = () => {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]))
        }
        if (Keytext.length < 4) {
            generatebuyerword('Иметь ключ обязательно!', sethellowords)
            return 0
        }

        users.current = JSON.parse(localStorage.getItem('users')!)
        const olduser = users.current.find((v: UserInterface) => v.key == Keytext)
        if (olduser) { entry(olduser); setisanewmember(false); } else {
            setisanewmember(true)
        }
    }

    const newbegin = () => {
        if (Keytext.length < 4) {
            generatebuyerword('Иметь ключ обязательно!', sethellowords)
            return 0
        }
        users.current.push(new UserClass(Keytext))
        localStorage.setItem('users', JSON.stringify(users.current))
        entry(new UserClass(Keytext))
        navigate('./slots')
    }


    useEffect(() => {
        localStorage.setItem('activeuser', JSON.stringify({}))
        axios.get('http://localhost:3001/getstart').then((res) => {
            ownerisback.current = res.data.ownerisback
            newperson.current = res.data.newperson
            newpersonbefore.current = res.data.newpersonbefore
            setTimeout(() => {
                generatebuyerword(ownerisback.current[getRandom(0, ownerisback.current.length - 1)], sethellowords)
            }, 3200)
        });
    }, [])
    const MouseMove = () => {
        if (!isinteracted && audiostartRef.current) {
            audiostartRef.current.play()
            setisinteracted(true);
        }
    };

    useEffect(() => {
        if (audiotalkRef.current) {
            audiotalkRef.current.play().catch(e => console.log("Audio play failed:", e));
        }
    }, [hellowords]);

    useEffect(() => {
        if (isanewmember == true) {
            generatebuyerword(newpersonbefore.current[getRandom(0, newpersonbefore.current.length - 1)], sethellowords)
        } else if (isanewmember == false) {
            generatebuyerword('хотите ли вы выбрать ваше призвание заново?', sethellowords)
        }

    }, [isanewmember]);

    return (
        <>
            <audio ref={audiostartRef} src={entersound} autoPlay />
            <audio ref={audiotalkRef} src={talksound} autoPlay />
            <img onMouseMove={() => MouseMove()} className={styles.mainlogo} src={mainlogo} alt="" />
            <div className={styles.parent}>
                <div className={styles.person}>
                    <h2>{hellowords}
                        {isanewmember == false && (<span><button onClick={() => navigate('./slots')}>да</button><button onClick={() => navigate('./current/workplace')}>нет</button></span>)}
                    </h2>
                    <img src={isanewmember == null ? income : table} alt="" />
                </div>
                <div className={styles.window}>
                    <div className={styles.inputgroup} data-hint={`От 4х символов`}>
                        <input type="text" value={Keytext} onChange={(e) => { setKeytext(e.target.value), setbuttonstatus(e.target.value == '' ? 0 : 1) }} className={styles.inputfield} id="password" placeholder=' ' />
                        <label htmlFor="password" className={styles.inputlabel}>Кодовое слово для входа</label>
                    </div>

                    {buttonstatus != -1 && (<span className={buttonstatus > 0 ? styles.showbutton : styles.hidebutton}><button onClick={() => checkverification()}>Продолжить дело</button>{isanewmember == true && (<button onClick={() => newbegin()}>Начать новое дело</button>)}</span>)}

                </div></div>
        </>
    )
}