import styles from './style.module.scss'

import bullet from '../../assets/svg/skills/bullet.svg'
import invaders from '../../assets/svg/skills/invaders.svg'
import lucky from '../../assets/svg/skills/lucky.svg'
import productspeed from '../../assets/svg/skills/productspeed.svg'
import workers from '../../assets/svg/skills/workers.svg'
import logcabin from '../../assets/svg/maininterface/logcabin.svg'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../mainstore'
import { upgradeskill } from '../_slices/skillsslice'
import renderCoins from '../_modules/renderCoins'

export default function Skills() {
    const dispatch = useDispatch()
    const skills = useSelector((state: RootState) => state.skills);

    const {
        productcreationspeed,
        priceagreementwinnings,
        bulletspeed,
        inventorymax,
        workersmax,
        invadersscale,
    } = skills;

    const SkillsItems = [bulletspeed, invadersscale,
        priceagreementwinnings,
        productcreationspeed,
        workersmax,
        inventorymax]

        console.log(SkillsItems);
        

    const SkillsWrappers = [{ img: bullet, name: 'bulletspeed', text: 'ускорение пуль при истреблении негативных слухов' }, { img: invaders, name: 'invadersscale', text: 'изменение размеров слухов в пользу пользователя' }, { img: lucky, name: 'priceagreementwinnings', text: 'увеличение удачи при договоре о цене покупки сырья' }, { img: productspeed, name: 'productcreationspeed', text: "скорость производства товаров в ручную" }, { img: workers, name: 'workersmax', text: 'увеличить максимальное кол-во работников' }, { img: logcabin, name: 'inventorymax', text: 'увеличить вместимость склада' }]

    return (
        <div className={styles.parent}>
            <h1>Навыки: </h1>
            <div>{SkillsWrappers.map((v, i) => (<div  key={i} onClick={() => dispatch(upgradeskill(v.name))}>
                <img src={v.img} alt="" />
                <span style={{borderColor: SkillsItems[i].level == 6 ? 'var(--strong-orange)' : 'var(--strong-green)'}}>
                    <p>{v.text}</p>
                    <span>
                        <span><h2>Уровень</h2>
                            <p>{SkillsItems[i].level}</p>
                        </span>
                        <h2 style={{color: SkillsItems[i].level == 6 ? 'var(--strong-orange)' : 'var(--strong-green)'}}>{SkillsItems[i].level != 6 ? `улучшить` : 'максимальный уровень'}{ SkillsItems[i].level != 6  && renderCoins(SkillsItems[i].price)}</h2>
                        <span><h2>Значение</h2>
                            <p>{SkillsItems[i].value.toFixed(2)}</p>
                        </span>
                    </span>
                </span>
            </div>))}
            </div>
        </div>
    )
}