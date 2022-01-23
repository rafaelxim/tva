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
import Dialog from "@mui/material/Dialog";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
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
import { StoreState } from "../../actions/types";
import { hasRole } from "../../helpers/authHelper";
import PermissionDenied from "../PermissionDenied";
import FormRow from "../../components/FormRow";
import FormField from "../../components/FormField";
import { ROLES, ROLES_IDS } from "../../actions";
import { Company, GetCompaniesResponse } from "../Companies";
import { validateEmail } from "../../utils";

type Props = Record<string, never>;

export type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  is_active: boolean;
};

export type GetUsersResponse = User[];

const columns: readonly Column[] = [
  { id: "id", label: "#" },
  { id: "empresa", label: "EMPRESA" },
  {
    id: "status",
    label: "STATUS",
  },
  {
    id: "acoes",
    label: "AÇÕES",
  },
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const ROLES_OPTIONS = ROLES.filter((r) => r.name !== "Company").map(
  (r) => r.name
);

const Users: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: StoreState) => state.authReducer);

  const [hasPermission, setPermission] = useState(false);
  const [rows, setRows] = useState<User[]>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setOpenModal] = useState(false);
  const [userName, setUserName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [userStatus, setUserStatus] = useState<string>("ativo");
  const [modalMode, setModalMode] = useState<"Edit" | "Add">("Add");
  const [selectedUser, setSelectedUser] = useState<User>();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isCompanyUser, setIsCompanyUser] = useState<boolean>(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  useEffect(() => {
    const isPermitOk = hasRole(user!, "Administrator");
    setPermission(isPermitOk);

    if (isPermitOk) {
      fetchUsers();
      fetchCompanies();
    }
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

  const handleChangeCompany = (
    event: SelectChangeEvent<typeof selectedCompanies>
  ) => {
    const {
      target: { value },
    } = event;
    setSelectedCompanies(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",").slice(-1) : value.slice(-1)
    );
  };

  const getCompanyNames = () => {
    return companies?.map((company) => {
      return company.name;
    });
  };

  const getCompanyCodes = () => {
    return selectedCompanies.map((sCompany) => {
      return companies.find((c) => c.name === sCompany)?.id;
    });
  };

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const { data } = await api.get<GetUsersResponse>("/user/");
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
    setUserStatus(event.target.value);
  };

  const resetModalState = () => {
    setUserName("");
    setLastName("");
    setFirstName("");
    setEmail("");
    setPassword("");
    setSelectedRoles([]);
    setIsCompanyUser(false);
    setSelectedCompanies([]);
  };

  const handleChangeRole = (event: SelectChangeEvent<typeof selectedRoles>) => {
    const {
      target: { value },
    } = event;
    setSelectedRoles(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCompanyUser(event.target.checked);
  };

  const saveUserData = async () => {
    if (
      !userName ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      selectedCompanies.length === 0
    ) {
      dispatch(
        setSnackbarAlert({
          message: "Os campos são obrigatórios!",
          isVisible: true,
          severity: "error",
        })
      );
      return;
    }

    if (selectedRoles.length === 0 && !isCompanyUser) {
      dispatch(
        setSnackbarAlert({
          message: "Selecione o perfil do usuário!",
          isVisible: true,
          severity: "error",
        })
      );
      return;
    }

    if (!validateEmail(email!)) {
      dispatch(
        setSnackbarAlert({
          message: "Preencha um email válido!",
          isVisible: true,
          severity: "error",
        })
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        username: userName,
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        is_active: userStatus === "ativo",
        groups: selectedRoles.map((r) =>
          Number(Object.keys(ROLES_IDS).find((key) => ROLES_IDS[key] === r))
        ),
        company: getCompanyCodes()[0],
      };

      if (modalMode === "Add" && !isCompanyUser) {
        await api.post("/register/", payload);
      } else if (modalMode === "Add" && isCompanyUser) {
        await api.post("/company-user/", {
          ...payload,
          age_control_password: "123456789",
        });
      } else {
        await api.patch(`/user/${selectedUser!.id}/`, payload);
      }

      setLoading(false);
      setOpenModal(false);
      resetModalState();
      fetchUsers();
      dispatch(
        setSnackbarAlert({
          message: "Os dados foram salvos com sucesso!",
          isVisible: true,
          severity: "success",
        })
      );
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

  const handleEditClick = (row: User) => {
    setModalMode("Edit");
    setUserName(row.username);
    setUserStatus(row.is_active ? "ativo" : "inativo");
    setOpenModal(true);
    setSelectedUser(row);
  };

  // const onDeleteUser = async () => {
  //   setLoading(true);
  //   try {
  //     await api.delete(`/user/${selectedUser?.id}/`);
  //     fetchUsers();
  //     setOpenModal(false);
  //     dispatch(
  //       setSnackbarAlert({
  //         message: "O usuário foi excluído",
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

  if (!hasPermission) {
    return <PermissionDenied />;
  }

  return (
    <div className="users">
      <Backdrop open={loading} />
      <Header />

      <Dialog
        fullWidth
        maxWidth="md"
        open={modalIsOpen}
        onClose={handleCloseModal}
        className="users__modal"
      >
        <Backdrop open={loading} />
        <DialogContent>
          <h1 className="users__modalTitle">
            {modalMode === "Edit"
              ? `Editar Usuário - ${selectedUser?.username}`
              : "Adicionar Usuário"}
          </h1>

          <h4 className="users__modalSubtitle">
            <CorporateFareIcon />
            <span>Dados do Usuário</span>
          </h4>

          <FormRow>
            <FormField>
              <TextField
                autoComplete="off"
                className="users__input"
                id="outlined-search"
                label="Username"
                type="text"
                size="small"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                fullWidth
              />
            </FormField>

            <FormField>
              <FormControl fullWidth sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="users__statusLabel">Status</InputLabel>
                <Select
                  labelId="users__statusLabel"
                  value={userStatus}
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
                className="users__input"
                id="outlined-search"
                label="Nome"
                type="text"
                size="small"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
              />
            </FormField>
            <FormField>
              <TextField
                autoComplete="off"
                className="users__input"
                id="outlined-search"
                label="Sobrenome"
                type="text"
                size="small"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField>
              <TextField
                autoComplete="off"
                className="users__input"
                id="outlined-search"
                label="Email"
                type="text"
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
            </FormField>
            <FormField>
              <TextField
                autoComplete="off"
                className="users__input"
                id="outlined-search"
                label="Password"
                type="password"
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField>
              <FormControlLabel
                control={
                  <Switch
                    checked={isCompanyUser}
                    onChange={(e) => handleChangeSwitch(e)}
                  />
                }
                label="Usuário Empresa?"
              />
            </FormField>
          </FormRow>

          {!isCompanyUser && (
            <FormRow>
              <FormField>
                <FormControl size="small" fullWidth sx={{ m: 1 }}>
                  <InputLabel id="channels__empresasLabel">Perfis</InputLabel>
                  <Select
                    labelId="channels__empresasLabel"
                    multiple
                    value={selectedRoles}
                    onChange={handleChangeRole}
                    input={<OutlinedInput label="Perfis" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                    fullWidth
                    size="small"
                  >
                    {ROLES_OPTIONS.map((name) => (
                      <MenuItem key={name} value={name}>
                        <Checkbox checked={selectedRoles.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormField>
            </FormRow>
          )}

          <FormRow>
            <FormField>
              <FormControl size="small" fullWidth sx={{ m: 1 }}>
                <InputLabel id="packages__empresasLabel">Empresa</InputLabel>
                <Select
                  labelId="packages__empresasLabel"
                  multiple
                  value={selectedCompanies}
                  onChange={handleChangeCompany}
                  input={<OutlinedInput label="Empresa" />}
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
            </FormField>
          </FormRow>

          <div className="users__actions">
            <Button
              onClick={() => saveUserData()}
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
                onClick={() => onDeleteUser()}
                type="button"
                variant="contained"
              >
                Excluir Usuário
              </Button>
            )} */}
          </div>
        </DialogContent>
      </Dialog>

      <div className="users__content">
        <Navigation />

        <div className="users__bar">
          <Button
            onClick={handleAddClick}
            type="button"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Adicionar Usuário
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
                          <TableCell>{row.username}</TableCell>
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
                                className="users__icon"
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

export default Users;
