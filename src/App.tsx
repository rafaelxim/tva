import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Routes from "./Routes";
import "./sass/main.scss";
import "./App.css";

type Props = Record<string, never>;

const App: React.FC<Props> = () => {
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
    </ThemeProvider>
  );
};

export default App;
