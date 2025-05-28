import getRandom from "./getRandom"
import generatebuyerword from "./generatebuyerword";

export default function clientissatisfied(status: boolean, setbuyerword: React.Dispatch<React.SetStateAction<string>>, setbuyertime: React.Dispatch<React.SetStateAction<number>>, setispopupopen: React.Dispatch<React.SetStateAction<number>>, setbuyerstatus: React.Dispatch<React.SetStateAction<boolean | null>>, daysorder: React.MutableRefObject<{ time: number; text: string; done: boolean }[] | null>,buyerlucky:string[], buyerrefusal: string[], noanswer: string[],buyertime: number) {

    let lastwords: string = ''
    if (status) {
        lastwords = buyerlucky[getRandom(0, buyerlucky.length - 1)]
        setispopupopen(0)
        
    } else {
 
          lastwords = buyertime < 2 ? noanswer[getRandom(0, noanswer.length - 1)] : buyerrefusal[getRandom(0, buyerrefusal.length - 1)]

        
    }
    setbuyertime(0)
    console.log(lastwords);
    
    generatebuyerword(lastwords, setbuyerword, daysorder)
    setTimeout(() => {
        setbuyerstatus(status)
        setbuyerword(' ')
        setTimeout(() => {
            setbuyerstatus(null)
            setbuyerword('')
        }, 350)
    }, (lastwords.length * 55 + 1000))
}
