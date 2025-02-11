// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Inventario {

    // Estructura para representar un producto
    struct Producto {
        uint id;
        string nombre;
        uint cantidad;
        uint fechaRegistro;
    }

    // Mapping para almacenar productos por ID
    mapping(uint => Producto) public inventario;
    mapping(address => bool) public administradores;
    
    // Eventos para notificar sobre entradas y salidas
    event ProductoRegistrado(uint id, string nombre, uint cantidad, uint fechaRegistro);
    event EntradaProducto(uint id, uint cantidad, uint fechaRegistro);
    event SalidaProducto(uint id, uint cantidad, uint fechaSalida);
    
    // Variable para el próximo ID del producto
    uint public siguienteId = 1;

    // Modificadores
    modifier soloAdministrador() {
        require(administradores[msg.sender] == true, "No eres un administrador.");
        _;
    }

    constructor() {
        // Inicializamos el primer administrador
        administradores[msg.sender] = true;
    }

    // Función para registrar un nuevo producto
    function registrarProducto(string memory nombre, uint cantidad) public soloAdministrador {
        uint id = siguienteId++;
        inventario[id] = Producto(id, nombre, cantidad, block.timestamp);
        emit ProductoRegistrado(id, nombre, cantidad, block.timestamp);
    }

    // Función para registrar la entrada de un producto
    function entradaProducto(uint id, uint cantidad) public soloAdministrador {
        require(inventario[id].id != 0, "Producto no encontrado.");
        inventario[id].cantidad += cantidad;
        emit EntradaProducto(id, cantidad, block.timestamp);
    }

    // Función para registrar la salida de un producto
    function salidaProducto(uint id, uint cantidad) public soloAdministrador {
        require(inventario[id].id != 0, "Producto no encontrado.");
        require(inventario[id].cantidad >= cantidad, "No hay suficiente cantidad.");
        inventario[id].cantidad -= cantidad;
        emit SalidaProducto(id, cantidad, block.timestamp);
    }

    // Función para consultar un producto por ID
    function obtenerProducto(uint id) public view returns (Producto memory) {
        require(inventario[id].id != 0, "Producto no encontrado.");
        return inventario[id];
    }

    // Función para añadir un nuevo administrador
    function agregarAdministrador(address nuevoAdministrador) public soloAdministrador {
        administradores[nuevoAdministrador] = true;
    }

    // Función para eliminar un administrador
    function eliminarAdministrador(address administrador) public soloAdministrador {
        administradores[administrador] = false;
    }
}
