import React, { FC } from "react";
import Header from "./header/Header";
import LoaderComponent from "./LoaderComponent";
import useLogin from "../hooks/useLogin";
import useUserTheme from "../hooks/useTheme";
import { PaletteMode, ThemeProvider, createTheme } from "@mui/material";
import { blue, deepOrange, grey } from "@mui/material/colors";
type Props = {
  children: React.ReactNode;
};

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          // primary: amber,

          primary: {
            main: blue[400], // Main primary color for dark mode
            // You can also define 'light', 'dark', and 'contrastText' here
          },
          userChat: {
            active: "#dce1f9",
            noActive: "white",
            hover: "#434343",
          },
          message: {
            iDidntSend: "#e8e8e8",
            iSendIt: "#cfd6f7",
          },

          divider: "#add8e6",
          text: {
            primary: grey[900],
            secondary: grey[800],
          },
        }
      : {
          // palette values for dark mode

          primary: {
            main: blue[900], // Main primary color for dark mode
            // You can also define 'light', 'dark', and 'contrastText' here
          },
          divider: "#212123",
          userChat: {
            active: "#20284d",
            noActive: grey[200],
            hover: "#434343",
          },
          message: {
            iDidntSend: "#434343",

            iSendIt: "#20284d",
          },
          background: {
            default: deepOrange[900],
            paper: deepOrange[900],
          },
          text: {
            primary: "#nnnnnn",
            secondary: grey[500],
            hover: "white",
          },
        }),
  },
});
const darkModeTheme = createTheme(getDesignTokens("dark"));
const lightModeTheme = createTheme(getDesignTokens("light"));

const LayoutComponents: FC<Props> = ({ children }) => {
  const isDone = useLogin();
  const theme = useUserTheme(isDone);
  console.log(theme.done, theme.theme);

  if (isDone && theme.done) {
    return (
      <ThemeProvider
        theme={theme.theme === "light" ? lightModeTheme : darkModeTheme}
      >
        <Header done={isDone} />
        <div>{children}</div>
      </ThemeProvider>
    );
  } else return <LoaderComponent />;
};

export default LayoutComponents;
