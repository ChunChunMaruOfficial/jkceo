import styles from './style.module.scss'
import { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { NoteInterface } from '../../_Interfaces/NoteInterface'
import { deletecurrentnote, addnewnote, setmainproduct, setinventory } from '../../_slices/baseslice'
import { RootState } from '../../mainstore'

import cancel from '../../../assets/svg/system/cancel.svg'
import newnote from '../../../assets/svg/maininterface/newnote.svg'
import back from '../../../assets/svg/system/back.svg'
import thinkingimg from '../../../assets/svg/maininterface/thinking.svg'
import thinkingprocess from '../../../assets/svg/maininterface/thinkingprocess.svg'

export default function Sidemenu({ showsidemenu, setshowsidemenu, setproductiontitle, sidemenuRef, setstepscurrent }: { showsidemenu: number, setshowsidemenu: React.Dispatch<React.SetStateAction<number>>, setproductiontitle: React.Dispatch<React.SetStateAction<string>>, sidemenuRef: React.RefObject<HTMLDivElement | null>, setstepscurrent: React.Dispatch<React.SetStateAction<string[]>> }) {
    const dispatch = useDispatch()

    const notes: NoteInterface[] = useSelector((state: RootState) => state.base.notes);
    const inventory: { name: string, count: number }[] = useSelector((state: RootState) => state.base.inventory);

    const inputHeadRef = useRef<HTMLInputElement>(null)
    const inputtextRef = useRef<HTMLInputElement>(null)
    const [newnoteisopen, setnewnoteisopen] = useState<number>(2)
    const [thinking, setthinking] = useState<boolean>(false)
    const [error, seterror] = useState<string>('')

    useEffect(() => {
        console.log(notes);
        if (notes.length === 0) {
            axios.get('http://localhost:3001/getnotes').then((res) => {
                res.data.notes.map((v: NoteInterface) => {
                    dispatch(addnewnote(v))
                    dispatch(setmainproduct(v.title))
                }
                );
            });
        }
    }, []);

    useEffect(() => {
        error != '' && setTimeout(() => {
            seterror('')
        }, 1000)
    }, [error]);


    const thinkingfunc = () => {
        setthinking(true)
        axios.get('http://localhost:3001/getsteps')
            .then((res) => {
                setthinking(false)
                if (res.data.answer == 'serverError') {
                    seterror('Кажется, ничего придумать не получается..')
                    return 0
                }

                const newnote = res.data.answer
                console.log(newnote);

                dispatch(setmainproduct(newnote.title));
                dispatch(addnewnote(newnote));
            })
    }

    const setproductionfunc = (product: NoteInterface) => {
        if (!product.ingredients.every(v => inventory.some(v1 => v1.name.trim() == v.trim()))) {
            seterror('У вас недостаточно ингредиентов!')
            return 0
        }



        setshowsidemenu(0)
        setstepscurrent(product.steps as string[])
        setproductiontitle(product.title)

        let updatedInventory = [...inventory];
        product.ingredients.forEach((ingredient) => {
            updatedInventory = updatedInventory.filter(item => item.count > 0).map(item =>
                item.name.trim() === ingredient.trim()
                    ? { name: item.name, count: item.count - 1 }
                    : item
            );
        });
        dispatch(setinventory(updatedInventory));
    }


    return (
        <div ref={sidemenuRef} className={styles.sidemenu + ' ' + (showsidemenu == 0 ? styles.hidesidemenu : showsidemenu == 1 && styles.showsidemenu)}>
            <span><img onClick={() => setshowsidemenu(0)} src={back} alt="" /><h1>Ваши записи</h1><img onClick={() => { setnewnoteisopen(newnoteisopen == 1 ? 0 : 1) }} src={newnote} alt="" /></span>

            <div className={styles.allnotes}>

                {notes.length > 0 && notes.map((v: NoteInterface, i) => (<div key={i}>
                    <span>
                        <h2 className={typeof v.steps != 'string' ? styles.active : ''} onClick={() => {
                            typeof v.steps != 'string' && setproductionfunc(v)
                        }}>{v.title}</h2> <img onClick={() => dispatch(deletecurrentnote([v.title, v.price]))} src={cancel} alt="" /></span>
                    <div>
                        <span>
                            {typeof v.steps != 'string' ? v.steps.map((v1, i1) => (<p key={i1}>• {v1} <br /></p>)) : (<p>{v.steps}</p>)}
                        </span>
                        {v.ingredients && (<span>
                            {typeof v.ingredients != 'string' && v.ingredients.map((v1, i1) => (<p key={i1}>• {v1} <br /></p>))}
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
            <h2 className={error.length > 0 ? styles.sadmesshow : styles.sadmeshide}>{error}</h2>
        </div>
    )
}