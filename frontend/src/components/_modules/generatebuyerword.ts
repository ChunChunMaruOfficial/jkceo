    export default function generatebuyerword (text: string, setbuyerword: React.Dispatch<React.SetStateAction<string>>, daysorder: React.MutableRefObject<{ time: number; text: string; done: boolean }[] | null>, id?: number){
        let i = 0
        const words = text
        setbuyerword(' ')
        
        setbuyerword(bw => {
            bw == ' ' &&
                setTimeout(() => {
                    setbuyerword(words[0])
                    const generateinterval = setInterval(() => {
                        setbuyerword((bw: string) => { return bw + words[i] })
                        i++
                        i + 1 == words.length && clearInterval(generateinterval)
                    }, 50)
                    daysorder.current![id ?? 0].done = true
                }, id != null ? 1000 : 27); return bw
        })
    }