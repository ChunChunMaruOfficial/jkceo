import { useEffect, useRef, useState } from 'react'
import getRandom from '../_modules/getRandom'

import chariot1 from '../../assets/svg/chariots/1.svg'
import chariot2 from '../../assets/svg/chariots/2.svg'
import chariot3 from '../../assets/svg/chariots/3.svg'
import chariot4 from '../../assets/svg/chariots/4.svg'
import chariot5 from '../../assets/svg/chariots/5.svg'

import styles from './style.module.scss'

export default function ChariotsRace() {
const chariots = [chariot1,chariot2,chariot3,chariot4,chariot5]
    return (
        <div className={styles.parent}>

        </div>
    )
}