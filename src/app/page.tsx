"use client";
// React
import { useEffect, useState } from "react";

// Material UI
import { Grid, Button, Modal, Typography, Box, Backdrop } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Socket io
import { io, Socket } from "socket.io-client";

// React Spinners
import { GridLoader } from "react-spinners";

// Utils
import { DevicesList, EmitTypes, EventTypes } from "@/utils";
// Hooks
import { useEffectOnce, useInterval } from "usehooks-ts";

// Components
import { Process, ProcessSkeleton } from "@/Process";

let socket: Socket;
function Phones() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const lightTheme = createTheme({ palette: { mode: "light" } });
  const handleClose = () => {
    setIsOpen(false);
    return;
  };

  const findProcess = () => {
    const process = processes.find(
      (p) => p.device.id === selectedProcess?.device.id
    );
    if (process)
      return (
        <>
          <Typography sx={{ fontSize: 20 }}>
            Username: {process.username}
          </Typography>
          <Typography sx={{ fontSize: 20, textTransform: "capitalize" }}>
            Status: {process.status.toLowerCase()}
          </Typography>
          <Typography sx={{ fontSize: 20 }}>
            Config: {process.configFile}
          </Typography>
        </>
      );
    else return undefined;
  };

  useEffect(() => {
    function handleSocketConnection() {
      socket = io("ws://localhost:3030", {
        autoConnect: true,
        closeOnBeforeunload: true,
      });

      socket.on<EmitTypes>(
        "get-processes-message",
        (response: ProcessSkeleton[]) => {
          const proc =
            response.length > 0
              ? response.map((_p) => {
                  return new Process(
                    _p._device,
                    _p._user.username,
                    _p._user.membership,
                    _p._status,
                    _p._result,
                    _p._total,
                    _p._following,
                    _p._followers,
                    _p._session,
                    _p._config,
                    _p._profile,
                    _p._total_crashes,
                    _p._scheduled,
                    _p._jobs,
                    _p._configFile,
                    _p._startTime
                  );
                })
              : [];
          setProcesses(proc);
          setTimeout(() => {
            setIsLoading(false);
          }, 1000 * 2);
        }
      );
    }
    handleSocketConnection();
    return () => {
      socket.disconnect();
    };
  }, []);
  // Load processes on first render
  useEffectOnce(() => {
    socket.emit<EventTypes>("get-processes");
  });

  const fetchDevices = async () => {
    socket.emit<EventTypes>("get-processes");
  };

  const handleSelection = (id: string) => {
    setIsOpen(true);
    const d = processes.find((process: Process) => process.device.id === id);
    if (d) {
      setSelectedProcess(d);
    } else {
      setSelectedProcess(null);
    }
  };
  // Fetch processes every 20 seconds
  useInterval(fetchDevices, 1000 * 20);

  const modalStyling = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
  };
  if (isLoading) {
    return (
      <Backdrop
        sx={{
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          placeContent: "center",
          flexDirection: "column",
          gap: "2rem",
          zIndex: (theme: any) => theme.zIndex.drawer + 1,
        }}
        open={isLoading}
      >
        <GridLoader color="#00bbf9" loading={isLoading} margin={6} size={30} />
        <Typography variant="h4" sx={{ paddingLeft: "2rem", color: "#fff" }}>
          Getting processes ...
        </Typography>
      </Backdrop>
    );
  }
  return (
    <ThemeProvider theme={lightTheme}>
      <Typography variant="h2" align={"center"}>
        Devices
      </Typography>
      <Box sx={{ flexGrow: 1, padding: "2rem 3rem" }}>
        <Grid container spacing={4}>
          {Object.entries(DevicesList).map(
            ([key, value]: [key: string, value: string]) => {
              if (
                processes.find(
                  (process: Process) =>
                    process.device.id === key && process.device.name === value
                )
              ) {
                return (
                  <Grid item key={key} lg={1}>
                    <Button
                      sx={{ padding: 1 }}
                      onClick={(event) =>
                        handleSelection(event.currentTarget.value)
                      }
                      variant="contained"
                      value={key}
                      color="info"
                      key={`${value} ${key}`}
                    >
                      {value}
                    </Button>
                  </Grid>
                );
              } else {
                return (
                  <Grid item key={key} lg={1}>
                    <Button
                      sx={{ padding: 1 }}
                      onClick={(event) =>
                        handleSelection(event.currentTarget.value)
                      }
                      value={key}
                      variant="contained"
                      color="error"
                      key={`${key} ${value}`}
                    >
                      {value}
                    </Button>
                  </Grid>
                );
              }
            }
          )}
        </Grid>
        <Modal
          aria-labelledby="Phone pop-up"
          aria-describedby="Preview Phone status"
          open={isOpen}
          onClose={handleClose}
        >
          <Box sx={modalStyling}>
            {selectedProcess?.device.name === "Device not found !" ? (
              <Typography>{selectedProcess?.device.name}</Typography>
            ) : (
              <>
                <Typography sx={{ fontSize: 30, paddingBottom: 3 }}>
                  {selectedProcess?.device.name}
                </Typography>
                {findProcess() ? findProcess() : "No process"}
              </>
            )}
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}

export default Phones;
