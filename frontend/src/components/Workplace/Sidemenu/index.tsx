import styles from './style.module.scss'
import { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { NoteInterface } from '../../_slices/baseslice'
import { deletecurrentnote, addnewnote, setmainproduct } from '../../_slices/baseslice'
import { RootState } from '../../mainstore'

import cancel from '../../../assets/svg/system/cancel.svg'
import newnote from '../../../assets/svg/maininterface/newnote.svg'
import back from '../../../assets/svg/system/back.svg'
import thinkingimg from '../../../assets/svg/maininterface/thinking.svg'
import thinkingprocess from '../../../assets/svg/maininterface/thinkingprocess.svg'

export default function Sidemenu({ showsidemenu, setshowsidemenu, setproductiontitle, sidemenuRef, setstepscurrent }: { showsidemenu: number, setshowsidemenu: React.Dispatch<React.SetStateAction<number>>, setproductiontitle: React.Dispatch<React.SetStateAction<string>>, sidemenuRef: React.RefObject<HTMLDivElement | null>, setstepscurrent: React.Dispatch<React.SetStateAction<string[]>> }) {
    const dispatch = useDispatch()

    const notes: NoteInterface[] = useSelector((state: RootState) => state.base.notes);

    const inputHeadRef = useRef<HTMLInputElement>(null)
    const inputtextRef = useRef<HTMLInputElement>(null)
    const [newnoteisopen, setnewnoteisopen] = useState<number>(2)
    const [thinking, setthinking] = useState<boolean>(false)


    const deletenote = (note: NoteInterface) => {
        dispatch(deletecurrentnote(note))
    }

    useEffect(() => {
        if (notes.length === 0) {
            axios.get('http://localhost:3001/getnotes').then((res) => {
                res.data.notes.forEach((v: NoteInterface) => {
                    dispatch(addnewnote({ title: v.title, steps: v.steps, price: v.price, ingredients: typeof v.ingredients == 'string' ? v.ingredients.split(',') : v.ingredients }))
                    dispatch(setmainproduct(v.title))
                }
                );
            });
        }
    }, []);


    const thinkingfunc = () => {
        setthinking(true)
        axios.get('http://localhost:3001/getsteps')
            .then((res) => {
                const newnote = res.data.answer
                dispatch(setmainproduct(newnote.title));
                newnote.ingredients = newnote.ingredients.split(',')
                dispatch(addnewnote(newnote));
                setthinking(false)
            })
    }


    return (
        <div ref={sidemenuRef} className={styles.sidemenu + ' ' + (showsidemenu == 0 ? styles.hidesidemenu : showsidemenu == 1 && styles.showsidemenu)}>
            <span><img onClick={() => setshowsidemenu(0)} src={back} alt="" /><h1>Ваши записи</h1><img onClick={() => { setnewnoteisopen(newnoteisopen == 1 ? 0 : 1) }} src={newnote} alt="" /></span>

            <div className={styles.allnotes}>

                {notes.map((v, i) => (<div key={i}>
                    <span>
                        <h2 onClick={() => {
                            typeof v.steps != 'string' && (setstepscurrent(v.steps), setshowsidemenu(2), setproductiontitle(v.title))
                        }}>{v.title}</h2> <img onClick={() => deletenote(v)} src={cancel} alt="" /></span>
                    <div>
                        <span>
                            <p>{typeof v.steps != 'string' ? v.steps.map((v1) => (<>• {v1} <br /></>)) : (<>{v.steps}</>)}</p>
                        </span>
                        {v.ingredients && (<span>
                            <p>{typeof v.ingredients != 'string' && v.ingredients.map((v1) => (<>• {v1} <br /></>))}</p>
                        </span>)}
                    </div>
                    {v.price && (<h3>Цена: {v.price}</h3>)}
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
                        steps: inputtextRef.current?.value
                    })); axios.post('http://localhost:3001/addnewnote', {
                        note: {
                            title: inputHeadRef.current?.value,
                            steps: inputtextRef.current?.value
                        }
                    }); inputHeadRef.current!.value = ''; inputtextRef.current!.value = ''
                }}>Сохранить</button>
            </div>
        </div>
    )
}