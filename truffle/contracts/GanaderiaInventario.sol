// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ProductoContract.sol";
import "./VentaContract.sol";
import "./AnimalContract.sol";
import "./VacunaContract.sol";
import "./UsuarioContract.sol";

contract GanaderiaInventario {
    ProductoContract public productoContract;
    VentaContract public ventaContract;
    AnimalContract public animalContract;
    VacunaContract public vacunaContract;
    UsuarioContract public usuarioContract;

    constructor(
        address _productoContract,
        address _ventaContract,
        address _animalContract,
        address _vacunaContract,
        address _usuarioContract
    ) {
        productoContract = ProductoContract(_productoContract);
        ventaContract = VentaContract(_ventaContract);
        animalContract = AnimalContract(_animalContract);
        vacunaContract = VacunaContract(_vacunaContract);
        usuarioContract = UsuarioContract(_usuarioContract);
    }
}
