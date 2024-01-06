import { formDataType } from "../../types";
import React, { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import Checkbox from "@mui/material/Checkbox";
import { MuiTelInput } from "mui-tel-input";
import eventBus from "../../utils";

interface FormTypes {
  userInputs: formDataType;
  onSubmit: (data: formDataType) => void;
  locContacts? : any,
  setFormData : any
}

const Form: React.FC<FormTypes> = ({ userInputs, locContacts, setFormData }) => {
  const [userForm, setUserForm] = useState({
    // anrede: userInputs.anrede ?? "",
    geschelcht: userInputs.geschelcht ?? "",
    vorname: userInputs.vorname ?? "",
    nachname: userInputs.nachname ?? "",
    email: userInputs.email ?? "",
    mobiltelefon: userInputs.mobiltelefon ?? "",
    adresse: userInputs.adresse ?? "",
    plz: userInputs.plz ?? "",
    stadt: userInputs.stadt ?? "",
    besondereWunsche: userInputs.besondereWunsche ?? "",
    tos: false,
  });

  const [error, setError] = useState<null | string>(null);

  const handleSelectChange = (event: SelectChangeEvent) => {
    setUserForm((oldData) => ({
      ...oldData,
      [event.target.name]: event.target.value,
    }));
  };

  const validateAndResponse = () => {
    const {
      // anrede,
      geschelcht,
      vorname,
      nachname,
      email,
      mobiltelefon,
      adresse,
      plz,
      stadt,
      tos,
    } = userForm;

    if (
      // !anrede ||
      !geschelcht ||
      !vorname ||
      !nachname ||
      !email ||
      !mobiltelefon ||
      !adresse ||
      !plz ||
      !stadt
    ) {
      setError("Bitte füllen Sie alle Felder aus.");
      return;
    }
    if (!tos) {
      setError(
        "Bitte akzeptieren Sie unsere Datenschutzbestimmungen um fortzufahren."
      );
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein");
      return;
    }

    const phoneRegex = /^[0-9]{10,}$/;

    setError(null);
    eventBus.dispatch("formData", userForm);
  };

  eventBus.on("submitBtnClicked", () => {
    validateAndResponse();
  });

  useEffect(() => {
    if (error !== null) setTimeout(() => setError(null), 5000);
  }, [error]);

  useEffect(() => {
    (window.top ?? window.parent).postMessage(
      {
        event: "FormPageVisited",
        info: "",
      },
      "*"
    );
  }, []);
``
  useEffect(()=>{
    if (userInputs?.contact){
      let contact = locContacts?.find((itm) => itm.id == userInputs?.contact)
      if (contact){
        setUserForm({
          ...userForm,
          vorname : contact.firstName,
          nachname : contact.lastName,
          email : contact.email,
          mobiltelefon : contact.phone,
          adresse : contact.address1,
          plz : contact.postalCode,
          stadt : contact.city,
        })
      }
    }
  } ,[userInputs?.contact])

  useEffect(() =>{
    if (userForm.selected_datetime){
      let prevSlots = userInputs.slot || {}
      setFormData({
        ...userInputs,
        slot : {
          ...prevSlots,
          time : `${userForm.selected_datetime}:00+01:00`,
          calendarId : userInputs?.custom_datetime_calendarId,
          room : userInputs?.custom_datetime_room,
        }
      })
    }
  }, [userForm.selected_datetime])

  return (
    <>
      <div className="flex w-full mb-3"></div>
      <div className="flex flex-col gap-3 md:flex-row w-full mb-3">
        <div className="w-full">
          <TextField
            fullWidth
            label="Vorname *"
            name="fname"
            id="fullWidth"
            type="text"
            value={userForm.vorname}
            onChange={(event) =>
              setUserForm({ ...userForm, vorname: event.target.value })
            }
          />
        </div>
        <div className="w-full">
          <TextField
            fullWidth
            label="Nachname *"
            name="lname"
            type="text"
            id="fullWidth"
            value={userForm.nachname}
            onChange={(event) =>
              setUserForm({ ...userForm, nachname: event.target.value })
            }
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 md:flex-row w-full mb-3">
        <div className="w-full">
          <TextField
            fullWidth
            label="E-Mail *"
            name="email"
            type="email"
            id="fullWidth"
            value={userForm.email}
            onChange={(event) =>
              setUserForm({ ...userForm, email: event.target.value })
            }
          />
        </div>
        <div className="w-full">
          <MuiTelInput
            value={userForm.mobiltelefon}
            onChange={(value) =>
              setUserForm({ ...userForm, mobiltelefon: value })
            }
            defaultCountry="DE"
            fullWidth
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 md:flex-row w-full mb-3">
        <TextField
          fullWidth
          label="Straße und Hausnummer *"
          name="adresse"
          multiline
          maxRows={3}
          id="fullWidth"
          type="text"
          value={userForm.adresse}
          onChange={(event) =>
            setUserForm({ ...userForm, adresse: event.target.value })
          }
          className="w-full"
        />
        <div className="w-full">
          <FormControl size="medium" fullWidth>
            <InputLabel id="geschelcht">Geschlecht</InputLabel>
            <Select
              labelId="geschelcht"
              id="geschelcht"
              value={userForm.geschelcht}
              label="Geschelcht *"
              onChange={handleSelectChange}
              name="geschelcht"
            >
              <MenuItem value="" disabled>
                <em>Auswählen</em>
              </MenuItem>
              <MenuItem value="Männlich">Männlich</MenuItem>
              <MenuItem value="Weiblich">Weiblich</MenuItem>
              <MenuItem value="Unbestimmt">Unbestimmt</MenuItem>
              <MenuItem value="Divers">Divers</MenuItem>
              <MenuItem value="Unbekannt">Unbekannt</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div className="flex flex-col gap-3 md:flex-row w-full mb-3">
        <div className="w-full">
          <TextField
            fullWidth
            label="PLZ *"
            name="zip_code"
            id="fullWidth"
            type="text"
            value={userForm.plz}
            onChange={(event) =>
              setUserForm({ ...userForm, plz: event.target.value })
            }
          />
        </div>
        <div className="w-full">
          <TextField
            fullWidth
            label="Stadt *"
            name="city"
            type="text"
            id="fullWidth"
            value={userForm.stadt}
            onChange={(event) =>
              setUserForm({ ...userForm, stadt: event.target.value })
            }
          />
        </div>
      </div>

      <div className="w-full mb-3">
        <TextField
          fullWidth
          label="Besondere Wünsche"
          name="additional_request"
          type="text"
          multiline
          maxRows={4}
          id="fullWidth"
          value={userForm.besondereWunsche}
          onChange={(event) =>
            setUserForm({ ...userForm, besondereWunsche: event.target.value })
          }
        />
      </div>
      {
        // userInputs?.customDateTime && 
        <div className="flex flex-col gap-3 md:flex-row w-full mb-3">
          <div className="w-full">
            <TextField
              fullWidth
              label="Benutzerdefiniertes Datum und Uhrzeit *"
              name="selected_datetime"
              id="fullWidth"
              type="datetime-local"
              value={userForm.selected_datetime}
              onChange={(event) =>{
                setUserForm({ ...userForm, selected_datetime: `${event.target.value}` })
              }}
            />
          </div>
        </div>
      }
      <div className="w-full mb-3 flex">
        <Checkbox
          checked={userForm.tos}
          onChange={(e) => {
            setUserForm({ ...userForm, tos: e.target.checked });
          }}
          inputProps={{ "aria-label": "controlled" }}
        />
        <p className="text-[12px] brand-font">
          Mit dem Absenden dieses Formulars erklären Sie sich einverstanden von
          uns telefonisch oder per E-Mail kontaktiert zu werden und stimmen dem
          Speichern Ihrer übermittelten Daten zu. Es gilt unsere{" "}
          <a
            href="https://www.laserzentrum-heidelberg.de/datenschutz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#06175e]"
          >
            Datenschutzerklärung
          </a>
          .
        </p>
      </div>
      {error && (
        <>
          <div className="w-full p-4 m-2 my-2 border-l-4 border-yellow-400 bg-yellow-50">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon
                  className="w-5 h-5 text-yellow-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        </>
      )}
      <p></p>
    </>
  );
};

export default Form;
