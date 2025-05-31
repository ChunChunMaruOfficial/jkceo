
export interface AnnouncementsInterface {
    text: string,
    date: number,
    imgsrc: string,
    name: string,
    materials: {name: string, count: number}[],
    price: number
}