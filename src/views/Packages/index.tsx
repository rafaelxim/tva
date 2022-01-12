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

export type Package = {
  id: number;
  name: string;
  is_active: boolean;
  company: number;
};

export type GetPackagesResponse = Package[];

const columns: readonly Column[] = [
  { id: "id", label: "#" },
  { id: "pacote", label: "PACOTE" },
  {
    id: "status",
    label: "STATUS",
  },
  {
    id: "acoes",
    label: "AÇÕES",
  },
];

const Packages: React.FC<Props> = () => {
  const dispatch = useDispatch();

  const [rows, setRows] = useState<Package[]>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setOpenModal] = useState(false);
  const [packageName, setPackageName] = useState<string>();
  const [packageStatus, setPackageStatus] = useState<string>("ativo");
  const [modalMode, setModalMode] = useState<"Edit" | "Add">("Add");
  const [selectedPackage, setSelectedPackage] = useState<Package>();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  useEffect(() => {
    fetchPackages();
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

  const fetchPackages = async () => {
    setLoading(true);

    try {
      const { data } = await api.get<GetPackagesResponse>("/package/");
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

  const getCompanyNamesFromId = (id: number): string[] => {
    // return ids.map((id) => companies.find((c) => c.id === id)!.name);
    return [companies.find((c) => c.id === id)!.name];
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
    setPackageStatus(event.target.value);
  };

  const resetModalState = () => {
    setPackageName("");
    setSelectedCompanies([]);
  };

  const savePackageData = async () => {
    if (!packageName) {
      dispatch(
        setSnackbarAlert({
          message: "O campo nome do Pacote é obrigatório!",
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
        await api.post("/package/", {
          name: packageName,
          is_active: packageStatus === "ativo",
          company: getCompanyCodes()[0],
          user: 1,
        });
      } else {
        await api.patch(`/package/${selectedPackage!.id}/`, {
          name: packageName,
          is_active: packageStatus === "ativo",
          company: getCompanyCodes()[0],
          user: 1,
        });
      }

      setLoading(false);
      setOpenModal(false);
      resetModalState();
      fetchPackages();
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

  const handleEditClick = (row: Package) => {
    setModalMode("Edit");
    setPackageName(row.name);
    setPackageStatus(row.is_active ? "ativo" : "inativo");
    setSelectedCompanies(getCompanyNamesFromId(row.company));
    setOpenModal(true);
    setSelectedPackage(row);
  };

  const onDeletePackage = async () => {
    setLoading(true);
    try {
      await api.delete(`/package/${selectedPackage?.id}/`);
      fetchPackages();
      setOpenModal(false);
      dispatch(
        setSnackbarAlert({
          message: "O Pacote foi excluído",
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
      typeof value === "string" ? value.split(",").slice(-1) : value.slice(-1)
    );
  };

  return (
    <div className="packages">
      <Backdrop open={loading} />
      <Header />

      <Dialog
        fullWidth
        maxWidth="md"
        open={modalIsOpen}
        onClose={handleCloseModal}
        className="packages__modal"
      >
        <Backdrop open={loading} />
        <DialogContent>
          <h1 className="packages__modalTitle">
            {modalMode === "Edit"
              ? `Editar Pacote - ${selectedPackage?.name}`
              : "Adicionar Pacote"}
          </h1>

          <h4 className="packages__modalSubtitle">
            <PersonOutlineIcon />
            <span>Dados do Pacote</span>
          </h4>

          <div className="packages__form">
            <div className="packages__formGroup">
              <TextField
                className="packages__input"
                id="outlined-search"
                label="Nome do Pacote"
                type="text"
                size="small"
                value={packageName}
                autoComplete="off"
                onChange={(e) => setPackageName(e.target.value)}
                fullWidth
              />
            </div>

            <div className="packages__formGroup">
              <FormControl fullWidth sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="packages__statusLabel">Status</InputLabel>
                <Select
                  labelId="packages__statusLabel"
                  value={packageStatus}
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

          <div className="packages__form">
            <div className="packages__formGroup">
              <FormControl size="small" fullWidth sx={{ m: 1, width: 200 }}>
                <InputLabel id="packages__empresasLabel">Empresa(s)</InputLabel>
                <Select
                  labelId="packages__empresasLabel"
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

          <div className="packages__actions">
            <Button
              onClick={() => savePackageData()}
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
                onClick={() => onDeletePackage()}
                type="button"
                variant="contained"
              >
                Excluir Pacote
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="packages__content">
        <Navigation />

        <div className="packages__bar">
          <Button
            onClick={handleAddClick}
            type="button"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Adicionar Pacote
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
                                className="packages__icon"
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

export default Packages;
