import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { Package, GetPackagesResponse } from "../Packages";
import { StoreState } from "../../actions/types";
import { hasRole } from "../../helpers/authHelper";
import PermissionDenied from "../PermissionDenied";
import FormField from "../../components/FormField";
import FormRow from "../../components/FormRow";

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

type Channel = {
  id: number;
  name: string;
  is_active: boolean;
  age_control: boolean;
  package: number[];
  logo: string;
  url: string;
  number: number;
};

type GetChannelsResponse = Channel[];

const columns: readonly Column[] = [
  { id: "id", label: "#" },
  { id: "cliente", label: "NOME" },
  {
    id: "status",
    label: "STATUS",
  },
  {
    id: "acoes",
    label: "AÇÕES",
  },
];

const Channels: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: StoreState) => state.authReducer);

  const [hasPermission, setPermission] = useState(false);
  const [rows, setRows] = useState<Channel[]>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setOpenModal] = useState(false);
  const [channelName, setChannelName] = useState<string>();
  const [channelStatus, setChannelStatus] = useState<string>("ativo");
  const [logo, setLogo] = useState<string>();
  const [url, setUrl] = useState<string>();
  const [number, setNumber] = useState<number>();
  const [ageControl, setAgeControl] = useState<string>("ativo");
  const [modalMode, setModalMode] = useState<"Edit" | "Add">("Add");
  const [selectedChannel, setSelectedChannel] = useState<Channel>();
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);

  useEffect(() => {
    const isPermitOk =
      hasRole(user!, "Administrator") ||
      hasRole(user!, "Attendant") ||
      hasRole(user!, "Operator");
    setPermission(isPermitOk);

    if (isPermitOk) {
      fetchChannels();
      fetchPackages();
    }
  }, []);

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

  const fetchChannels = async () => {
    setLoading(true);

    try {
      const { data } = await api.get<GetChannelsResponse>("/channel/");
      setRows(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getPackageNames = () => {
    return packages?.map((p) => {
      return p.name;
    });
  };

  const getPackageNamesFromId = (ids: number[]): string[] => {
    return ids.map((id) => packages.find((c) => c.id === id)!.name);
  };

  const getPackageCodes = () => {
    return selectedPackages.map((sPackage) => {
      return packages.find((c) => c.name === sPackage)?.id;
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
    setChannelStatus(event.target.value);
  };

  const resetModalState = () => {
    setChannelName("");
    setSelectedPackages([]);
    setNumber(1);
    setLogo("");
    setUrl("");
    setChannelStatus("ativo");
  };

  const saveChannelData = async () => {
    if (!channelName) {
      dispatch(
        setSnackbarAlert({
          message: "O campo nome do cliente é obrigatório!",
          isVisible: true,
          severity: "error",
        })
      );
      return;
    }

    if (selectedPackages.length === 0) {
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
      const payload = {
        name: channelName,
        is_active: channelStatus === "ativo",
        age_control: ageControl === "ativo",
        package: getPackageCodes(),
        user: user!.id,
        logo,
        url,
        number,
      };
      if (modalMode === "Add") {
        await api.post("/channel/", payload);
      } else {
        await api.patch(`/channel/${selectedChannel!.id}/`, payload);
      }

      setLoading(false);
      setOpenModal(false);
      resetModalState();
      fetchChannels();
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

  const handleEditClick = (row: Channel) => {
    setModalMode("Edit");
    setChannelName(row.name);
    setChannelStatus(row.is_active ? "ativo" : "inativo");
    setAgeControl(row.is_active ? "ativo" : "inativo");
    setNumber(row.number);
    setUrl(row.url);
    setLogo(row.logo);
    setSelectedPackages(getPackageNamesFromId(row.package));
    setOpenModal(true);
    setSelectedChannel(row);
  };

  // const onDeleteChannel = async () => {
  //   setLoading(true);
  //   try {
  //     await api.delete(`/channel/${selectedChannel?.id}/`);
  //     fetchChannels();
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

  const handleChangePackage = (
    event: SelectChangeEvent<typeof selectedPackages>
  ) => {
    const {
      target: { value },
    } = event;
    setSelectedPackages(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  if (!hasPermission) {
    return <PermissionDenied />;
  }

  return (
    <div className="channels">
      <Backdrop open={loading} />
      <Header />

      <Dialog
        fullWidth
        maxWidth="md"
        open={modalIsOpen}
        onClose={handleCloseModal}
        className="channels__modal"
      >
        <Backdrop open={loading} />
        <DialogContent>
          <h1 className="channels__modalTitle">
            {modalMode === "Edit"
              ? `Editar Canal - ${selectedChannel?.name}`
              : "Adicionar Canal"}
          </h1>

          <h4 className="channels__modalSubtitle">
            <PersonOutlineIcon />
            <span>Dados do Canal</span>
          </h4>

          <FormRow>
            <FormField>
              <TextField
                className="channels__input"
                id="outlined-search"
                label="Nome do Canal"
                type="text"
                size="small"
                value={channelName}
                autoComplete="off"
                onChange={(e) => setChannelName(e.target.value)}
                fullWidth
              />
            </FormField>

            <FormField>
              <FormControl fullWidth sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="channels__statusLabel">Status</InputLabel>
                <Select
                  labelId="channels__statusLabel"
                  value={channelStatus}
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
              <FormControl fullWidth sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="channels__statusLabel">
                  Controle de idade
                </InputLabel>
                <Select
                  labelId="channels__statusLabel"
                  value={ageControl}
                  label="Controle de idade"
                  onChange={(e) => setAgeControl(e.target.value)}
                  size="small"
                  fullWidth
                >
                  <MenuItem value="ativo">Ativo</MenuItem>
                  <MenuItem value="inativo">Inativo</MenuItem>
                </Select>
              </FormControl>
            </FormField>

            <FormField>
              <TextField
                className="channels__input"
                label="Número do Canal"
                type="number"
                size="small"
                value={number}
                autoComplete="off"
                onChange={(e) => setNumber(parseInt(e.target.value, 10))}
                fullWidth
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField>
              <TextField
                className="channels__input"
                id="outlined-search"
                label="Logo(URL)"
                type="text"
                size="small"
                value={logo}
                autoComplete="off"
                onChange={(e) => setLogo(e.target.value)}
                fullWidth
              />
            </FormField>

            <FormField>
              <TextField
                className="channels__input"
                id="outlined-search"
                label="URL do canal"
                type="text"
                size="small"
                value={url}
                autoComplete="off"
                onChange={(e) => setUrl(e.target.value)}
                fullWidth
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField>
              <FormControl size="small" fullWidth sx={{ m: 1, width: 200 }}>
                <InputLabel id="channels__empresasLabel">Pacotes</InputLabel>
                <Select
                  labelId="channels__empresasLabel"
                  multiple
                  value={selectedPackages}
                  onChange={handleChangePackage}
                  input={<OutlinedInput label="Pacotes" />}
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

          <div className="channels__actions">
            <Button
              onClick={() => saveChannelData()}
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
                onClick={() => onDeleteChannel()}
                type="button"
                variant="contained"
              >
                Excluir Canal
              </Button>
            )} */}
          </div>
        </DialogContent>
      </Dialog>

      <div className="channels__content">
        <Navigation />

        <div className="channels__bar">
          <Button
            onClick={handleAddClick}
            type="button"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Adicionar Canal
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
                                className="channels__icon"
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

export default Channels;
