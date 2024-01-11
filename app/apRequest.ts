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

  console.log('TOken Received /////////////')
  console.log(token?.expiresIn)
  console.log(expireDT.isBefore(moment.now()))
  console.log('TOken Received /////////////')
  if (expireDT.isBefore(moment.now())) {
    console.log('TOken Received /////////////')
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


// Company Agency Token 

var AgencyToken ={
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJDb21wYW55IiwiYXV0aENsYXNzSWQiOiJpRTd1NGJNcmhDcG4xVWl1Y0lqWCIsInNvdXJjZSI6IklOVEVHUkFUSU9OIiwic291cmNlSWQiOiI2NTk5NGMxNWI1ODU1NTI5Mjk3YjU5MDMtbHIyMmJ2bGgiLCJjaGFubmVsIjoiT0FVVEgiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJpRTd1NGJNcmhDcG4xVWl1Y0lqWCIsIm9hdXRoTWV0YSI6eyJzY29wZXMiOlsiY2FsZW5kYXJzLnJlYWRvbmx5IiwiYnVzaW5lc3Nlcy53cml0ZSIsImJ1c2luZXNzZXMucmVhZG9ubHkiLCJjYWxlbmRhcnMud3JpdGUiLCJjYWxlbmRhcnMvZXZlbnRzLnJlYWRvbmx5IiwiY2FsZW5kYXJzL2V2ZW50cy53cml0ZSIsImNhbGVuZGFycy9ncm91cHMucmVhZG9ubHkiLCJjYWxlbmRhcnMvZ3JvdXBzLndyaXRlIiwiY2FtcGFpZ25zLnJlYWRvbmx5IiwiY29udmVyc2F0aW9ucy5yZWFkb25seSIsImNvbnZlcnNhdGlvbnMud3JpdGUiLCJjb252ZXJzYXRpb25zL21lc3NhZ2UucmVhZG9ubHkiLCJjb252ZXJzYXRpb25zL21lc3NhZ2Uud3JpdGUiLCJjb250YWN0cy5yZWFkb25seSIsImNvbnRhY3RzLndyaXRlIiwiZm9ybXMucmVhZG9ubHkiLCJmb3Jtcy53cml0ZSIsImxpbmtzLnJlYWRvbmx5IiwibGlua3Mud3JpdGUiLCJsb2NhdGlvbnMud3JpdGUiLCJsb2NhdGlvbnMucmVhZG9ubHkiLCJsb2NhdGlvbnMvY3VzdG9tVmFsdWVzLnJlYWRvbmx5IiwibG9jYXRpb25zL2N1c3RvbUZpZWxkcy5yZWFkb25seSIsImxvY2F0aW9ucy9jdXN0b21WYWx1ZXMud3JpdGUiLCJsb2NhdGlvbnMvY3VzdG9tRmllbGRzLndyaXRlIiwibG9jYXRpb25zL3Rhc2tzLnJlYWRvbmx5IiwibG9jYXRpb25zL3Rhc2tzLndyaXRlIiwibG9jYXRpb25zL3RhZ3MucmVhZG9ubHkiLCJsb2NhdGlvbnMvdGFncy53cml0ZSIsImxvY2F0aW9ucy90ZW1wbGF0ZXMucmVhZG9ubHkiLCJ1c2Vycy5yZWFkb25seSIsInVzZXJzLndyaXRlIiwib2F1dGgud3JpdGUiLCJvYXV0aC5yZWFkb25seSIsInNuYXBzaG90cy5yZWFkb25seSIsIndvcmtmbG93cy5yZWFkb25seSIsInN1cnZleXMucmVhZG9ubHkiLCJtZWRpYXMucmVhZG9ubHkiLCJtZWRpYXMud3JpdGUiLCJvcHBvcnR1bml0aWVzLnJlYWRvbmx5Iiwib3Bwb3J0dW5pdGllcy53cml0ZSJdLCJjbGllbnQiOiI2NTk5NGMxNWI1ODU1NTI5Mjk3YjU5MDMiLCJjbGllbnRLZXkiOiI2NTk5NGMxNWI1ODU1NTI5Mjk3YjU5MDMtbHIyMmJ2bGgifSwiaWF0IjoxNzA0OTkwMTE5LjM5MiwiZXhwIjoxNzA1MDc2NTE5LjM5Mn0.ImQOZg-VWfLTj6r0yRGfCPjEq84iKRb3I6lgWENxmHk",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJDb21wYW55IiwiYXV0aENsYXNzSWQiOiJpRTd1NGJNcmhDcG4xVWl1Y0lqWCIsInNvdXJjZSI6IklOVEVHUkFUSU9OIiwic291cmNlSWQiOiI2NTk5NGMxNWI1ODU1NTI5Mjk3YjU5MDMtbHIyMmJ2bGgiLCJjaGFubmVsIjoiT0FVVEgiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJpRTd1NGJNcmhDcG4xVWl1Y0lqWCIsIm9hdXRoTWV0YSI6eyJzY29wZXMiOlsiY2FsZW5kYXJzLnJlYWRvbmx5IiwiYnVzaW5lc3Nlcy53cml0ZSIsImJ1c2luZXNzZXMucmVhZG9ubHkiLCJjYWxlbmRhcnMud3JpdGUiLCJjYWxlbmRhcnMvZXZlbnRzLnJlYWRvbmx5IiwiY2FsZW5kYXJzL2V2ZW50cy53cml0ZSIsImNhbGVuZGFycy9ncm91cHMucmVhZG9ubHkiLCJjYWxlbmRhcnMvZ3JvdXBzLndyaXRlIiwiY2FtcGFpZ25zLnJlYWRvbmx5IiwiY29udmVyc2F0aW9ucy5yZWFkb25seSIsImNvbnZlcnNhdGlvbnMud3JpdGUiLCJjb252ZXJzYXRpb25zL21lc3NhZ2UucmVhZG9ubHkiLCJjb252ZXJzYXRpb25zL21lc3NhZ2Uud3JpdGUiLCJjb250YWN0cy5yZWFkb25seSIsImNvbnRhY3RzLndyaXRlIiwiZm9ybXMucmVhZG9ubHkiLCJmb3Jtcy53cml0ZSIsImxpbmtzLnJlYWRvbmx5IiwibGlua3Mud3JpdGUiLCJsb2NhdGlvbnMud3JpdGUiLCJsb2NhdGlvbnMucmVhZG9ubHkiLCJsb2NhdGlvbnMvY3VzdG9tVmFsdWVzLnJlYWRvbmx5IiwibG9jYXRpb25zL2N1c3RvbUZpZWxkcy5yZWFkb25seSIsImxvY2F0aW9ucy9jdXN0b21WYWx1ZXMud3JpdGUiLCJsb2NhdGlvbnMvY3VzdG9tRmllbGRzLndyaXRlIiwibG9jYXRpb25zL3Rhc2tzLnJlYWRvbmx5IiwibG9jYXRpb25zL3Rhc2tzLndyaXRlIiwibG9jYXRpb25zL3RhZ3MucmVhZG9ubHkiLCJsb2NhdGlvbnMvdGFncy53cml0ZSIsImxvY2F0aW9ucy90ZW1wbGF0ZXMucmVhZG9ubHkiLCJ1c2Vycy5yZWFkb25seSIsInVzZXJzLndyaXRlIiwib2F1dGgud3JpdGUiLCJvYXV0aC5yZWFkb25seSIsInNuYXBzaG90cy5yZWFkb25seSIsIndvcmtmbG93cy5yZWFkb25seSIsInN1cnZleXMucmVhZG9ubHkiLCJtZWRpYXMucmVhZG9ubHkiLCJtZWRpYXMud3JpdGUiLCJvcHBvcnR1bml0aWVzLnJlYWRvbmx5Iiwib3Bwb3J0dW5pdGllcy53cml0ZSJdLCJjbGllbnQiOiI2NTk5NGMxNWI1ODU1NTI5Mjk3YjU5MDMiLCJjbGllbnRLZXkiOiI2NTk5NGMxNWI1ODU1NTI5Mjk3YjU5MDMtbHIyMmJ2bGgifSwiaWF0IjoxNzA0OTkwMTE5LjM5MiwiZXhwIjoxNzM2NTI2MTE5LjM5MiwidW5pcXVlSWQiOiI1MGQ1ZjdhMC01YmYyLTQ4ODYtYmQ0YS1kZGUwNWM0NGY2YjcifQ.LWVJIQz0zus9PDdefRb1hAn-6-Ufeze8fbWQ0ofq4DQ",
  "companyId": "iE7u4bMrhCpn1UiucIjX",
  "userId": "1bk3D7ACF76mmNUk8xuC"
}

// accessToken
// refreshToken
// expiresIn

var SpareToken = {
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJMb2NhdGlvbiIsImF1dGhDbGFzc0lkIjoiTGlDaFlmektDUFU1aXRyNFRGSnYiLCJzb3VyY2UiOiJJTlRFR1JBVElPTiIsInNvdXJjZUlkIjoiNjU5OTRjMTViNTg1NTUyOTI5N2I1OTAzLWxyMjJidmxoIiwiY2hhbm5lbCI6Ik9BVVRIIiwicHJpbWFyeUF1dGhDbGFzc0lkIjoiTGlDaFlmektDUFU1aXRyNFRGSnYiLCJvYXV0aE1ldGEiOnsic2NvcGVzIjpbImNhbGVuZGFycy5yZWFkb25seSIsImJ1c2luZXNzZXMud3JpdGUiLCJidXNpbmVzc2VzLnJlYWRvbmx5IiwiY2FsZW5kYXJzLndyaXRlIiwiY2FsZW5kYXJzL2V2ZW50cy5yZWFkb25seSIsImNhbGVuZGFycy9ldmVudHMud3JpdGUiLCJjYWxlbmRhcnMvZ3JvdXBzLnJlYWRvbmx5IiwiY2FsZW5kYXJzL2dyb3Vwcy53cml0ZSIsImNhbXBhaWducy5yZWFkb25seSIsImNvbnZlcnNhdGlvbnMucmVhZG9ubHkiLCJjb252ZXJzYXRpb25zLndyaXRlIiwiY29udmVyc2F0aW9ucy9tZXNzYWdlLnJlYWRvbmx5IiwiY29udmVyc2F0aW9ucy9tZXNzYWdlLndyaXRlIiwiY29udGFjdHMucmVhZG9ubHkiLCJjb250YWN0cy53cml0ZSIsImZvcm1zLnJlYWRvbmx5IiwiZm9ybXMud3JpdGUiLCJsaW5rcy5yZWFkb25seSIsImxpbmtzLndyaXRlIiwibG9jYXRpb25zLnJlYWRvbmx5IiwibG9jYXRpb25zL2N1c3RvbVZhbHVlcy5yZWFkb25seSIsImxvY2F0aW9ucy9jdXN0b21GaWVsZHMucmVhZG9ubHkiLCJsb2NhdGlvbnMvY3VzdG9tVmFsdWVzLndyaXRlIiwibG9jYXRpb25zL2N1c3RvbUZpZWxkcy53cml0ZSIsImxvY2F0aW9ucy90YXNrcy5yZWFkb25seSIsImxvY2F0aW9ucy90YXNrcy53cml0ZSIsImxvY2F0aW9ucy90YWdzLnJlYWRvbmx5IiwibG9jYXRpb25zL3RhZ3Mud3JpdGUiLCJsb2NhdGlvbnMvdGVtcGxhdGVzLnJlYWRvbmx5IiwidXNlcnMucmVhZG9ubHkiLCJ1c2Vycy53cml0ZSIsIndvcmtmbG93cy5yZWFkb25seSIsInN1cnZleXMucmVhZG9ubHkiLCJtZWRpYXMucmVhZG9ubHkiLCJtZWRpYXMud3JpdGUiLCJvcHBvcnR1bml0aWVzLnJlYWRvbmx5Iiwib3Bwb3J0dW5pdGllcy53cml0ZSJdLCJjbGllbnQiOiI2NTk5NGMxNWI1ODU1NTI5Mjk3YjU5MDMiLCJjbGllbnRLZXkiOiI2NTk5NGMxNWI1ODU1NTI5Mjk3YjU5MDMtbHIyMmJ2bGgifSwiaWF0IjoxNzA0OTkwMTcxLjA2OCwiZXhwIjoxNzA1MDc2NTcxLjA2OH0.1AkLYT8OYXgOyjh3hgwRW5QihFk30bSNdAqoWvpFw1s",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJMb2NhdGlvbiIsImF1dGhDbGFzc0lkIjoiTGlDaFlmektDUFU1aXRyNFRGSnYiLCJzb3VyY2UiOiJJTlRFR1JBVElPTiIsInNvdXJjZUlkIjoiNjU5OTRjMTViNTg1NTUyOTI5N2I1OTAzLWxyMjJidmxoIiwiY2hhbm5lbCI6Ik9BVVRIIiwicHJpbWFyeUF1dGhDbGFzc0lkIjoiTGlDaFlmektDUFU1aXRyNFRGSnYiLCJvYXV0aE1ldGEiOnsic2NvcGVzIjpbImNhbGVuZGFycy5yZWFkb25seSIsImJ1c2luZXNzZXMud3JpdGUiLCJidXNpbmVzc2VzLnJlYWRvbmx5IiwiY2FsZW5kYXJzLndyaXRlIiwiY2FsZW5kYXJzL2V2ZW50cy5yZWFkb25seSIsImNhbGVuZGFycy9ldmVudHMud3JpdGUiLCJjYWxlbmRhcnMvZ3JvdXBzLnJlYWRvbmx5IiwiY2FsZW5kYXJzL2dyb3Vwcy53cml0ZSIsImNhbXBhaWducy5yZWFkb25seSIsImNvbnZlcnNhdGlvbnMucmVhZG9ubHkiLCJjb252ZXJzYXRpb25zLndyaXRlIiwiY29udmVyc2F0aW9ucy9tZXNzYWdlLnJlYWRvbmx5IiwiY29udmVyc2F0aW9ucy9tZXNzYWdlLndyaXRlIiwiY29udGFjdHMucmVhZG9ubHkiLCJjb250YWN0cy53cml0ZSIsImZvcm1zLnJlYWRvbmx5IiwiZm9ybXMud3JpdGUiLCJsaW5rcy5yZWFkb25seSIsImxpbmtzLndyaXRlIiwibG9jYXRpb25zLnJlYWRvbmx5IiwibG9jYXRpb25zL2N1c3RvbVZhbHVlcy5yZWFkb25seSIsImxvY2F0aW9ucy9jdXN0b21GaWVsZHMucmVhZG9ubHkiLCJsb2NhdGlvbnMvY3VzdG9tVmFsdWVzLndyaXRlIiwibG9jYXRpb25zL2N1c3RvbUZpZWxkcy53cml0ZSIsImxvY2F0aW9ucy90YXNrcy5yZWFkb25seSIsImxvY2F0aW9ucy90YXNrcy53cml0ZSIsImxvY2F0aW9ucy90YWdzLnJlYWRvbmx5IiwibG9jYXRpb25zL3RhZ3Mud3JpdGUiLCJsb2NhdGlvbnMvdGVtcGxhdGVzLnJlYWRvbmx5IiwidXNlcnMucmVhZG9ubHkiLCJ1c2Vycy53cml0ZSIsIndvcmtmbG93cy5yZWFkb25seSIsInN1cnZleXMucmVhZG9ubHkiLCJtZWRpYXMucmVhZG9ubHkiLCJtZWRpYXMud3JpdGUiLCJvcHBvcnR1bml0aWVzLnJlYWRvbmx5Iiwib3Bwb3J0dW5pdGllcy53cml0ZSJdLCJjbGllbnQiOiI2NTk5NGMxNWI1ODU1NTI5Mjk3YjU5MDMiLCJjbGllbnRLZXkiOiI2NTk5NGMxNWI1ODU1NTI5Mjk3YjU5MDMtbHIyMmJ2bGgifSwiaWF0IjoxNzA0OTkwMTcxLjA2OCwiZXhwIjoxNzM2NTI2MTcxLjA2OCwidW5pcXVlSWQiOiIzN2I5MDg3Ny04MjgwLTQ2MGMtOTQwNC03OGI0NDNkNWZmZDQifQ.-YjvM4E6vXgrvSt66RnFkELzfs350ZmRNXcOJVkqF5Y",
  "userType": "Location",
  "companyId": "iE7u4bMrhCpn1UiucIjX",
  "locationId": "LiChYfzKCPU5itr4TFJv",
  "userId": "1bk3D7ACF76mmNUk8xuC",
}


const getLatestLocationToken = async () =>{
  const url = 'https://services.leadconnectorhq.com/oauth/token';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    },
    body: new URLSearchParams({
      client_id: '65994c15b5855529297b5903-lr22bvlh',
      client_secret: 'f900380a-15ec-4207-aaff-c2fdd62ce497',
      grant_type: 'refresh_token',
      refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJDb21wYW55IiwiYXV0aENsYXNzSWQiOiJpRTd1NGJNcmhDcG4xVWl1Y0lqWCIsInNvdXJjZSI6IklOVEVHUkFUSU9OIiwic291cmNlSWQiOiI2NTk5NGMxNWI1ODU1NTI5Mjk3YjU5MDMtbHIyMmJ2bGgiLCJjaGFubmVsIjoiT0FVVEgiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJpRTd1NGJNcmhDcG4xVWl1Y0lqWCIsIm9hdXRoTWV0YSI6eyJzY29wZXMiOlsiY2FsZW5kYXJzLnJlYWRvbmx5IiwiYnVzaW5lc3Nlcy53cml0ZSIsImJ1c2luZXNzZXMucmVhZG9ubHkiLCJjYWxlbmRhcnMud3JpdGUiLCJjYWxlbmRhcnMvZXZlbnRzLnJlYWRvbmx5IiwiY2FsZW5kYXJzL2V2ZW50cy53cml0ZSIsImNhbGVuZGFycy9ncm91cHMucmVhZG9ubHkiLCJjYWxlbmRhcnMvZ3JvdXBzLndyaXRlIiwiY2FtcGFpZ25zLnJlYWRvbmx5IiwiY29udmVyc2F0aW9ucy5yZWFkb25seSIsImNvbnZlcnNhdGlvbnMud3JpdGUiLCJjb252ZXJzYXRpb25zL21lc3NhZ2UucmVhZG9ubHkiLCJjb252ZXJzYXRpb25zL21lc3NhZ2Uud3JpdGUiLCJjb250YWN0cy5yZWFkb25seSIsImNvbnRhY3RzLndyaXRlIiwiZm9ybXMucmVhZG9ubHkiLCJmb3Jtcy53cml0ZSIsImxpbmtzLnJlYWRvbmx5IiwibGlua3Mud3JpdGUiLCJsb2NhdGlvbnMud3JpdGUiLCJsb2NhdGlvbnMucmVhZG9ubHkiLCJsb2NhdGlvbnMvY3VzdG9tVmFsdWVzLnJlYWRvbmx5IiwibG9jYXRpb25zL2N1c3RvbUZpZWxkcy5yZWFkb25seSIsImxvY2F0aW9ucy9jdXN0b21WYWx1ZXMud3JpdGUiLCJsb2NhdGlvbnMvY3VzdG9tRmllbGRzLndyaXRlIiwibG9jYXRpb25zL3Rhc2tzLnJlYWRvbmx5IiwibG9jYXRpb25zL3Rhc2tzLndyaXRlIiwibG9jYXRpb25zL3RhZ3MucmVhZG9ubHkiLCJsb2NhdGlvbnMvdGFncy53cml0ZSIsImxvY2F0aW9ucy90ZW1wbGF0ZXMucmVhZG9ubHkiLCJ1c2Vycy5yZWFkb25seSIsInVzZXJzLndyaXRlIiwib2F1dGgud3JpdGUiLCJvYXV0aC5yZWFkb25seSIsInNuYXBzaG90cy5yZWFkb25seSIsIndvcmtmbG93cy5yZWFkb25seSIsInN1cnZleXMucmVhZG9ubHkiLCJtZWRpYXMucmVhZG9ubHkiLCJtZWRpYXMud3JpdGUiLCJvcHBvcnR1bml0aWVzLnJlYWRvbmx5Iiwib3Bwb3J0dW5pdGllcy53cml0ZSJdLCJjbGllbnQiOiI2NTk5NGMxNWI1ODU1NTI5Mjk3YjU5MDMiLCJjbGllbnRLZXkiOiI2NTk5NGMxNWI1ODU1NTI5Mjk3YjU5MDMtbHIyMmJ2bGgifSwiaWF0IjoxNzA0NzEzNTcwLjMwNywiZXhwIjoxNzM2MjQ5NTcwLjMwNywidW5pcXVlSWQiOiIwZTIzM2RhOS04Y2FlLTQ1NzMtYThhYS1mNGVlYjE1YThjYTAifQ.86XLb-SXmSCQiO5Fva0Xi4yUHpVtc0nxmN7Y3DEQb5c',
      user_type: 'Location',
    })
  };
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

