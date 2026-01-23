export default function Header(){
    return (
        <div className="bg-blue-700 flex items-center px-2 py-3 justify-between p-3">
            <div className="text-white font-bold">Cattle Marketplace</div>
            <div className="flex items-center gap-3">
                <input className="border border-amber-50 px-3 rounded" type="text" placeholder="Search your products ..."/>
                <button className="bg-blue-900 text-amber-50 rounded">Search</button>
            </div>
            <div className="flex items-center gap-2">
                <button>Login</button>
                <button>Singup</button>
            </div>
        </div>
    )
}