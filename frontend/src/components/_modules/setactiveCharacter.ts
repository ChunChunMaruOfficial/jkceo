import UserInterface from "../_Interfaces/UserInterface"

export default function setactiveCharacter(key: string, value: any) {
    const activeuser = JSON.parse(localStorage.getItem('activeuser')!)
    const users = JSON.parse(localStorage.getItem('users')!)
    activeuser[key] = value
    console.log(activeuser);
    
    users.find((v: UserInterface) => v.key == activeuser.key)[key] = value
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('activeuser', JSON.stringify(activeuser))
}