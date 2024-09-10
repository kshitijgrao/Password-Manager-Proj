import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { collection, addDoc, getDocs, query, where, doc, deleteDoc, updateDoc } from "firebase/firestore";
import "./App.css";
import { app, db } from "./firebase";
import Button from '@mui/material/Button';

export default function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showForm, setShowForm] = useState(false); // State to manage form visibility
    const [website, setWebsite] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [submittedData, setSubmittedData] = useState([]); // State to hold multiple submissions
    const [editIndex, setEditIndex] = useState(null); // State to manage editing

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(app), async (user) => {
            if (!user) {
                navigate("/login");
            } else {
                setUser(user);
                // Fetch data from Firestore
                try {
                    const q = query(collection(db, "passwords"), where("uid", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                    console.log("Fetched data:", data); // Debugging log
                    setSubmittedData(data);
                } catch (error) {
                    console.error("Error fetching data:", error); // Debugging log
                }
            }
        });

        return () => {
            unsubscribe();
        };
    }, [navigate]);

    function handleClick() {
        const auth = getAuth(app);
        auth.signOut();
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const newData = { website, username, password, uid: user.uid };
        try {
            if (editIndex !== null) {
                // Update existing entry
                const docRef = doc(db, "passwords", submittedData[editIndex].id);
                await updateDoc(docRef, newData);
                const updatedData = [...submittedData];
                updatedData[editIndex] = { ...newData, id: submittedData[editIndex].id };
                setSubmittedData(updatedData);
                setEditIndex(null);
            } else {
                // Add new entry
                const docRef = await addDoc(collection(db, "passwords"), newData);
                console.log("Data added:", newData); // Debugging log
                setSubmittedData([...submittedData, { ...newData, id: docRef.id }]);
            }
            setShowForm(false); // Hide form after submission
            setWebsite(''); // Clear form fields
            setUsername('');
            setPassword('');
        } catch (error) {
            console.error("Error adding/updating document:", error); // Debugging log
        }
    }

    function handleEdit(index) {
        const data = submittedData[index];
        setWebsite(data.website);
        setUsername(data.username);
        setPassword(data.password);
        setEditIndex(index);
        setShowForm(true);
    }

    async function handleDelete(index) {
        try {
            const docRef = doc(db, "passwords", submittedData[index].id);
            await deleteDoc(docRef);
            const updatedData = submittedData.filter((_, i) => i !== index);
            setSubmittedData(updatedData);
        } catch (error) {
            console.error("Error deleting document:", error); // Debugging log
        }
    }

    function createPass() {
        return (
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">{editIndex !== null ? "Update" : "Submit"}</button>
            </form>
        );
    }

    function createBox(data, index) {
        return (
            <div key={index} className="box">
                <p>Website: {data.website}</p>
                <p>Username: {data.username}</p>
                <p>Password: {data.password}</p>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
            </div>
        );
    }

    return (
        <div className="buttons">
            <button onClick={handleClick} className="action">Sign out</button>
            <Button onClick={() => setShowForm(true)} variant="contained" className="action">Add Password</Button>
            {showForm && createPass()} {/* Conditionally render the form */}
            {submittedData.map((data, index) => createBox(data, index))} {/* Render a box for each submission */}
        </div>
    );
}