import React from 'react';
 // replace with actual path or URL to logo
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

const FacultyCard = () => {
  return (
    <div style={styles.card}>
      {/* Left Section */}
      <div style={styles.leftSection}>
        <img src='/shanmugha-logo.jpg' alt="Sri Shanmugha Logo" style={styles.logo} />
        <div>
          <h2 style={styles.name}>NAGARAJAN G</h2>
          <div style={styles.idTag}>E-ID:1569</div>
          <div style={styles.designation}>Artificial Intelligence and Data Science</div>
          <div style={styles.position}><strong>Associate Professor</strong></div>
        </div>
      </div>

      {/* Right Section */}
      <div style={styles.rightSection}>
        <div style={styles.infoRow}>
          <FaEnvelope style={styles.icon} />
          <span>nagarajan@shanmugha.edu.in</span>
        </div>
        <div style={styles.infoRow}>
          <FaPhone style={styles.icon} />
          <span>8072826386</span>
        </div>
        <div style={styles.infoRow}>
          <FaMapMarkerAlt style={styles.icon} />
          <span>
            Sankari-Tiruchengode main road, Pullipalayam, Morur(Po), Sankari(Tk), Salem, India, 637304
          </span>
        </div>
        <div style={styles.infoRow}>
          <FaCheckCircle style={{ ...styles.icon, color: '#8e44ad' }} />
          <span><strong>Invitation Status:</strong> Signed Up</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
    card: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        background: '#fff',
        borderRadius: '12px',
        padding: '2rem 3rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '80%', // fixed casing from "Width"
        fontFamily: "'Segoe UI', sans-serif",
        flexWrap: 'nowrap', // full desktop view = don't wrap
        gap: '2rem', // spacing between left & right sections
        margin: '0', // no outer spacing
        overflowX:'hidden'
      },
      

        leftSection: {
          display: 'flex',
          alignItems: 'center',
          gap: '20.5rem',
          flex: 1,
          minWidth: '350px',
          margin: '0rem auto',
        },

        logo: {
          height: '100px',
          objectFit: 'contain'
        },

        name: {
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#333'
        },

        idTag: {
          background: '#f8d9e1',
          color: '#a12457',
          borderRadius: '5px',
          padding: '4px 10px',
          fontSize: '0.9rem',
          margin: '6px 0'
        },

        designation: {
          fontSize: '1rem',
          color: '#444'
        },

        position: {
          fontSize: '1rem',
          color: '#222',
          marginTop: '4px'
        },
        
        rightSection: {
          flex: 1.3,
          minWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginTop: '0.5rem'
        },

        infoRow: {
          display: 'flex',
          alignItems: 'center',
          gap: '9.75rem',
          fontSize: '1rem',
          color: '#333',
          lineHeight: '1.5'
        },

        icon: {
          color: '#007bff',
          fontSize: '1.1rem',
          minWidth: '20px',
          position:'relative',
          left:'14%'

        }
      };


export default FacultyCard;
