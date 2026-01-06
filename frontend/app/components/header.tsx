export default function Header(){
    return(
        <div style={{
            display:"flex",
            justifyContent:"space-between"
        }}>
            <div>
                <div>Live Stock Hub</div>
            </div>
            <div style={{
                display:"flex",
                justifyContent:"center"
            }}>
                <div>
                    <input type="text" placeholder="Enter your query"/>
                </div>
                <div>
                    <button>search</button>
                </div>
            </div>
            <div>
                <div>
                    Profile
                </div>
            </div>
        </div>
    )
}