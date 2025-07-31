

const Navbar = () => {
    return (
        <nav className="navbar">
        <div className="navbar-brand">
            <a href="/">TribeHub</a>
        </div>
        <ul className="navbar-menu">
            <li><a href="/home">Inicio</a></li>
            <li><a href="/about">Perfil</a></li>
            <li><a href="/contact">Amigos</a></li>
        </ul>
        </nav>
    );
}

export default Navbar;