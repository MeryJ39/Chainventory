import React, { useEffect, useState, useCallback } from "react";
import Web3 from "web3";
import usuarioContract from "../utils/contracts/usuarioContract";
import ventaContract from "../utils/contracts/ventaContract";
import productoContract from "../utils/contracts/productoContract";
import web3 from "../utils/web3"; // Import your web3 instance
import { PencilIcon } from "@heroicons/react/24/solid";
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";

const TABLE_HEAD = ["Hash", "Bloque", "Timestamp", "De", "A", "Valor (ETH)"];

const Auditoria = () => {
  const [eventos, setEventos] = useState([]);
  const [transaccionesBlockchain, setTransaccionesBlockchain] = useState([]); // All fetched transactions
  const [filteredTransactions, setFilteredTransactions] = useState([]); // Transactions for current page
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  const [filtered, setFiltered] = useState([]); // Array to hold date-filtered transactions

  const fetchBlockchainTransactions = useCallback(async () => {
    if (web3) {
      setLoadingTransactions(true);
      try {
        const latestBlockNumber = await web3.eth.getBlockNumber();
        const allTransactions = [];

        for (let i = 0; i <= Number(latestBlockNumber); i++) {
          const blockNumber = BigInt(i);
          if (blockNumber >= BigInt(0)) {
            try {
              const block = await web3.eth.getBlock(blockNumber, true);
              if (block && block.transactions) {
                block.transactions.forEach((tx) => {
                  let etherValueStr = "0";
                  try {
                    etherValueStr = web3.utils
                      .fromWei(tx.value, "ether")
                      .toString();
                  } catch (valueError) {
                    console.error(
                      "Error converting value to Ether:",
                      valueError
                    );
                    etherValueStr = "Error";
                  }

                  allTransactions.push({
                    hash: tx.hash,
                    blockNumber: Number(block.number),
                    timestamp: Number(block.timestamp),
                    from: tx.from,
                    to: tx.to,
                    value: etherValueStr,
                  });
                });
              }
            } catch (blockError) {
              console.error(`Error fetching block ${blockNumber}:`, blockError);
            }
          }
        }

        // Sort transactions by blockNumber in descending order (latest first)
        const sortedTransactions = allTransactions.sort(
          (a, b) => b.blockNumber - a.blockNumber
        );

        setTransaccionesBlockchain(sortedTransactions);
        setLoadingTransactions(false);
      } catch (error) {
        console.error("Error fetching blockchain transactions:", error);
        setLoadingTransactions(false);
      }
    }
  }, [web3]);

  useEffect(() => {
    fetchBlockchainTransactions(); // Fetch all blockchain transactions on component mount

    usuarioContract.events.UsuarioRegistrado({}, (error, event) => {
      if (!error) {
        setEventos((prev) => [
          ...prev,
          {
            tipo: "Usuario",
            detalle: `👤 ${event.returnValues.username} registrado.`,
          },
        ]);
      }
    });

    ventaContract.events.VentaRegistrada({}, (error, event) => {
      if (!error) {
        setEventos((prev) => [
          ...prev,
          {
            tipo: "Venta",
            detalle: `🛒 Venta de ${event.returnValues.cantidad} unidades realizada.`,
          },
        ]);
      }
    });

    productoContract.events.ProductoRegistrado({}, (error, event) => {
      if (!error) {
        setEventos((prev) => [
          ...prev,
          {
            tipo: "Producto",
            detalle: `📦 Producto ${event.returnValues.tipo} agregado.`,
          },
        ]);
      }
    });
  }, [fetchBlockchainTransactions]);

  useEffect(() => {
    // Function to filter and paginate transactions
    const filterAndPaginateTransactions = () => {
      let dateFilteredTransactions = transaccionesBlockchain; // Rename to avoid confusion

      // Date filtering
      if (startDateFilter || endDateFilter) {
        const startDate = startDateFilter
          ? new Date(startDateFilter).getTime()
          : null;
        const endDate = endDateFilter
          ? new Date(endDateFilter).getTime()
          : null;

        dateFilteredTransactions = transaccionesBlockchain.filter((tx) => {
          const txDate = new Date(tx.timestamp * 1000).getTime();
          if (startDate && endDate) {
            return txDate >= startDate && txDate <= endDate;
          } else if (startDate) {
            return txDate >= startDate;
          } else if (endDate) {
            return txDate <= endDate;
          }
          return true;
        });
      }

      setFiltered(dateFilteredTransactions); // Set the date-filtered transactions

      // Pagination
      const startIndex = (currentPage - 1) * transactionsPerPage;
      const endIndex = startIndex + transactionsPerPage;
      const paginatedTransactions = dateFilteredTransactions.slice(
        startIndex,
        endIndex
      ); // Paginate dateFilteredTransactions

      setFilteredTransactions(paginatedTransactions);
    };

    filterAndPaginateTransactions();
  }, [transaccionesBlockchain, startDateFilter, endDateFilter, currentPage]);

  const handleStartDateChange = (e) => {
    setStartDateFilter(e.target.value);
    setCurrentPage(1); // Reset pagination on filter change
  };

  const handleEndDateChange = (e) => {
    setEndDateFilter(e.target.value);
    setCurrentPage(1); // Reset pagination on filter change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // CSV download functionality
  const downloadTransactionsAsCSV = () => {
    const csvRows = [];
    const headers = TABLE_HEAD.join(",");
    csvRows.push(headers);

    filtered.forEach((tx) => {
      const row = [
        tx.hash,
        tx.blockNumber,
        new Date(tx.timestamp * 1000).toLocaleString(),
        tx.from,
        tx.to,
        tx.value,
      ].join(",");
      csvRows.push(row);
    });

    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "blockchain_transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Correct totalPages calculation using 'filtered' array
  const totalPages = Math.ceil(filtered.length / transactionsPerPage);

  const paginationButtons = () => {
    let buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <IconButton
          key={i}
          variant={currentPage === i ? "outlined" : "text"}
          size="sm"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </IconButton>
      );
    }
    return buttons;
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="p-5">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">
        🔍 Registro de Auditoría
      </h2>

      <div className="mb-8">
        <h3 className="mb-3 text-lg font-semibold text-gray-700">
          Eventos de Contratos
        </h3>
        <div className="overflow-x-auto">
          <ul className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200 rounded-md shadow-sm">
            {eventos.map((evento, index) => (
              <li
                key={index}
                className="px-4 py-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <span className="mr-2">{evento.tipo}</span>
                  <p className="text-sm text-gray-600">{evento.detalle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <Card className="w-full h-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="flex flex-col justify-between gap-6 mb-4 md:flex-row md:items-center">
              <div>
                <Typography variant="h5" color="blue-gray">
                  Transacciones Blockchain
                </Typography>
              </div>
              <div className="flex flex-col w-full gap-2 sm:flex-row shrink-0 sm:items-center">
                <div className="flex flex-col w-full gap-2 sm:flex-row sm:w-auto">
                  <Input
                    type="date"
                    label="Fecha inicio"
                    value={startDateFilter || ""}
                    onChange={handleStartDateChange}
                    className="mb-2 sm:mb-0"
                  />
                  <Input
                    type="date"
                    label="Fecha fin"
                    value={endDateFilter || ""}
                    onChange={handleEndDateChange}
                  />
                </div>
                <Button
                  className="flex items-center flex-1 gap-3 sm:flex-none"
                  size="sm"
                  onClick={downloadTransactionsAsCSV} // Attach download function
                >
                  <ArrowDownTrayIcon strokeWidth={2} className="w-4 h-4" />
                  Descargar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody className="px-0 overflow-scroll">
            {loadingTransactions ? (
              <div className="w-full p-4 text-center">
                <Typography>Cargando transacciones...</Typography>
              </div>
            ) : (
              <table className="w-full text-left table-auto min-w-max">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx, index) => {
                    const isLast = index === filteredTransactions.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";
                    return (
                      <tr key={tx.hash}>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {tx.hash}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {tx.blockNumber}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {new Date(tx.timestamp * 1000).toLocaleString()}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-mono font-normal"
                          >
                            {tx.from}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-mono font-normal"
                          >
                            {tx.to}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {tx.value} ETH
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Tooltip content="Ver detalles">
                            <IconButton variant="text">
                              <PencilIcon className="w-4 h-4" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardBody>
          <CardFooter className="flex items-center justify-between p-4 border-t border-blue-gray-50">
            <Button
              variant="outlined"
              size="sm"
              disabled={currentPage === 1}
              onClick={goToPreviousPage}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-2">{paginationButtons()}</div>
            <Button
              variant="outlined"
              size="sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={goToNextPage}
            >
              Siguiente
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auditoria;
