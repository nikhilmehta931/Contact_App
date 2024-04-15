const Logout = () => {
    const token = localStorage.getItem('token')
    localStorage.removeItem('token')
    return (
        <>
            {
                token ? (<h1>Logged</h1>) : (<h1>lg out</h1>)
            }
        </>
    )
}

export default Logout;