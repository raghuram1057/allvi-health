const [patientInfo, setPatientInfo] = useState({
    name: '', age: '', gender: '', city: '', email: ''
});

const PatientRegistration = async () => {
    const res = await axios.post(`${baseURL}/api/patient/register`, patientInfo);
    if (res.data.success) {
        // Now proceed to the Report Upload phase with the new ID
        navigate('/phase1upload', { state: { allviId: res.data.allvi_id } });
    }
};

export default PatientRegistration