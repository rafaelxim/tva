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

type Props = Record<string, never>;

export type Company = {
  id: number;
  name: string;
  is_active: boolean;
  user: number;
};

export type GetCompaniesResponse = Company[];

const columns: readonly Column[] = [
  { id: "id", label: "#" },
  { id: "empresa", label: "EMPRESA" },
  {
    id: "status",
    label: "STATUS",
  },
  {
    id: "acoes",
    label: "A????ES",
  },
];

const Companies: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: StoreState) => state.authReducer);

  const [hasPermission, setPermission] = useState(false);
  const [rows, setRows] = useState<Company[]>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setOpenModal] = useState(false);
  const [companyName, setCompanyName] = useState<string>();
  const [companyStatus, setCompanyStatus] = useState<string>("ativo");
  const [modalMode, setModalMode] = useState<"Edit" | "Add">("Add");
  const [selectedCompany, setSelectedCompany] = useState<Company>();

  useEffect(() => {
    const isPermitOk =
      hasRole(user!, "Administrator") ||
      hasRole(user!, "Attendant") ||
      hasRole(user!, "Operator");
    setPermission(isPermitOk);

    if (isPermitOk) {
      fetchCompanies();
    }
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);

    try {
      const { data } = await api.get<GetCompaniesResponse>("/company/");
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
    setCompanyStatus(event.target.value);
  };

  const resetModalState = () => {
    setCompanyName("");
  };

  const saveCompanyData = async () => {
    if (!companyName) {
      dispatch(
        setSnackbarAlert({
          message: "O campo nome da empresa ?? obrigat??rio!",
          isVisible: true,
          severity: "error",
        })
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: companyName,
        is_active: companyStatus === "ativo",
        user: user!.id,
      };
      if (modalMode === "Add") {
        await api.post("/company/", payload);
      } else {
        await api.patch(`/company/${selectedCompany!.id}/`, payload);
      }

      setLoading(false);
      setOpenModal(false);
      resetModalState();
      fetchCompanies();
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
          message: "Houve um erro ao tentar realizar a requisi????o",
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

  const handleEditClick = (row: Company) => {
    setModalMode("Edit");
    setCompanyName(row.name);
    setCompanyStatus(row.is_active ? "ativo" : "inativo");
    setOpenModal(true);
    setSelectedCompany(row);
  };

  // const onDeleteCompany = async () => {
  //   setLoading(true);
  //   try {
  //     await api.delete(`/company/${selectedCompany?.id}/`);
  //     fetchCompanies();
  //     setOpenModal(false);
  //     dispatch(
  //       setSnackbarAlert({
  //         message: "A empresa foi exclu??da",
  //         isVisible: true,
  //         severity: "success",
  //       })
  //     );
  //     setLoading(false);
  //   } catch (e) {
  //     dispatch(
  //       setSnackbarAlert({
  //         message: "Houve um erro ao tentar realizar a requisi????o",
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
    <div className="companies">
      <Backdrop open={loading} />
      <Header />

      <Dialog
        fullWidth
        maxWidth="md"
        open={modalIsOpen}
        onClose={handleCloseModal}
        className="companies__modal"
      >
        <Backdrop open={loading} />
        <DialogContent>
          <h1 className="companies__modalTitle">
            {modalMode === "Edit"
              ? `Editar Empresa - ${selectedCompany?.name}`
              : "Adicionar Empresa"}
          </h1>

          <h4 className="companies__modalSubtitle">
            <CorporateFareIcon />
            <span>Dados da Empresa</span>
          </h4>

          <FormRow>
            <FormField>
              <TextField
                autoComplete="off"
                className="companies__input"
                id="outlined-search"
                label="Nome da Empresa"
                type="text"
                size="small"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                fullWidth
              />
            </FormField>

            <FormField>
              <FormControl fullWidth sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="companies__statusLabel">Status</InputLabel>
                <Select
                  labelId="companies__statusLabel"
                  value={companyStatus}
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
          <div className="companies__actions">
            <Button
              onClick={() => saveCompanyData()}
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
                onClick={() => onDeleteCompany()}
                type="button"
                variant="contained"
              >
                Excluir Empresa
              </Button>
            )} */}
          </div>
        </DialogContent>
      </Dialog>

      <div className="companies__content">
        <Navigation />

        <div className="companies__bar">
          <Button
            onClick={handleAddClick}
            type="button"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Adicionar Empresa
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
                                className="companies__icon"
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

export default Companies;
