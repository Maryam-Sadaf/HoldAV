"use client";
import { authorizedUser } from "@/app/server/actions/authorizedUsers";
import { getAllUsers } from "@/app/server/actions/getAllUsers";
import { getReservations } from "@/app/server/actions/getReservation";
import getReservationByCompanyName from "@/app/server/actions/getReservationByCompanyName";
import getReservationByUserId from "@/app/server/actions/getReservationsByUserId";
import { getRooms } from "@/app/server/actions/getRooms";
import getRoomsByUserId from "@/app/server/actions/getRoomsByUserId";
import getUserById from "@/app/server/actions/getUserById";
import { getUsersByCompanyId } from "@/app/server/actions/getUsersByCompanyId";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetRoomsQuery = () =>
  useQuery({
    queryKey: ["rooms"],
    queryFn: () => {},
  });

// export const useGetAuthorizedUser = (companyName: string) =>
//   useQuery({
//     queryKey: ["authorizedUsers"],
//     queryFn: () => authorizedUser({ companyName }),
//   });

// export const useGetReservationByCompanyName = (companyName: string) =>
//   useQuery({
//     queryKey: ["reservationByCompany", companyName],
//     queryFn: () => getReservationByCompanyName({ companyName }),
//   });

// export const useGetRoomsByUserId = (userId: string) =>
//   useQuery({
//     queryKey: ["roomsByUserId", userId],
//     queryFn: () => getRoomsByUserId({ userId }),
//   });

// export const useGetReservations = () =>
//   useQuery({
//     queryKey: ["reservations"],
//     queryFn: () => getReservations(),
//   });

// export const useGetUsersByCompanyId = (companyName: string) =>
//   useQuery({
//     queryKey: ["usersByCompanyId", companyName],
//     queryFn: () => getUsersByCompanyId({ companyName }),
//   });

// export const useGetReservationByUserId = (userId: string) =>
//   useQuery({
//     queryKey: ["reservationByUserId", userId],
//     queryFn: () => getReservationByUserId({ userId }),
//   });

// export const useGetUserById = (userId: string) =>
//   useQuery({
//     queryKey: ["userById", userId],
//     queryFn: () => getUserById({ userId }),
//   });

// export const useGetAllUsers = () =>
//   useQuery({
//     queryKey: ["allUsers"],
//     queryFn: () => getAllUsers(),
//   });
