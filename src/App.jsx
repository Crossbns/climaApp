import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Grid } from "@mui/material";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";

const API_WEATHER = `https://api.weatherapi.com/v1/current.json?key=${
  import.meta.env.VITE_API_KEY
}&lang=es&q=`;

//Dark Mode
const darkTheme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#fcfcfc",
    },
    secondary: {
      main: "#03a9f4",
    },
    background: {
      default: "#2f363d",
    },
    boxBackground: {
      main: "#2b3040",
    },
    border: {
      main: "#fcfcfc", // same as secondary color
    },
  },
});

//Light Mode
const lightTheme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
  palette: {
    mode: "light",
    primary: {
      main: "#2b2b2b",
    },
    secondary: {
      main: "#fcfcfc",
    },
    background: {
      default: "#edf3f5",
    },
    boxBackground: {
      main: "#e0e0e0",
    },
    border: {
      main: "#2b2b2b",
    },
  },
});

//Main Component
export default function App() {
  //States definition
  const [city, setCity] = useState("");
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("dark");

  //Function to change the theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temperature: 0,
    condition: "",
    conditionText: "",
    icon: "",
    windSpeed: 0,
    uvIndex: 0,
  });

  //Function to send form
  const onSubmit = async (e) => {
    e.preventDefault();
    setError({ error: false, message: "" });
    setLoading(true);

    try {
      if (!city.trim()) throw { message: "El campo ciudad es obligatorio" };

      //Making the request to the weather API
      const res = await fetch(API_WEATHER + city);
      const data = await res.json();

      if (data.error) {
        throw { message: data.error.message };
      }

      console.log(data);

      //Saving weather information in the state
      setWeather({
        city: data.location.name,
        country: data.location.country,
        temperature: data.current.temp_c,
        conditionText: data.current.condition.text,
        icon: data.current.condition.icon,
        windSpeed: data.current.wind_kph,
        uvIndex: data.current.uv,
      });
    } catch (error) {
      console.log(error);
      setError({ error: true, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  //Renderizing components
  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <CssBaseline />

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          ml: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
        }}
      >
        <LoadingButton onClick={toggleTheme}>
          {theme === "dark" ? (
            <Brightness7Icon fontSize="large" />
          ) : (
            <Brightness4Icon fontSize="large" />
          )}
        </LoadingButton>
      </Box>

      <Container maxWidth="xs" sx={{ mt: 2 }}>
        <Box
          sx={{ display: "grid", gap: 2 }}
          component="form"
          autoComplete="off"
          onSubmit={onSubmit}
        >
          <TextField
            id="city"
            label="City"
            variant="outlined"
            size="small"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            error={error.error}
            helperText={error.message}
            sx={{
              marginBottom: "30px",
            }}
          />
        </Box>

        {weather.city && (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="h4"
              component="h2"
              align="center"
              sx={{ mb: 2 }}
            >
              {weather.city}, {weather.country}
            </Typography>
            <Box
              component="img"
              alt={weather.conditionText}
              src={weather.icon}
              sx={{
                display: "block",
                margin: "0 auto",
                width: "100px",
                height: "100px",
                mb: 2,
              }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h5"
                component="h3"
                align="center"
                sx={{
                  fontSize: "3rem",
                  fontWeight: "bold",
                  mb: 5,
                  ml: 2.5,
                  borderBottom: `1px solid ${
                    theme === "dark"
                      ? darkTheme.palette.border.main
                      : lightTheme.palette.border.main
                  }`,
                  width: "40%",
                }}
              >
                {weather.temperature} °C
              </Typography>
            </Box>

            <Grid
              container
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    p: 1,
                    width: { xs: "100%", sm: 150 },
                    height: { xs: 100, sm: 80 },
                  }}
                >
                  <Typography variant="body2" component="p" align="center">
                    <strong style={{ textDecoration: "underline" }}>
                      Condition
                    </strong>
                    : {weather.conditionText}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    p: 1,
                    width: { xs: "100%", sm: 150 },
                    height: { xs: 100, sm: 75 },
                    marginBottom: { xs: 1, sm: "auto" },
                  }}
                >
                  <Typography
                    variant="body2"
                    component="p"
                    align="center"
                    style={{
                      borderLeft: `0.5px solid ${
                        theme === "dark"
                          ? darkTheme.palette.border.main
                          : lightTheme.palette.border.main
                      }`,
                      borderRight: `0.5px solid ${
                        theme === "dark"
                          ? darkTheme.palette.border.main
                          : lightTheme.palette.border.main
                      }`,
                    }}
                  >
                    <strong style={{ textDecoration: "underline" }}>
                      Wind Speed
                    </strong>
                    : {weather.windSpeed} km/h
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    p: 1,
                    width: { xs: "100%", sm: 150 },
                    height: { xs: 100, sm: 75 },
                  }}
                >
                  <Typography variant="body2" component="p" align="center">
                    <strong style={{ textDecoration: "underline" }}>
                      UV Index
                    </strong>
                    : {weather.uvIndex}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        <Typography
          textAlign="center"
          sx={{ mt: 2, fontSize: { xs: "8px", sm: "10px" } }}
        >
          Powered by:{" "}
          <a
            href="<URL>"
            title="<URL>"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            WeatherAPI.com
          </a>
        </Typography>
      </Container>
    </ThemeProvider>
  );
}
