import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux'
import { store } from "../mainstore";
import AntiqueInvaders from "../spaceinvaders";
import Slots from "../Slots"
import Mainscreen from "../Mainscreen";
import ChariotsRace from "../chariotsrace";
import Notfound from "../404/404";
import Start from "../Start";
export default function Index() {
    return (
        <>
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='' element={<Start />} />
                        <Route path='/slots' element={<Slots />} />
                        <Route path='/current/*' element={<Mainscreen />} />
                        <Route path='/invaders' element={<AntiqueInvaders />} />
                        <Route path='/race' element={<ChariotsRace />} />
                        <Route path='*' element={<Notfound />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        </>
    )
}