'use client';
// React
import { useEffect, useState } from "react";

// Material UI
import { Grid, Button, Modal, Typography, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// Utils
import { ApiDevices, DevicesList, Device, EmitTypes, EventTypes } from "@/utils";
// Hooks
import { useInterval } from "usehooks-ts";
import { io, Socket } from "socket.io-client";

function Phones() {
  const socket: Socket = io("ws://localhost:3030/");
  const [devices, setDevices] = useState<Device[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedDevice, setSelectedDevice] = useState<{ id: string, name: string, process: { username: string, configFile: string } | null, battery: string }>({ id: "", name: "", battery: "", process: null })
  const lightTheme = createTheme({ palette: { mode: "light" } });
  const handleClose = () => {
    setIsOpen(false);
    return;
  }

  socket.on<EmitTypes>("get-devices-message", (devices: { _id: string, _name: string, _battery: string, _process: null | { username: string, configFile: string } }[]) => {
    if (devices.length > 0) {
      let temp: Device[] = [];
      devices.forEach((_device) => {
        temp.push(new Device(_device._id, _device._name, _device._battery, _device._process));
      })
      setDevices([...temp]);
      return;
    }
    setDevices([]);
    return;
  })

  useEffect(() => {
    return () => {
      socket.disconnect()
    };
  }, [socket])


  const fetchDevices = async () => {
    socket.emit<EventTypes>("get-devices");
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
  useInterval(fetchDevices, 1000 * 15);

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
                  <Button sx={{ padding: 1 }} onClick={(event) => handleSelection(event.currentTarget.value)} variant="contained" value={key} color="info" key={`${value} ${key}`}>
                    {value}
                  </Button>
                </Grid>
              }
              else {
                return <Grid item key={key} lg={1} >
                  <Button sx={{ padding: 1 }} onClick={(event) => handleSelection(event.currentTarget.value)} value={key} variant="contained" color="error" key={`${key} ${value}`}>
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
