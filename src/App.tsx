import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Routes from "./Routes";
import Snackbar from "./components/Snackbar";
import "./sass/main.scss";
import "./App.css";
import { StoreState } from "./actions/types";
import { setSnackbarAlert } from "./actions";

type Props = Record<string, never>;

const App: React.FC<Props> = () => {
  const { isVisible, message, severity } = useSelector(
    (state: StoreState) => state.feedbackReducer
  );
  const dispatch = useDispatch();

  // https://mui.com/pt/customization/typography/
  const theme = createTheme({
    typography: {
      // Tell MUI what's the font-size on the html element is.
      htmlFontSize: 10,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Routes />
      <Snackbar
        open={isVisible}
        message={message}
        severity={severity}
        handleClose={() =>
          dispatch(
            setSnackbarAlert({
              message,
              severity,
              isVisible: false,
            })
          )
        }
      />
    </ThemeProvider>
  );
};

export default App;
