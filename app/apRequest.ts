import axios, { AxiosInstance, AxiosResponse } from "axios";
import moment from "moment-timezone";
import qs from "qs";
import db from "@/app/db";
let CustomFields: any[] = [];

const getToken = async () => {
  return await db.oAuth.findUnique({
    where: {
      location: process.env.LOCATION as string,
    },
    select: {
      accessToken: true,
      refreshToken: true,
      expiresIn: true,
    },
  });
};

function removeTraceId(data: any): any {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      data[i] = removeTraceId(data[i]); // Recursively remove traceId
    }
  } else if (typeof data === "object" && data !== null) {
    if (Object.prototype.hasOwnProperty.call(data, "traceId")) {
      delete data.traceId; // Remove the traceId property
    }
    for (const key in data) {
      data[key] = removeTraceId(data[key]);
    }
  }
  return data;
}

async function refreshToken() {
  const token = await getToken();
  const expireDT = moment(token?.expiresIn);
  if (expireDT.isBefore(moment.now())) {
    const payload = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: token?.refreshToken,
    };
    const qu = qs.stringify(payload);
    return await axios({
      method: "post",
      url: "https://api.msgsndr.com/oauth/token?" + qu,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: payload,
    })
      .then(async (res) => {
        const data = res.data;
        const token = {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresIn: moment().add(data.expires_in, "seconds").toISOString(),
        };
        try {
          const dbdata = {
            location: process.env.LOCATION as string,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: moment()
              .add(data.expires_in, "seconds")
              .toISOString() as string,
          };
          await db.oAuth.update({
            where: {
              location: process.env.LOCATION as string,
            },
            data: dbdata,
          });
          return token;
        } catch (error) {
          console.log("====================================");
          console.log("DB Error", error);
          console.log("====================================");
          return null;
        }
      })
      .catch((er) => {
        console.log("Error refresh token: ", er.response.data);
        return null;
      });
  }
}

export const ghlReqV2 = async (options: {
  url: string;
  method: string;
  headers?: { [key: string]: string };
  data?: any;
  params?: { [key: string]: string | number };
}): Promise<AxiosResponse<any> | AxiosInstance> => {
  const token = await getToken();
  let axiosConfig: any = {
    baseURL: "https://services.leadconnectorhq.com",
    headers: {
      Authorization: "Bearer " + token?.accessToken,
      "Content-Type": "application/json",
      "Accept-Encoding": "application/json",
      Accept: "application/json",
      Version: "2021-04-15",
    },
    // params: { locationId: "" },
  };
  if (options.params) {
    axiosConfig.params = options.params;
  }
  const v2 = axios.create(axiosConfig);
  let newOptions = options;

  if (newOptions.data) {
    const newData = { ...options.data };
    const rConfig = { data: newData };
    newOptions = { ...options, ...rConfig };
  }
  return v2
    .request(newOptions)
    .then((r) => {
      return removeTraceId(r.data);
    })
    .catch(async (error) => {
      if (error.response) {
        if (
          error.response.data &&
          error.response.data.statusCode &&
          error.response.data.statusCode == 401
        ) {
          if (
            error.response.data.error == "Unauthorized" &&
            error.response.data.message.indexOf("token") > -1
          ) {
            try {
              console.log("Refreshing token");
              const rf = await refreshToken();
              axiosConfig.headers.Authorization = "Bearer " + rf?.accessToken;
              return await axios
                .create(axiosConfig)
                .request(newOptions)
                .then((r) => {
                  return removeTraceId(r.data);
                });
            } catch (e: any) {
              throw new Error(e);
            }
          }
        }
      }
      console.log("====================================");
      console.log("Request Error", error.response.data);
      console.log("====================================");
      throw error.response.data;
    });
};
export interface SlotType {
  [key: string]: {
    slots: string[];
  };
}
export const getSlots = async (data: {
  calendarId: string;
  endDate?: number | null;
  startDate?: number | null;
}): Promise<{
  [key: string]: {
    slots: string[];
  };
} | null> => {
  const now = moment();
  let startDate =
    data.startDate && data.startDate > 0 ? data.startDate : now.valueOf();
  let endDate =
    data.endDate && data.endDate > 0
      ? data.endDate
      : now.clone().add(30, "days").valueOf();

  try {
    const slots: any = await ghlReqV2({
      url: `/calendars/${data.calendarId}/free-slots`,
      method: "GET",
      params: {
        endDate: endDate,
        startDate: startDate,
      },
    });
    if (slots) {
      return slots;
    }
    return null;
  } catch (error: any) {
    console.log("====================================");
    console.log("Error", error);
    console.log("====================================");
    return null;
  }
};

