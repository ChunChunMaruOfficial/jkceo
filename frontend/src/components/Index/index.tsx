import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux'
import { store } from "../mainstore";
import AntiqueInvaders from "../spaceinvaders";
import Slots from "../Slots/slots"
import Mainscreen from "../Mainscreen";
import ChariotsRace from "../chariotsrace";
import Notfound from "../404/404";
export default function Index() {
    return (
        <>
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='' element={<Slots />} />
                        <Route path='/current' element={<Mainscreen />} />
                        <Route path='/invaders' element={<AntiqueInvaders />} />
                        <Route path='/race' element={<ChariotsRace />} />
                        <Route path='*' element={<Notfound />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        </>
    )
}