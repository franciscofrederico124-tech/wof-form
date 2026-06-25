import Home from "../pages/home/home"
import { BrowserRouter, Route, Routes } from "react-router-dom"

export default function MainRoute() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<Home />} />
            </Routes>
        </BrowserRouter>
    )
}