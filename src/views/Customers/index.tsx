import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
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
import { Company, GetCompaniesResponse } from "../Companies";
import { validateEmail } from "../../utils";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

type Props = Record<string, never>;

type Customer = {
  id: number;
  name: string;
  is_active: boolean;
  email: string;
  password: string;
  age_control_password: string;
  company: number[];
};

type GetCustomersResponse = Customer[];

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

  const [rows, setRows] = useState<Customer[]>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setOpenModal] = useState(false);
  const [customerName, setCustomerName] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [ageControlPassword, setAgeControlPassword] = useState<string>();
  const [customerMail, setCustomerMail] = useState<string>();
  const [customerStatus, setCustomerStatus] = useState<string>("ativo");
  const [modalMode, setModalMode] = useState<"Edit" | "Add">("Add");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  useEffect(() => {
    fetchCustomers();
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);

    try {
      const { data } = await api.get<GetCompaniesResponse>("/company/");
      setCompanies(data);
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

  const getCompanyNames = () => {
    return companies?.map((company) => {
      return company.name;
    });
  };

  const getCompanyNamesFromId = (ids: number[]): string[] => {
    return ids.map((id) => companies.find((c) => c.id === id)!.name);
  };

  const getCompanyCodes = () => {
    return selectedCompanies.map((sCompany) => {
      return companies.find((c) => c.name === sCompany)?.id;
    });
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

  const resetModalState = () => {
    setCustomerName("");
    setSelectedCompanies([]);
    setCustomerMail("");
    setAgeControlPassword("");
    setPassword("");
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

    if (selectedCompanies.length === 0) {
      dispatch(
        setSnackbarAlert({
          message: "Selecione pelo menos uma empresa associada",
          isVisible: true,
          severity: "error",
        })
      );
      return;
    }

    try {
      setLoading(true);
      if (modalMode === "Add") {
        await api.post("/customer/", {
          name: customerName,
          is_active: customerStatus === "ativo",
          company: getCompanyCodes(),
          email: customerMail,
          user: 1,
          password,
          age_control_password: ageControlPassword,
        });
      } else {
        await api.patch(`/customer/${selectedCustomer!.id}/`, {
          name: customerName,
          is_active: customerStatus === "ativo",
          company: getCompanyCodes(),
          email: customerMail,
          user: 1,
          password,
          age_control_password: ageControlPassword,
        });
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

  const handleAddClick = () => {
    setModalMode("Add");
    setOpenModal(true);
  };

  const handleEditClick = (row: Customer) => {
    setModalMode("Edit");
    setCustomerName(row.name);
    setCustomerStatus(row.is_active ? "ativo" : "inativo");
    setCustomerMail(row.email);
    setSelectedCompanies(getCompanyNamesFromId(row.company));
    setOpenModal(true);
    setSelectedCustomer(row);
    setAgeControlPassword(row.age_control_password);
    setPassword(row.password);
  };

  const onDeleteCustomer = async () => {
    setLoading(true);
    try {
      await api.delete(`/customer/${selectedCustomer?.id}/`);
      fetchCustomers();
      setOpenModal(false);
      dispatch(
        setSnackbarAlert({
          message: "O cliente foi excluído",
          isVisible: true,
          severity: "success",
        })
      );
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

  const handleCloseModal = () => {
    resetModalState();
    setOpenModal(false);
  };

  const handleChangeCompany = (
    event: SelectChangeEvent<typeof selectedCompanies>
  ) => {
    const {
      target: { value },
    } = event;
    setSelectedCompanies(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

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
              ? `Editar Cliente - ${selectedCustomer?.name}`
              : "Adicionar Cliente"}
          </h1>

          <h4 className="customers__modalSubtitle">
            <PersonOutlineIcon />
            <span>Dados do Cliente</span>
          </h4>

          <div className="customers__form">
            <div className="customers__formGroup">
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
            </div>

            <div className="customers__formGroup">
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
            </div>
          </div>

          <div className="customers__form">
            <div className="customers__formGroup">
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
            </div>
            <div className="customers__formGroup">
              <FormControl size="small" fullWidth sx={{ m: 1, width: 200 }}>
                <InputLabel id="customers__empresasLabel">
                  Empresa(s)
                </InputLabel>
                <Select
                  labelId="customers__empresasLabel"
                  multiple
                  value={selectedCompanies}
                  onChange={handleChangeCompany}
                  input={<OutlinedInput label="Empresa(s)" />}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                  fullWidth
                  size="small"
                >
                  {getCompanyNames().map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox
                        checked={selectedCompanies.indexOf(name) > -1}
                      />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="customers__form">
            <div className="customers__formGroup">
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
            </div>

            <div className="customers__formGroup">
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
            </div>
          </div>

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

            {modalMode === "Edit" && (
              <Button
                className="strongRed"
                onClick={() => onDeleteCustomer()}
                type="button"
                variant="contained"
              >
                Excluir Cliente
              </Button>
            )}
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
                          <TableCell>{row.name}</TableCell>
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
