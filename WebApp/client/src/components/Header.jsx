import logo from '../images/GitHub-Mark-Light-32px.png'

function Header() {
    return (
        <div className="App-header">
            <header>------Traffic Monitor---------</header>
            <a href='www.google.com' className="Git-Logo">
            <img src={logo} alt = "Logo" ></img>
              GitHub</a>

        </div>

    )

}




export default Header