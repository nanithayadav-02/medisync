import styles from "./Dashboard.module.css";
import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import { NavLink } from "react-router-dom";
import moment from "moment";
import { UserContext } from "../../Context/UserContext";

export default function AdminDashboard() {
  const [doctorCount, setDoctorCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [appsTodayCount, setAppsTodayCount] = useState(0);
  const [pendingAppsTodayCount, setPendingAppsTodayCount] = useState(0);
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const { currentUser } = useContext(UserContext);

  /* ================= USER COUNT ================= */
  const getUserCountByRole = async (userType) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/count/users",
        { userType },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const count = response?.data?.count;
      if (userType === "Doctor") setDoctorCount(count);
      if (userType === "Patient") setPatientCount(count);
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= APPOINTMENT COUNT ================= */
  const getAppointmentCount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/count/appointments",
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAppsTodayCount(response?.data?.totalAppointments || 0);
      setPendingAppsTodayCount(response?.data?.pendingAppointments || 0);
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= BOOKED APPOINTMENTS ================= */
  const getBookedSlots = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/appointments",
        {
          isTimeSlotAvailable: false,
          appDate: moment(new Date()).format("YYYY-MM-DD"),
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response?.data?.message === "success") {
        setBookedAppointments(response.data.appointments);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= GET DOCTORS ================= */
  const getDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:3001/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    getUserCountByRole("Doctor");
    getUserCountByRole("Patient");
    getAppointmentCount();
    getBookedSlots();
    getDoctors();
  }, []);

  return (
    <Box className={styles.dashboardBody} component="main" sx={{ flexGrow: 1, p: 3 }}>
      
      {/* ================= WELCOME BANNER ================= */}
      <div id={styles.welcomeBanner}>
        <div className="text-white">
          <h3>Welcome!</h3>
          <br />
          <h4>
            {currentUser?.firstName} {currentUser?.lastName}
          </h4>
          <br />
          <div className={styles.horizontalLine}></div>

          <p style={{ marginTop: "15px", lineHeight: "1.6" }}>
            At MEDISYNC, we combine compassionate healthcare with intelligent hospital
            management solutions.
            <br />
            Our secure and scalable platform empowers hospitals to deliver
            exceptional care with efficiency and trust.
          </p>
        </div>
      </div>

      {/* ================= STAT CARDS ================= */}
      <div className={styles.statCardGrid}>
        <StatCard icon="fa-stethoscope" value={doctorCount} title="Doctors" />
        <StatCard icon="fa-user-o" value={patientCount} title="Patients" />
        <StatCard icon="fa-calendar" value={appsTodayCount} title="Appointments Today" />
        <StatCard icon="fa-heartbeat" value={pendingAppsTodayCount} title="Pending Appointments" />
      </div>

      {/* ================= APPOINTMENTS + DOCTORS ================= */}
      <div className="row">
        <div className="col-12 col-lg-8 col-xl-8">
          <div className="card appointment-panel">
            <div className="card-header">
              <h4 className="card-title d-inline-block">
                Upcoming Appointments
              </h4>
              <NavLink to="/appointments" className="btn btn-primary float-end">
                View all
              </NavLink>
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <table className="table mb-0">
                  <tbody>
                    {bookedAppointments.map((apt, index) => (
                      <tr key={index}>
                        <td className={styles.appointmentTableTd}>
                          <h5>
                            {apt?.patientId?.userId?.firstName}{" "}
                            {apt?.patientId?.userId?.lastName}
                          </h5>
                        </td>
                        <td>
                          Dr. {apt?.doctorId?.userId?.firstName}{" "}
                          {apt?.doctorId?.userId?.lastName}
                        </td>
                        <td>{apt?.appointmentTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {bookedAppointments.length === 0 && (
                  <h4 className="text-center mt-4">
                    You have no appointments today
                  </h4>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= DOCTORS PANEL ================= */}
        <div className="col-12 col-lg-4 col-xl-4">
          <div className="card member-panel">
            <div className="card-header bg-white">
              <h4 className="card-title mb-0">Doctors</h4>
            </div>

            <div className="card-body">
              <ul className="contact-list">
                {doctors.map((doc, index) => (
                  <li key={index}>
                    <div className="contact-cont">
                      <div className="contact-info">
                        <span className="contact-name text-ellipsis">
                          {doc?.userId?.firstName} {doc?.userId?.lastName}
                        </span>
                        <span className="contact-date">
                          {doc?.department}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-footer text-center bg-white">
              <NavLink to="/doctors" className="text-muted">
                View all Doctors
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

/* ================= REUSABLE STAT CARD COMPONENT ================= */
function StatCard({ icon, value, title }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.dashWidget}>
        <span>
          <i className={`fa ${icon}`} aria-hidden="true"></i>
        </span>
        <div>
          <h3>{value}</h3>
          <span>{title}</span>
        </div>
      </div>
    </div>
  );
}