export const upsertContact = async (data: any): Promise<any> => {
  try {
    const locationId = process.env.LOCATION;
    const { contact = null }: any = await ghlReqV2({
      method: "POST",
      url: "/contacts/upsert/",
      data: { ...data, locationId },
    });
    return contact;
  } catch (error) {
    console.log("====================================");
    console.log("Contact Error", error);
    console.log("====================================");
    return null;
  }
};

export const getContacts = async (): Promise<any> => {
  try {
    const locationId = process.env.LOCATION;
    const { contact = null }: any = await ghlReqV2({
      method: "GET",
      url: `/contacts/?locationId=${locationId}`,
    });
    return contact;
  } catch (error) {
    console.log("====================================");
    console.log("Contact Error", error);
    console.log("====================================");
    return null;
  }
};

export const bookAppointment = async (payload: {
  calendarId: string;
  contactId: string;
  startTime: string;
  endTime?: string;
  title?: string;
}): Promise<AppointmentType | null> => {
  const locationId = process.env.LOCATION;
  const reqPayload = {
    ...payload,
    locationId,
  };
  const request: AppointmentType | null = await ghlReqV2({
    url: "/calendars/events/appointments",
    method: "POST",
    data: reqPayload,
  })
    .then((res) => {
      return res as unknown as AppointmentType;
    })
    .catch((error) => {
      console.log("====================================");
      console.log("apRequest: Appointment Create Error", error);
      console.log("====================================");
      throw error.message;
    });
  return request ?? null;
};

export const createNote = async (contactId: string, note: string) => {
  return await ghlReqV2({
    url: `/contacts/${contactId}/notes`,
    method: "POST",
    data: { body: note },
  });
};

export const addTags = async (contactId: string, tags: string[]) => {
  return await ghlReqV2({
    url: `/contacts/${contactId}/tags`,
    method: "POST",
    data: { tags },
  });
};

export const removeTags = async (contactId: string, tags: string[]) => {
  return await ghlReqV2({
    url: `/contacts/${contactId}/tags`,
    method: "DELETE",
    data: { tags },
  });
};

export const getCustomFieldByName = async (name: string) => {};

export const getCustomFields = async (name: string | null = null) => {
  if (Object.keys(CustomFields).length > 0) {
    if (name) {
      for (const field of CustomFields) {
        if (
          field.name.toString().toLowerCase().trim() ==
            name.toString().toLowerCase().trim() ||
          field.id == name
        ) {
          return field;
        }
      }
      return null;
    } else {
      return CustomFields;
    }
  }
  const locationId = process.env.LOCATION;
  const cf: any = await ghlReqV2({
    url: `locations/${locationId}/customFields`,
    method: "GET",
  });
  if (cf && cf.customFields) {
    CustomFields = cf.customFields;
    if (name) {
      for (const field of CustomFields) {
        if (
          field.name.toString().toLowerCase().trim() ==
            name.toString().toLowerCase().trim() ||
          field.id == name
        ) {
          return field;
        }
      }
      return null;
    } else {
      return CustomFields;
    }
  }
  return null;
};

export const createBlock = async (params: {
  title: string;
  startTime: string;
  endTime: string;
  calendarId: string;
}) => {
  return await ghlReqV2({
    url: `calendars/events/block-slots`,
    method: "POST",
    data: {
      locationId: process.env.LOCATION,
      ...params,
    },
  });
};

export const deleteBlock = async (id: string) => {
  return await ghlReqV2({
    url: `calendars/events/${id}`,
    method: "DELETE",
  });
};

interface AppointmentType {
  calendarId: string;
  locationId: string;
  contactId: string;
  startTime: string;
  endTime: string;
  title: string;
  appointmentStatus: string;
  assignedUserId: string;
  address: string;
  id: string;
}
