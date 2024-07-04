import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { HiHome } from "react-icons/hi2";


export default function Sidebar() {
    return (
        <div className="flex flex-col gap-4 pr-3">
            <Link href={'/'}>
                <FaXTwitter className="w-16 h-16 cursor-pointer p-3 hover:bg-gray-100 rounded-full transition-all duration-200" />
            </Link>
            <Link href={'/'} className="flex items-center p-3 hover:bg-gray-100 rounded-full transition-all duration-200 gap-2 w-fit">
                <HiHome className="w-7 h-7 " />
                <span className="font-bold hidden xl:inline">Home</span>
            </Link>
            <button className="bg-blue-500 hidden xl:inline font-semibold text-white w-48 h-9 rounded-full px-4 py-2 hover:brightness-95 shadow-md transition-all duration-200">
                Sign In
            </button>
        </div>
    )
}
