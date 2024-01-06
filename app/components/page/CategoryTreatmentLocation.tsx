"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import { hasValue } from "@/app/utils";
import { formDataType } from "../../types";
import CalendarData, { TreatmentLocationType } from "@/app/calanderData";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

interface CategoryTreatmentLocationProps {
  onSubmit: (data: formDataType) => void;
  value: formDataType;
  locContacts? : any
}

const ContinueButton = styled(Button)<ButtonProps>(() => ({
  color: "#ffffff",
  backgroundColor: "#01122F",
  "&:hover": {
    backgroundColor: "#01122F",
  },
}));

const CategoryTreatmentLocation: React.FC<CategoryTreatmentLocationProps> = ({
  onSubmit,
  value,
  locContacts
}) => {
  const [formData, setFormData] = useState<formDataType>({
    category: "",
    treatment: "",
    location: "",
    patiententyp: "",
    tos: false,
  });
  const [isQuery, setIsQuery] = useState<boolean>(false);

  useEffect(() => {
    setFormData((prevState) => ({ ...prevState, ...value }));
  }, [value]);

  const setFormValue = async (
    name: string,
    value: string | null | number | boolean
  ) => {
    setFormData((oldData) => ({ ...oldData, [name]: value }));

    switch (name) {
      case "category":
        setFormData((oldData) => ({
          ...oldData,
          treatment: "",
          location: "",
          patiententyp: null,
        }));
        (window.top ?? window.parent).postMessage(
          {
            event: "CategorySelected",
            info: value,
          },
          "*"
        );
        break;
      case "treatment":
        setFormData((oldData) => ({
          ...oldData,
          location: "",
          patiententyp: null,
        }));
        (window.top ?? window.parent).postMessage(
          {
            event: "TreatmentSelected",
            info: value,
          },
          "*"
        );
        break;
    }
  };

  const next = () => {
    if (formData.location !== "" && formData.patiententyp) {
      (window.top ?? window.parent).postMessage(
        {
          event: "LocationSelected",
          info: formData.location,
        },
        "*"
      );
      onSubmit(formData);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const desiredParamValue = searchParams.get("service");
    if (desiredParamValue) {
      for (const key in CalendarData) {
        CalendarData[key].forEach((service, index: number) => {
          if (
            service.name.replace(/[^a-zA-Z0-9]+/g, "-") ===
            desiredParamValue.replace(/[^a-zA-Z0-9]+/g, "-")
          ) {
            setFormValue("category", key);
            setFormValue("treatment", index);
            setIsQuery(true);
          }
        });
      }
    }
  }, []);

  return (
    <>
      {!isQuery && (
        <Box
          component="form"
          noValidate
          autoComplete="off"
          className="flex items-center flex-col justify-center"
        >
          <FormControl fullWidth>
            <InputLabel id="category-select-label">Kategorie</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              label="Kategorie"
              onChange={(e) =>
                setFormValue("category", e.target.value as string)
              }
              value={formData.category}
            >
              {Object.keys(CalendarData).map((category) => (
                <MenuItem value={category} key={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {hasValue(formData.category) && !isQuery && (
        <Box
          component="form"
          noValidate
          autoComplete="off"
          className="flex flex-col mt-5"
        >
          <FormControl fullWidth size="medium">
            <InputLabel id="treatment-select-label">Behandlung</InputLabel>
            <Select
              labelId="treatment-select-label"
              id="treatment-select"
              label="Behandlung"
              onChange={(e) =>
                setFormValue("treatment", e.target.value as string)
              }
              value={formData.treatment}
            >
              {CalendarData[formData.category as string].map(
                (treatment, key) => (
                  <MenuItem value={key} key={treatment.name}>
                    {treatment.name}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </Box>
      )}
      {formData.category && hasValue(formData.treatment) && (
        <Box
          component="form"
          noValidate
          autoComplete="off"
          className="flex flex-col mt-5"
        >
          <FormControl fullWidth size="medium">
            <InputLabel id="location-select-label">Standort</InputLabel>
            <Select
              labelId="location-select-label"
              id="location-select"
              label="Standort"
              onChange={(e) =>
                setFormValue("location", e.target.value as string)
              }
              value={formData.location}
            >
              {CalendarData[formData.category][formData.treatment as any][
                "locations"
              ].map((location: TreatmentLocationType) => (
                <MenuItem value={location.id} key={location.id}>
                  {location.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
      {hasValue(formData.location) && (
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={formData.patiententyp}
          onChange={(e) => {
            setFormValue("patiententyp", e.target.value as string);
            (window.top ?? window.parent).postMessage(
              {
                event: "PatientType",
                info: e.target.value,
              },
              "*"
            );
          }}
        >
          <FormControlLabel
            value="Neupatient"
            control={<Radio />}
            label="Neupatient"
          />
          <FormControlLabel
            value="Stammpatient"
            control={<Radio />}
            label="Stammpatient"
          />
        </RadioGroup>
      )}
      {
        hasValue(formData.location) && formData.patiententyp == 'Stammpatient' &&
        <>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            className="flex flex-col mt-5"
          >
            <FormControl fullWidth size="medium">
              <InputLabel id="Stammpatient-select-label">Stammpatient</InputLabel>
              <Select
                labelId="Stammpatient-select-label"
                id="Stammpatient-select"
                label="Stammpatient"
                onChange={(e) =>
                  setFormValue("contact", e.target.value as string)
                }
                value={formData?.contact}
              >
                {locContacts?.map((contact: TreatmentLocationType) => (
                  <MenuItem value={contact.id} key={contact.id}>
                    {contact.contactName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </>
      }
      {formData.category &&
        formData.treatment !== "" &&
        formData.location !== "" &&
        hasValue(formData.patiententyp) && (
          <div className="flex justify-center mt-7">
            <ContinueButton variant="contained" onClick={next}>
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
              Weiter
            </ContinueButton>
          </div>
        )}
    </>
  );
};

export default CategoryTreatmentLocation;
