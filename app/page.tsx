"use client";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Container from "./components/Container";
import { useEffect, useState } from "react";
import { Alert, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import CategoryTreatmentLocation from "./components/page/CategoryTreatmentLocation";
import { formDataType, infoObject } from "./types";
import Calendar from "./components/page/Calendar";
import eventBus, { hasValue } from "./utils";
import Form from "./components/page/Form";
import Message from "./components/Message";
import Loading from "./components/page/Loading";
import "dayjs/locale/de";
import dayjs from "dayjs";
import fetchData from "./api/api";
import CalendarData, { TreatmentLocationType } from "@/app/calanderData";
import moment from "moment-timezone";
moment.locale("de");
import check from "@/app/image/check-mark.png";
import Image from "next/image";
import {
  getContacts,
} from "@/app/apRequest";


const BackButton = styled(Button)<ButtonProps>(() => ({
  color: "#ffffff",
  backgroundColor: "#dca354",
  "&:hover": {
    backgroundColor: "#dca354",
  },
}));

const SubmitButton = styled(Button)<ButtonProps>(() => ({
  color: "#ffffff",
  backgroundColor: "#06175e",
  "&:hover": {
    backgroundColor: "#06175e",
  },
}));

const initialFormData = {
  slot: null,
  category: null,
  treatment: null,
  location: null,
  calendarId: null,
  anrede: null,
  geschelcht: null,
  vorname: null,
  nachname: null,
  email: null,
  mobiltelefon: null,
  adresse: null,
  plz: null,
  stadt: null,
  besondereWunsche: null,
  patiententyp: null,
  tos: false,
};

const App = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [formData, setFormData] = useState<any>({ ...initialFormData });
  const [errorMessage, setErrorMessage] = useState(null);

  console.log(formData)

  const updateDataAndNav = (data: formDataType) => {
    setFormData((oldData: any) => ({ ...oldData, ...data }));
    if (activeStep === 0) {
      if (
        hasValue(data.category) &&
        hasValue(data.treatment) &&
        hasValue(data.location)
      ) {
        setError(false);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else setError(true);
    }
    if (activeStep === 1) {
      if (hasValue(data.slot)) {
        setError(false);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else setError(true);
    }
  };

  useEffect(() => {
    if (typeof window !== undefined) {
      eventBus.on("formData", (rData: any) => {
        const uData = { ...formData, ...rData };
        setFormData(uData);
        setErrorMessage(null);
        setReadyToSubmit(false);
        setReadyToSubmit(true);
      });
    }
  }, [formData]);

  useEffect(() => {
    if (!readyToSubmit) return;
    if (formData.tos) {
      const url = `/form`;
      setLoading(true);
      fetchData(url, { method: "PUT", body: formData })
        .then(() => {
          setSuccess(true);
          setFailed(false);
          (window.top ?? window.parent).postMessage(
            {
              event: "AppointmentBooked",
              info: {
                vorname: formData.vorname,
                nachname: formData.nachname,
                email: formData.email,
                slot: formData.slot,
              },
            },
            "*"
          );
        })
        .catch((er) => {
          setErrorMessage(er.toString());
          setReadyToSubmit(false);
          setFailed(true);
          setSuccess(false);
          (window.top ?? window.parent).postMessage(
            {
              event: "AppointmentBookedFailed",
              info: {
                vorname: formData.vorname,
                nachname: formData.nachname,
                email: formData.email,
                slot: formData.slot,
              },
            },
            "*"
          );
        })
        .finally(() => setLoading(false));
    }
  }, [readyToSubmit, formData]);

  const getAddToCalendarButtonProps = (): {
    name: string;
    options: string[];
    location: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    timeZone: string;
    availability: "busy" | "free" | undefined;
  } | null => {
    if (
      !formData.slot ||
      !formData.category ||
      !formData.treatment ||
      !formData.location ||
      !formData.timezone
    ) {
      return null;
    }
    const dateTime = dayjs(formData.slot.time);
    const props: {
      name: string;
      options: string[];
      location: string;
      startDate: string;
      endDate: string;
      startTime: string;
      endTime: string;
      timeZone: string;
      availability: "busy" | "free" | undefined;
    } = {
      name:
        "Termin für " +
        infoObject[formData.category][formData.treatment]["name"],
      options: ["Apple", "Google", "iCal", "Outlook.com", "Yahoo"],
      location:
        infoObject[formData.category][formData.treatment]["locations"][
          formData.location
        ]?.["name"],
      startDate: dateTime.format("YYYY-MM-DD"),
      endDate: dateTime.format("YYYY-MM-DD"),
      startTime: dateTime.format("HH:MM"),
      endTime: dateTime.format("HH:MM"),
      timeZone: formData.timezone,
      availability: "busy",
    };
    return props;
  };

  const back = () => {
    setActiveStep((prevActiveStep) => {
      setReadyToSubmit(false);
      if (failed) {
        setFailed(false);
        return 1;
      }
      return prevActiveStep - 1;
    });
    setErrorMessage(null);
  };
  const reset = () => {
    setActiveStep(0);
    setError(false);
    setReadyToSubmit(false);
    setLoading(false);
    setSuccess(false);
    setFailed(false);
    setFormData({ ...initialFormData });
    setErrorMessage(null);
  };

  const getLocationContacts = async () =>{
    const contact = await getContacts();
    console.log()

  }

  useEffect(()=>{
    getLocationContacts()
  } , [])
  return (
    <div className="parent-container max-w-4xl m-auto mt-10 pt-10">
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          <Step key="category">
            <StepLabel error={activeStep === 0 && error} className="brand-font">
              Behandlung & Ort
            </StepLabel>
          </Step>
          <Step key="datetime">
            <StepLabel error={activeStep === 1 && error}>
              Datum & Uhrzeit
            </StepLabel>
          </Step>
          <Step key="info">
            <StepLabel error={activeStep === 3 && error}>
              Ihre Informationen
            </StepLabel>
          </Step>
        </Stepper>
        <Container>
          {activeStep === 0 && (
            <CategoryTreatmentLocation
              onSubmit={updateDataAndNav}
              value={formData}
            />
          )}
          {activeStep === 1 && (
            <Calendar
              calendarId={formData.location}
              userInputs={formData}
              onSubmit={updateDataAndNav}
            />
          )}
          {activeStep === 2 && !success && !failed && (
            <Form userInputs={formData} onSubmit={updateDataAndNav} />
          )}
          {success && (
            <div className="pb-4">
              <div className="w-full flex items-center mb-3 align-middle mt-2 border p-2">
                <div className="sm:w-[20%] md:w-[10%]">
                  <Image src={check} alt={"check"} />
                </div>
                <div className="sm:w-[80%] md:w-[90%] pl-4">
                  <div>
                    <h2 className="sm:text-[20px] md:text-[25px] text-[#01122F] font-bold brand-font">
                      Vielen Dank! Ihr Termin ist bestätigt.
                    </h2>
                  </div>
                  <div className="">
                    <p className="text-[#001336] sm:text-[8px] md:text-[18px] brand-font">
                      Wir freuen uns darauf, Sie in unserer Praxis zu begrüßen.
                      Wenn Sie Fragen haben, zögern Sie nicht, uns zu
                      kontaktieren.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-b border-gray-200 p-4">
                {""}
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="32"
                    viewBox="0 -960 960 960"
                    width="32"
                  >
                    <path
                      fill="#dda254"
                      d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"
                    />
                  </svg>
                </div>
                <div className="desc">
                  <strong className="text-[#041B5B]">Wann:</strong>
                  <p data-time={formData?.slot?.time}>
                    {formData?.slot?.time &&
                      dayjs(formData?.slot?.time)
                        .locale("de")
                        .format("dddd, D. MMMM [um] HH:mm [Uhr]")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 border-b border-gray-200 p-4">
                <div className="icon ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="32"
                    viewBox="0 -960 960 960"
                    width="32"
                  >
                    <path
                      fill="#dda254"
                      d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"
                    />
                  </svg>
                </div>
                <div className="desc">
                  <strong className="text-[#041B5B]">Wo:</strong>
                  <p className="brand-font">
                    {CalendarData?.[formData.category]?.[
                      formData?.treatment
                    ]?.locations.find((item) => item.id === formData?.location)
                      ?.name === "Frankenthal" ? (
                      "Westliche Ringstraße 26, 67227 Frankenthal"
                    ) : (
                      <>
                        SKINCREW® im Laserzentrum Heidelberg <br />{" "}
                        Brückenkopfstr. 1/1 <br />
                        69120 Heidelberg
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 border-b border-gray-200 p-4 h-fit">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="32"
                    viewBox="0 -960 960 960"
                    width="32"
                  >
                    <path
                      fill="#dda254"
                      d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                    />
                  </svg>
                </div>
                <div className="desc">
                  <strong className="text-[#041B5B]">Was:</strong>
                  <p>
                    {
                      CalendarData?.[formData.category]?.[formData.treatment]
                        .name
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
          {!success && failed && (
            <Message>
              <Alert
                severity="warning"
                className="w-full mt-5 mb-5 font-medium text-center"
              >
                Entschuldigung, wir konnten Ihren Termin nicht bestätigen
              </Alert>
            </Message>
          )}
          {!success && (
            <Box>
              <div
                className={`flex items-center ${
                  !success && !failed && activeStep == 2
                    ? "justify-between mb-3"
                    : "justify-center"
                } mt-6 w-full px-2 pb-2`}
              >
                <div>
                  {activeStep > 0 && (
                    <BackButton
                      onClick={back}
                      // startIcon={<ArrowBackIcon />}
                      sx={{ background: "#DDA254 !important" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-[20px] h-[20px]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                      </svg>
                      Zurück
                    </BackButton>
                  )}
                </div>
                <div>
                  {!success && !failed && activeStep == 2 && (
                    <SubmitButton
                      variant="contained"
                      onClick={() =>
                        eventBus.dispatch("submitBtnClicked", null)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-[20px] h-[20px]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                      Absenden
                    </SubmitButton>
                  )}
                </div>
              </div>
            </Box>
          )}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          {loading && <Loading />}
        </Container>
      </Box>
    </div>
  );
};

export default App;
