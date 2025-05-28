import styles from './style.module.scss'
import { useSelector } from 'react-redux';
import { RootState } from '../../mainstore';
import { useMemo } from 'react';

export default function Statistic() {
    const productionArray: number[] = useSelector((state: RootState) => state.base.productionArray);
    
    // Use useMemo to calculate the max value only when productionArray changes
    const productionmax = useMemo(() => {
        let max = 0;
        productionArray.forEach(v => {
            if (v > max) max = v;
        });
        return max;
    }, [productionArray]);

    if (productionArray.length === 0) return null;
    
    return (
        <div id={styles.production}>
            <span>
                <p>{productionmax}</p>
                <p>{productionmax / 2}</p>
                <p>0</p>
            </span>
            {productionArray.map((v, i) => (
                <p 
                    key={i} 
                    style={{ 
                        height: `${productionmax > 0 ? (v / productionmax * 100) : 0}%`, 
                        background: productionmax > 0 ? (
                            v / productionmax > .7 ? '#b2f2bb' : 
                            v / productionmax > .4 ? '#ffec99' : '#ffc9c9'
                        ) : '#ffc9c9', 
                        borderColor: productionmax > 0 ? (
                            v / productionmax > .7 ? '#2f9e44' : 
                            v / productionmax > .4 ? '#f08c00' : '#e03131'
                        ) : '#e03131' 
                    }}
                >
                    {i}
                </p>
            ))}
        </div>
    )
}