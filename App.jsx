import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import React from "react";
import Split from "react-split";
import Editor from "./components/Editor";
import Sidebar from "./components/Sidebar";
import { db, notesCollection } from "./firebase";

export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    
    const currentNote =  notes.find(note => note.id === currentNoteId) || notes[0]
    const [tempNoteText, setTempNoteText] = React.useState("")
    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

    React.useEffect(() => {
        const unsuscribe = onSnapshot(notesCollection, (snapshot) => {
            // sync up our local notes array with the snapshot data from firebase
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
          setNotes(notesArr)
        })
        return unsuscribe
    }, [])

    // Set the current note to the first note in the notes array
    React.useEffect(() => {
        if (!currentNoteId && notes.length > 0) {
            setCurrentNoteId(notes[0].id)
        }
    }, [notes])

    // Set the tempNoteText to the currentNote's body
    React.useEffect(() => {
        if (currentNote) {
            setTempNoteText(currentNote.body)
        }
    }, [currentNote])


    // Debounce the updateNote function to avoid making too many requests to the database
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (tempNoteText !== currentNote.body) {
                updateNote(tempNoteText)
            }
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])

    // Create a new note and set it as the current note
    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now() 
        }
        const newNoteRef = await  addDoc(notesCollection, newNote)
        setCurrentNoteId(newNote.id)
    }

   // Update the current note's body
    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(
            docRef, 
            { body: text, updatedAt: Date.now() }, 
            { merge: true }
        )
    }

    // Delete the current note
    async function deleteNote( noteId) {
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedNotes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        
                            <Editor
                                tempNoteText={tempNoteText}
                                setTempNoteText={setTempNoteText}
                            />
                        
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}
