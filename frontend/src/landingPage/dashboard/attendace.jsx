import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./attendance.css";
import attendanceService from "../../services/attendanceService";

const Attendance = () => {
  const [user, setUser] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Get user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Fetch attendance data from backend
        const response = await attendanceService.getAttendance();
        if (response.status === 'success') {
          setAttendanceData(response.data);
        }
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setError('Failed to load attendance data');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  if (loading) {
    return <div className="loading-container">Loading attendance data...</div>;
  }

  if (error) {
    return <div className="loading-container">Error: {error}</div>;
  }

  if (!user || !attendanceData) {
    return <div className="loading-container">No data available</div>;
  }

  const { overallStats, dailySchedule } = attendanceData;

  // Get today's schedule
  const todaysSchedule = dailySchedule.filter(session => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString();
  });

  // If no today's schedule, show default FN/AN structure
  const displaySchedule = todaysSchedule.length > 0 ? todaysSchedule : [
    { session: "FN", status: "PRESENT", subject: "Java", faculty: "Dr. Smith", topic: "Data Structures" },
    { session: "AN", status: "ON-DUTY", subject: "C", faculty: "Prof. Johnson", topic: "Calculus" }
  ];

  return (
    <div className="attendance-container">
      <div className="attendance-wrapper">
        {/* Header */}
        <div className="attendance-header">
          <h1 className="attendance-title">Attendance Dashboard</h1>
          <p className="attendance-subtitle">Track your FN/AN attendance and daily schedule</p>
        </div>

        {/* Profile + Overall */}
        <div className="main-grid">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar">
              {user.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
            </div>
            
            <h2 className="profile-name">{user.email?.split('@')[0]?.toUpperCase() || 'Student ID'}</h2>
            <p className="profile-email">{user.fullName || 'Student Name'}</p>
            
            <div className="profile-stats">
              <h3 className="stats-title">Overall - ACY {attendanceData.academicYear} - {attendanceData.semester} Sem</h3>
              
              {/* Main Progress Circle */}
              <div className="main-progress">
                <CircularProgressbar
                  value={overallStats.totalPercentage}
                  text={`${overallStats.totalPercentage}%`}
                  styles={buildStyles({
                    textColor: "#059669",
                    pathColor: "#059669",
                    trailColor: "#f3f4f6",
                    textSize: "16px",
                  })}
                />
              </div>
              
              {/* Sub Progress Circles */}
              <div className="sub-progress-grid">
                <div className="sub-progress-item">
                  <div className="sub-progress-circle">
                    <CircularProgressbar
                      value={overallStats.presentPercentage}
                      text={`${overallStats.presentPercentage}%`}
                      styles={buildStyles({ 
                        textColor: "#059669", 
                        pathColor: "#059669",
                        trailColor: "#f3f4f6",
                        textSize: "12px",
                      })}
                    />
                  </div>
                  <p className="sub-progress-label">Present</p>
                </div>
                
                <div className="sub-progress-item">
                  <div className="sub-progress-circle">
                    <CircularProgressbar
                      value={overallStats.onDutyPercentage}
                      text={`${overallStats.onDutyPercentage}%`}
                      styles={buildStyles({ 
                        textColor: "#d97706", 
                        pathColor: "#d97706",
                        trailColor: "#f3f4f6",
                        textSize: "12px",
                      })}
                    />
                  </div>
                  <p className="sub-progress-label">On-Duty</p>
                </div>
                
                <div className="sub-progress-item">
                  <div className="sub-progress-circle">
                    <CircularProgressbar
                      value={overallStats.absentPercentage}
                      text={`${overallStats.absentPercentage}%`}
                      styles={buildStyles({ 
                        textColor: "#dc2626", 
                        pathColor: "#dc2626",
                        trailColor: "#f3f4f6",
                        textSize: "12px",
                      })}
                    />
                  </div>
                  <p className="sub-progress-label">Absent</p>
                </div>
              </div>
            </div>
          </div>

          {/* Class Statistics */}
          <div className="subjects-grid">
            <div className="subject-card">
              <h3 className="subject-title">Class Statistics</h3>
              <div className="class-stats">
                <div className="stat-item">
                  <span className="stat-number">{attendanceData.totalClasses}</span>
                  <span className="stat-label">Total Classes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{attendanceData.presentClasses}</span>
                  <span className="stat-label">Present</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{attendanceData.onDutyClasses}</span>
                  <span className="stat-label">On-Duty</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{attendanceData.absentClasses}</span>
                  <span className="stat-label">Absent</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Day View - FN/AN */}
        <div className="day-view">
          <h2 className="day-view-title">Today's Schedule - {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}</h2>
          
          <div className="fn-an-grid">
            {displaySchedule.map((session, i) => (
              <div key={i} className="session-card">
                <div className="session-header">
                  <h3 className="session-title">{session.session === 'FN' ? 'Forenoon (FN)' : 'Afternoon (AN)'}</h3>
                  <span className={`status-badge ${
                    session.status === "PRESENT" 
                      ? "status-present" 
                      : session.status === "ON-DUTY"
                      ? "status-on-duty"
                      : "status-absent"
                  }`}>
                    {session.status}
                  </span>
                </div>
                
                {session.subject && (
                  <div className="session-details">
                    <p><span>Subject:</span> {session.subject}</p>
                    <p><span>Faculty:</span> {session.faculty}</p>
                    <p><span>Topic:</span> {session.topic}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
