// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UsuarioContract {
    struct Usuario {
        uint id;
        string username;
        bytes32 passwordHash;
        string rol;
    }

    mapping(uint => Usuario) public usuarios;
    uint public siguienteUsuarioId = 1;

    event UsuarioRegistrado(uint id, string username, string rol);

    function registrarUsuario(
        string memory _username,
        string memory _password,
        string memory _rol
    ) public {
        uint id = siguienteUsuarioId++;
        usuarios[id] = Usuario(id, _username, keccak256(abi.encodePacked(_password)), _rol);
        emit UsuarioRegistrado(id, _username, _rol);
    }
}
