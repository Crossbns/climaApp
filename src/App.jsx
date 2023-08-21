import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Grid } from '@mui/material';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';

const API_WEATHER = `http://api.weatherapi.com/v1/current.json?key=${
  import.meta.env.VITE_API_KEY
}&lang=es&q=`;


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4374fa',
    },
    secondary: {
      main: '#03a9f4',
    },
    background: {
      default: '#11151f',
    },
    boxBackground: {
      main: '#2b3040',
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4374fa',
    },
    secondary: {
      main: '#03a9f4',
    },
    boxBackground: {
      main: '#e0e0e0',
    },
  },
});

export default function App() {
  const [city, setCity] = useState("");
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('dark');
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
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

  const onSubmit = async (e) => {
    e.preventDefault();
    setError({ error: false, message: "" });
    setLoading(true);

    try {
      if (!city.trim()) throw { message: "El campo ciudad es obligatorio" };

      const res = await fetch(API_WEATHER + city);
      const data = await res.json();

      if (data.error) {
        throw { message: data.error.message };
      }

      console.log(data);

      setWeather({
        city: data.location.name,
        country: data.location.country,
        temperature: data.current.temp_c,
        condition: data.current.condition.code,
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

return (
  <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
    <CssBaseline />

    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex',
        marginLeft: 'auto',
        ml: 130,
      }}
    >
      <LoadingButton onClick={toggleTheme}>
        {theme === 'dark' ? (
          <Brightness7Icon fontSize="large" />
        ) : (
          <Brightness4Icon fontSize="large" />
        )}
      </LoadingButton>
    </Box>

    <Container maxWidth="xs" sx={{ mt: 2 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Aplicación del Clima
      </Typography>
      <Box
        sx={{ display: 'grid', gap: 2 }}
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          id="city"
          label="Ciudad"
          variant="outlined"
          size="small"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={error.error}
          helperText={error.message}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          loadingIndicator="Buscando..."
        >
          Buscar
        </LoadingButton>
      </Box>

      {weather.city && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h4" component="h2" align="center">
            {weather.city}, {weather.country}
          </Typography>
          <Box
            component="img"
            alt={weather.conditionText}
            src={weather.icon}
            sx={{ display: 'block', margin: '0 auto' }}
          />
          <Typography variant="h5" component="h3" align="center">
            {weather.temperature} °C
          </Typography>
          <Grid container spacing={10}>
            <Grid item xs={4}>
              <Box
                sx={{
                  p: 1,
                  bgcolor: (theme) => theme.palette.boxBackground.main,
                  borderRadius: 2,
                  width: 150,
                  height: 75,
                }}
              >
<Typography variant="body1" component="p" align="center">
  <strong style={{ textDecoration: 'underline' }}>Condición</strong>: {weather.conditionText}
</Typography>
            </Box>
            </Grid>
            <Grid item xs={4}>
              <Box
                sx={{
                  p: 1,
                  bgcolor: (theme) => theme.palette.boxBackground.main,
                  borderRadius: 2,
                  width: 150,
                  height: 75,
                }}
              >
                <Typography variant="body1" component="p" align="center">
                  <strong style={{ textDecoration: 'underline' }}>Velocidad del viento</strong>: {weather.windSpeed} km/h
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box
                sx={{
                  p: 1,
                  bgcolor: (theme) => theme.palette.boxBackground.main,
                  borderRadius: 2,
                  width: 150,
                  height: 75,
                }}
              >
                <Typography variant="body1" component="p" align="center">
                 <strong style={{ textDecoration: 'underline' }}>Índice UV</strong>: {weather.uvIndex}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      <Typography textAlign="center" sx={{ mt: 2, fontSize: '10px' }}>
        Powered by:{' '}
        <a href="<URL>" title="<URL>">
          WeatherAPI.com
        </a>
      </Typography>
    </Container>
  </ThemeProvider>
);




}
