import styles from './style.module.scss'
import { addtoinventory, removefrominventory } from '../../_slices/baseslice';
import { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../mainstore';
import getRandom from '../../_modules/getRandom';
import generatebuyerword from '../../_modules/generatebuyerword';
import clientissatisfied from '../../_modules/clientissatisfied';
import cancel from '../../../assets/svg/system/cancel.svg'
import { NoteInterface } from '../../_Interfaces/NoteInterface';
import axios from 'axios';
import { setinventory } from '../../_slices/baseslice';



export default function Inventory({ ispopupopen, setispopupopen, newmoney, setnewmoney,setwrongitem,setbuyerword,setbuyertime,buyertime,daysorder,setbuyerstatus,setbecomemoney }: { ispopupopen: number, setispopupopen: React.Dispatch<React.SetStateAction<number>>, newmoney: number, setnewmoney: React.Dispatch<React.SetStateAction<number>>,setwrongitem:React.Dispatch<React.SetStateAction<string>>,setbuyerword:React.Dispatch<React.SetStateAction<string>>, setbuyertime: React.Dispatch<React.SetStateAction<number>>, buyertime:number, daysorder: React.MutableRefObject<{ time: number; text: string; done: boolean }[] | null>,setbuyerstatus:React.Dispatch<React.SetStateAction<boolean | null>>,setbecomemoney: React.Dispatch<React.SetStateAction<boolean>>}) {
    const dispatch = useDispatch()
    const popupRef = useRef<HTMLDivElement>(null)
    const mainproduct: string[] = useSelector((state: RootState) => state.base.mainproduct);
    const buyerlucky: string[] = useSelector((state: RootState) => state.phrase.lucky);
    const buyerrefusal: string[] = useSelector((state: RootState) => state.phrase.refusal);
    const noanswer: string[] = useSelector((state: RootState) => state.phrase.noanswer);
    const wrong: string[] = useSelector((state: RootState) => state.phrase.wrong);
    const inventory: { name: string, count: number }[] = useSelector((state: RootState) => state.base.inventory);
    const notes: NoteInterface[] = useSelector((state: RootState) => state.base.notes);
    const [buyerarray, setbuyerarray] = useState<{ name: string, count: number }[]>([])

    useEffect(() => {
        if (inventory.length === 0) {
            axios.get('http://localhost:3001/getinventory').then((res) => {
                dispatch(setinventory(res.data.inventory))
            });
        }
    }, []);

    useEffect(() => {
        buyerarray.length > 0 && setbuyerarray(ba => {
            let sum = 0;
            ba.map(v => sum += (notes.find(v1 => v1.title == v.name)?.price ?? 1) * v.count);
            setnewmoney(sum); return ba
        })

    }, [buyerarray]);


    const clientmidleware = () => {
        buyerarray.every(item => mainproduct.includes(item.name)) ?
            (clientissatisfied(true, setbuyerword, setbuyertime, setispopupopen, setbuyerstatus, daysorder, buyerlucky, buyerrefusal, noanswer, buyertime), setbuyerarray([]), setbecomemoney(true))
            : (generatebuyerword(wrong[getRandom(0, wrong.length - 1)], setwrongitem, daysorder))
    }


    return (
        ispopupopen > 0 && (<div onClick={(e) => {
            axios.post('http://localhost:3001/updateinventory', { inventory: inventory })
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setispopupopen(0)
            }
        }} className={styles.popupwrapper}>
            <div ref={popupRef} className={styles.popup}>
                <div>
                    {inventory.length == 0 ? (<h1>Ваш склад пуст..</h1>) : (<><h1>Вещи на вашем складе</h1><hr />
                        {inventory.map((v, i) => (
                            <ul key={i} onClick={() => {
                                ispopupopen == 2 && (dispatch(removefrominventory(v.name)) && setbuyerarray(ba => {
                                    const itemExists = ba.some(v1 => v1.name === v.name);
                                    if (itemExists) {
                                        return ba.map(v1 => (v1.name === v.name ? { ...v1, count: v1.count + 1 } : v1));
                                    } else {
                                        return [...ba, { name: v.name, count: 1 }];
                                    }
                                })
                                )
                            }} className={styles.dottedlist}>
                                <li>
                                    <span className={styles.text}>{v.name}</span>
                                    <span className={styles.dots}></span>
                                    <span className={styles.number}>{v.count}</span>
                                </li>
                            </ul>
                        ))}</>)}

                </div>
                {ispopupopen == 2 && (<div className={styles.sending}>
                    {buyerarray.length == 0 && (<h2>выберите товар для покупателя</h2>)}
                    {buyerarray.map((v, i) => (<div key={i}>{v.name} x {v.count} <img onClick={() => { setbuyerarray(ba => ba.filter((_, i1) => i1 != i)); dispatch(addtoinventory([v.name, false])); setwrongitem('') }} src={cancel} alt="" /></div>))}
                    {buyerarray.length > 0 && (<><button onClick={() => clientmidleware()} className={styles.giving}>отдать</button><p>{newmoney}</p></>)}
                </div>)}
            </div>

        </div>)
    )
}