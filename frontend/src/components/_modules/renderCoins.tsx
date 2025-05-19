import silvercoin from '../../assets/svg/coins/silver.svg'
import bronzecoin from '../../assets/svg/coins/bronze.svg'

export default function renderCoins(currency: number) {
    return <> &nbsp; {Math.floor(currency / 100) > 0 && (<>{Math.floor(currency / 100)} <img alt='' src={silvercoin} /></>)}  {currency % 100 > 0 && (<>{currency % 100} <img src={bronzecoin} alt="" /></>)}</>
}