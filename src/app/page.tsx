'use client';
// React
import { useEffect, useState } from "react";

// Material UI
import { Grid, Button, Modal, Typography, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// Utils
import { DevicesList, Device, EmitTypes, EventTypes } from "@/utils";
// Hooks
import { useEffectOnce, useInterval } from "usehooks-ts";
import { io, Socket } from "socket.io-client";

let socket: Socket;
function Phones() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedDevice, setSelectedDevice] = useState<Device>(new Device("", "", "", null));
  const lightTheme = createTheme({ palette: { mode: "light" } });
  const handleClose = () => {
    setIsOpen(false);
    return;
  }

  const findProcess = () => {
    if (selectedDevice.process) return (
      <>
        <Typography sx={{fontSize: 20}}>
          Username: {selectedDevice.process.username}
        </Typography>
        <Typography sx={{fontSize: 20}}>
          Config: {selectedDevice.process.configFile}
        </Typography>
      </>
    )
    else return undefined;
  }

  useEffect(() => {
    function handleSocketConnection() {
      socket = io("ws://localhost:3030", { autoConnect: true, closeOnBeforeunload: true });

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
      });
    }
    handleSocketConnection();
    return () => {
      socket.disconnect()
    };
  }, [])
  useEffectOnce(() => {
    socket.emit<EventTypes>("get-devices");
  })



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
      setSelectedDevice(new Device("", "", "", null));
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
              {findProcess() ? findProcess() : "No process"}
            </>}
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}

export default Phones;
