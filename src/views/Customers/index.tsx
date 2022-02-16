import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import api from "../../services/api";
import "./styles.scss";
import { Column } from "../../types/muiTypes";
import Backdrop from "../../components/Backdrop";
import EditIcon from "../../assets/edit.svg";
import { setSnackbarAlert } from "../../actions/feedbackActions";
import { validateEmail } from "../../utils";
import { Roles, StoreState } from "../../actions/types";
import { hasRole } from "../../helpers/authHelper";
import PermissionDenied from "../PermissionDenied";
import FormRow from "../../components/FormRow";
import FormField from "../../components/FormField";
import { GetPackagesResponse, Package } from "../Packages";

type Props = Record<string, never>;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

export type Customer = {
  id: number;
  first_name: string;
  is_active: boolean;
  email: string;
  password: string;
  age_control_password: string;
  company: number[];
  username: string;
  groups: Roles;
};

export type GetCustomersResponse = Customer[];

const columns: readonly Column[] = [
  { id: "id", label: "#" },
  { id: "cliente", label: "NOME" },
  { id: "email", label: "EMAIL" },
  {
    id: "status",
    label: "STATUS",
  },
  {
    id: "acoes",
    label: "AÇÕES",
  },
];

const Customers: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: StoreState) => state.authReducer);

  const [hasPermission, setPermission] = useState(false);
  const [rows, setRows] = useState<Customer[]>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setOpenModal] = useState(false);
  const [customerName, setCustomerName] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [ageControlPassword, setAgeControlPassword] = useState<string>();
  const [customerMail, setCustomerMail] = useState<string>();
  const [customerStatus, setCustomerStatus] = useState<string>("ativo");
  const [modalMode, setModalMode] = useState<"Edit" | "Add">("Add");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);

  useEffect(() => {
    const isPermitOk = hasRole(user!, "Company");
    setPermission(isPermitOk);

    if (isPermitOk) {
      fetchPackages();
      fetchCustomers();
    }
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);

    try {
      const { data } = await api.get<GetCustomersResponse>("/customer/");
      setRows(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setCustomerStatus(event.target.value);
  };

  const getPackageCodes = () => {
    return selectedPackages.map((sPackage) => {
      return packages.find((c) => c.name === sPackage)?.id;
    });
  };

  const resetModalState = () => {
    setCustomerName("");
    setCustomerMail("");
    setAgeControlPassword("");
    setPassword("");
    setUsername("");
  };

  const saveCustomerData = async () => {
    if (!customerName) {
      dispatch(
        setSnackbarAlert({
          message: "O campo nome do cliente é obrigatório!",
          isVisible: true,
          severity: "error",
        })
      );
      return;
    }

    if (!username) {
      dispatch(
        setSnackbarAlert({
          message: "O campo username é obrigatório!",
          isVisible: true,
          severity: "error",
        })
      );
      return;
    }

    if (!password) {
      dispatch(
        setSnackbarAlert({
          message: "O campo de senha do cliente é obrigatório!",
          isVisible: true,
          severity: "error",
        })
      );
      return;
    }

    if (!ageControlPassword) {
      dispatch(
        setSnackbarAlert({
          message: "O campo da senha de controle de idade é obrigatório!",
          isVisible: true,
          severity: "error",
        })
      );
      return;
    }

    if (!validateEmail(customerMail!)) {
      dispatch(
        setSnackbarAlert({
          message: "Preencha o campo EMAIL corretamente",
          isVisible: true,
          severity: "error",
        })
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        first_name: customerName,
        is_active: customerStatus === "ativo",
        email: customerMail,
        password,
        username,
        age_control_password: ageControlPassword,
        ...(selectedPackages.length > 0 && { package: getPackageCodes()[0] }),
      };

      if (modalMode === "Add") {
        await api.post("/customer/", payload);
      } else {
        await api.patch(`/customer/${selectedCustomer!.id}/`, payload);
      }

      setLoading(false);
      setOpenModal(false);
      resetModalState();
      fetchCustomers();
      dispatch(
        setSnackbarAlert({
          message: "Os dados foram salvos com sucesso!",
          isVisible: true,
          severity: "success",
        })
      );
    } catch (e: any) {
      dispatch(
        setSnackbarAlert({
          message: `Houve um erro ao tentar realizar a requisição`,
          isVisible: true,
          severity: "error",
        })
      );

      setLoading(false);
    }
  };

  const handleChangePackage = (
    event: SelectChangeEvent<typeof selectedPackages>
  ) => {
    const {
      target: { value },
    } = event;
    setSelectedPackages(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",").slice(-1) : value.slice(-1)
    );
  };

  const fetchPackages = async () => {
    setLoading(true);

    try {
      const { data } = await api.get<GetPackagesResponse>("/package/");
      setPackages(data);
      setLoading(false);
    } catch (e) {
      dispatch(
        setSnackbarAlert({
          message: "Houve um erro ao tentar realizar a requisição",
          isVisible: true,
          severity: "error",
        })
      );
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setModalMode("Add");
    setOpenModal(true);
  };

  const handleEditClick = (row: Customer) => {
    setModalMode("Edit");
    setCustomerName(row.first_name);
    setCustomerStatus(row.is_active ? "ativo" : "inativo");
    setCustomerMail(row.email);
    setOpenModal(true);
    setSelectedCustomer(row);
    setAgeControlPassword(row.age_control_password);
    setPassword(row.password);
  };

  // const onDeleteCustomer = async () => {
  //   setLoading(true);
  //   try {
  //     await api.delete(`/customer/${selectedCustomer?.id}/`);
  //     fetchCustomers();
  //     setOpenModal(false);
  //     dispatch(
  //       setSnackbarAlert({
  //         message: "O cliente foi excluído",
  //         isVisible: true,
  //         severity: "success",
  //       })
  //     );
  //     setLoading(false);
  //   } catch (e) {
  //     dispatch(
  //       setSnackbarAlert({
  //         message: "Houve um erro ao tentar realizar a requisição",
  //         isVisible: true,
  //         severity: "error",
  //       })
  //     );
  //     setLoading(false);
  //   }
  // };

  const handleCloseModal = () => {
    resetModalState();
    setOpenModal(false);
  };

  const getPackageNames = () => {
    return packages?.map((p) => {
      return p.name;
    });
  };

  if (!hasPermission) {
    return <PermissionDenied />;
  }

  return (
    <div className="customers">
      <Backdrop open={loading} />
      <Header />

      <Dialog
        fullWidth
        maxWidth="md"
        open={modalIsOpen}
        onClose={handleCloseModal}
        className="customers__modal"
      >
        <Backdrop open={loading} />
        <DialogContent>
          <h1 className="customers__modalTitle">
            {modalMode === "Edit"
              ? `Editar Cliente - ${selectedCustomer?.first_name}`
              : "Adicionar Cliente"}
          </h1>

          <h4 className="customers__modalSubtitle">
            <PersonOutlineIcon />
            <span>Dados do Cliente</span>
          </h4>

          <FormRow>
            <FormField>
              <TextField
                className="customers__input"
                id="outlined-search"
                label="Nome do Cliente"
                type="text"
                size="small"
                value={customerName}
                autoComplete="off"
                onChange={(e) => setCustomerName(e.target.value)}
                fullWidth
              />
            </FormField>

            <FormField>
              <FormControl fullWidth sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="customers__statusLabel">Status</InputLabel>
                <Select
                  labelId="customers__statusLabel"
                  value={customerStatus}
                  label="Status"
                  onChange={handleSelectChange}
                  size="small"
                  fullWidth
                >
                  <MenuItem value="ativo">Ativo</MenuItem>
                  <MenuItem value="inativo">Inativo</MenuItem>
                </Select>
              </FormControl>
            </FormField>
          </FormRow>

          <FormRow>
            <FormField>
              <TextField
                autoComplete="off"
                className="customers__input"
                id="outlined-search"
                label="Email"
                type="email"
                size="small"
                value={customerMail}
                onChange={(e) => setCustomerMail(e.target.value)}
                fullWidth
              />
            </FormField>
            <FormField>
              <TextField
                autoComplete="off"
                className="customers__input"
                id="outlined-search"
                label="Username"
                type="text"
                size="small"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField>
              <TextField
                autoComplete="off"
                className="customers__input"
                id="outlined-search"
                label="Senha"
                type="password"
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
            </FormField>

            <FormField>
              <TextField
                autoComplete="off"
                className="customers__input"
                id="outlined-search"
                label="Senha (Controle de idade)"
                type="password"
                size="small"
                value={ageControlPassword}
                onChange={(e) => setAgeControlPassword(e.target.value)}
                fullWidth
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField>
              <FormControl size="small" fullWidth sx={{ m: 1, width: 200 }}>
                <InputLabel id="channels__empresasLabel">Pacote</InputLabel>
                <Select
                  labelId="channels__empresasLabel"
                  multiple
                  value={selectedPackages}
                  onChange={handleChangePackage}
                  input={<OutlinedInput label="Pacote" />}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                  fullWidth
                  size="small"
                >
                  {getPackageNames().map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={selectedPackages.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </FormField>
          </FormRow>

          <div className="customers__actions">
            <Button
              onClick={() => saveCustomerData()}
              type="button"
              variant="contained"
            >
              Salvar
            </Button>

            <Button
              className="outlinedPurple"
              onClick={() => resetModalState()}
              type="button"
              variant="outlined"
            >
              Resetar
            </Button>

            {/* {modalMode === "Edit" && (
              <Button
                className="strongRed"
                onClick={() => onDeleteCustomer()}
                type="button"
                variant="contained"
              >
                Excluir Cliente
              </Button>
            )} */}
          </div>
        </DialogContent>
      </Dialog>

      <div className="customers__content">
        <Navigation />

        <div className="customers__bar">
          <Button
            onClick={handleAddClick}
            type="button"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Adicionar Cliente
          </Button>
        </div>

        {rows && rows.length > 0 && (
          <>
            <TableContainer className="customStyled" sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.id}
                        >
                          <TableCell>#{row.id}</TableCell>
                          <TableCell>{row.first_name}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>
                            {row.is_active ? (
                              <Chip label="Ativo" color="success" />
                            ) : (
                              <Chip label="Inativo" color="error" />
                            )}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Editar">
                              <img
                                onClick={() => handleEditClick(row)}
                                className="customers__icon"
                                src={EditIcon}
                                alt="edit"
                              />
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Customers;
