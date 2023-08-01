'use client';
// React
import { useState } from "react";

// Material UI
import { Grid, Button, Modal, Typography, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// Utils
import { ApiDevices, DevicesList } from "@/utils";
import { Process } from "@/Process";
// Hooks
import { useInterval } from "usehooks-ts";

function Phones() {
  const [devices, setDevices] = useState<ApiDevices>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedDevice, setSelectedDevice] = useState<{ id: string, name: string, process: Process | null, battery: string }>({ id: "", name: "", battery: "", process: null })
  const lightTheme = createTheme({ palette: { mode: "light" } });
  const handleClose = () => {
    setIsOpen(false);
    return;
  }


  const fetchDevices = async () => {
    const result = await fetch('/api/fetchDevices');
    const data = await result.json();
    setDevices(data);
  }

  const handleSelection = (id: string) => {
    setIsOpen(true);
    const d = devices.find((device) => device.id === id);
    if (d) {
      setSelectedDevice(d);
    }
    else {
      setSelectedDevice({ id: '', name: "Device not found !", process: null, battery: "X" });
    }
  }
  useInterval(fetchDevices, 1000 * 10);

  const modalStyling = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
  };

  return (
    <ThemeProvider theme={lightTheme}>
    <Typography variant="h2" align={"center"}>Devices</Typography>
      <Box sx={{ flexGrow: 1, padding: '2rem 3rem' }}>
        <Grid container spacing={4}>
          {
            Object.entries(DevicesList).map(([key, value]: [key: string, value: string]) => {
              if (devices.find(element => element.id === key && element.name === value)) {
                return <Grid item key={key} lg={1}>
                  <Button sx={{padding: 1}} onClick={(event) => handleSelection(event.currentTarget.value)} variant="contained" value={key} color="info" key={`${value} ${key}`}>
                    {value}
                  </Button>
                </Grid>
              }
              else {
                return <Grid item key={key} lg={1} >
                  <Button sx={{padding: 1}} onClick={(event) => handleSelection(event.currentTarget.value)} value={key} variant="contained" color="error" key={`${key} ${value}`}>
                    {value}
                  </Button>
                </Grid>
              }
            })
          }
        </Grid>
        <Modal
          aria-labelledby="Phone pop-up"
          aria-describedby="Preview Phone status"
          open={isOpen}
          onClose={handleClose}>
          <Box sx={modalStyling}>
            {selectedDevice.name === "Device not found !" ? <Typography>{selectedDevice.name}</Typography> : <>
              <Typography sx={{ fontSize: 30, paddingBottom: 3 }}>{selectedDevice.name}</Typography>
              <Typography color={selectedDevice.process ? 'black' : 'red'} sx={{ fontSize: 20 }}>
                {selectedDevice.process ? selectedDevice.process.username : "No process"}
              </Typography>
              <Typography>{selectedDevice.process?.configFile}</Typography>
            </>}
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}

export default Phones;
