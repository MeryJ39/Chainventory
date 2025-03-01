// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UsuarioContract {
    struct Usuario {
        uint id;
        string username;
        bytes32 passwordHash;
        string rol;
        bool activo;
    }

    mapping(uint => Usuario) public usuarios;
    mapping(string => uint) private usernameToId; // Mapeo para buscar usuarios por nombre
    uint public siguienteUsuarioId = 1;
    
    address public administrador; // 🛠 El administrador del sistema

    event UsuarioRegistrado(uint id, string username, string rol);
    event UsuarioEliminado(uint id, string username);
    event ContrasenaCambiada(uint id, string username);
    event RolCambiado(uint id, string username, string nuevoRol);

    modifier soloAdministrador() {
        require(msg.sender == administrador, "No tienes permisos de administrador");
        _;
    }

    constructor() {
        administrador = msg.sender; // 🚀 El creador del contrato es el admin inicial
    }

    // 📌 Registrar un nuevo usuario
    function registrarUsuario(string memory _username, string memory _password, string memory _rol) public soloAdministrador {
        require(usernameToId[_username] == 0, "El usuario ya existe");

        uint id = siguienteUsuarioId++;
        usuarios[id] = Usuario(id, _username, keccak256(abi.encodePacked(_password)), _rol, true);
        usernameToId[_username] = id;

        emit UsuarioRegistrado(id, _username, _rol);
    }

    // 📌 Validar usuario (Login)
    function validarUsuario(string memory _username, string memory _password) public view returns (bool, string memory) {
        uint id = usernameToId[_username];
        if (id == 0 || !usuarios[id].activo) {
            return (false, "Usuario no encontrado o inactivo");
        }

        Usuario memory user = usuarios[id];
        if (user.passwordHash == keccak256(abi.encodePacked(_password))) {
            return (true, user.rol);
        } else {
            return (false, "Contrasena incorrecta");
        }
    }

    // 📌 Cambiar la contraseña de un usuario
    function cambiarContrasena(string memory _username, string memory _nuevaPassword) public soloAdministrador {
        uint id = usernameToId[_username];
        require(id != 0, "Usuario no encontrado");

        usuarios[id].passwordHash = keccak256(abi.encodePacked(_nuevaPassword));
        emit ContrasenaCambiada(id, _username);
    }

    // 📌 Cambiar el rol de un usuario
    function cambiarRol(string memory _username, string memory _nuevoRol) public soloAdministrador {
        uint id = usernameToId[_username];
        require(id != 0, "Usuario no encontrado");

        usuarios[id].rol = _nuevoRol;
        emit RolCambiado(id, _username, _nuevoRol);
    }

    // 📌 Eliminar usuario (desactivarlo)
    function eliminarUsuario(string memory _username) public soloAdministrador {
        uint id = usernameToId[_username];
        require(id != 0, "Usuario no encontrado");

        usuarios[id].activo = false;
        emit UsuarioEliminado(id, _username);
    }

    // 📌 Obtener datos de un usuario por nombre
    function obtenerUsuario(string memory _username) public view returns (string memory, string memory, bool) {
        uint id = usernameToId[_username];
        require(id != 0, "Usuario no encontrado");

        Usuario memory user = usuarios[id];
        return (user.username, user.rol, user.activo);
    }

    // 📌 Listar usuarios (Solo para el administrador)
    function listarUsuarios() public view soloAdministrador returns (Usuario[] memory) {
        Usuario[] memory lista = new Usuario[](siguienteUsuarioId - 1);
        for (uint i = 1; i < siguienteUsuarioId; i++) {
            lista[i - 1] = usuarios[i];
        }
        return lista;
    }
}