export const ghlReqV2 = async (options: {
  url: string;
  method: string;
  headers?: { [key: string]: string };
  data?: any;
  params?: { [key: string]: string | number };
}): Promise<AxiosResponse<any> | AxiosInstance> => {
  // const token = await getToken();
  const token = SpareToken

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
      console.log('error.response.data.message :: ', error.response.data.message)
      console.log(error.response.data.statusCode)
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
              let rf = await refreshToken();
              axiosConfig.headers.Authorization = "Bearer " + rf?.accessToken;
              return await axios
                .create(axiosConfig)
                .request(newOptions)
                .then((r) => {
                  return removeTraceId(r.data);
                });
            } catch (e: any) {
              throw e.response.data;
              // throw new Error(e);
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

export const getContacts = async (locid:string): Promise<any> => {
  try {
    const locationId = locid || process.env.LOCATION;
    console.log(locationId)
    const { contacts = null }: any = await ghlReqV2({
      method: "GET",
      url: `/contacts/?locationId=${locationId}`,
    });
    return contacts;
  } catch (error) {
    console.log("====================================");
    console.log("Get Contact Error", error);
    console.log("====================================");
    throw error;
  }
};

export const getBookedSlots = async (locationId:string, calendarId:string, startTime:string, endTime:string): Promise<any> => {
  try {
    const { blockedSlots = null }: any = await ghlReqV2({
      method: "GET",
      url: `/calendars/blocked-slots/?locationId=${locationId}&calendarId=${calendarId}&startTime=${startTime}&endTime=${endTime}`,
    });
    return blockedSlots;
  } catch (error) {
    console.log("====================================");
    console.log("Get Blocked Slots Error", error);
    console.log("====================================");
    throw error;
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
