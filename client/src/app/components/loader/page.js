import { FaSpinner } from "react-icons/fa"

export default function Loader() {
    return (
        <div className="flex justify-center items-center">
            <FaSpinner className="animate-spin text-3xl text-[#ff4d2d]" />
        </div>
    )
}