import {useState} from 'react'
import './App.css'



function PersonalForm({ data, update, generate }) {
    return (
        <div className="form">
            <div className="entry">
                <label>Full name</label>
                <input type="text" value={data.name} placeholder={data.name}
                       onChange={(e) => update("name", e.target.value)}/>
                <label>Address</label>
                <input type="text" value={data.address} placeholder={data.address}
                       onChange={(e) => update("address", e.target.value)}/>
                <label>Phone</label>
                <input type="text" value={data.phone} placeholder={data.phone}
                       onChange={(e) => update("phone", e.target.value)}/>
                <label>Email</label>
                <input type="text" value={data.email} placeholder={data.email}
                       onChange={(e) => update("email", e.target.value)}/>
                <label>Description</label>
                <input type="text" value={data.description} placeholder={data.description}
                       onChange={(e) => update("description", e.target.value)}/>
                <button className="personalDescription" onClick={() => generate()}>Generate AI description</button>
            </div>
        </div>
    )
}

function ExperienceForm({ data, update, remove, add }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPresent, setIsPresent] = useState(false);
    const entry = data[activeIndex];

    return (
        <div className="form">
            <EntryTabs data={data} add={add} activeIndex={activeIndex} setActiveIndex={setActiveIndex}/>

            <div key={entry.id} className="entry">
                <label>Role</label>
                <input type="text" value={entry.name} placeholder={entry.name}
                       onChange={(e) => update(activeIndex, "role", e.target.value)}/>
                <label>Company</label>
                <input type="text" value={entry.company} placeholder={entry.company}
                       onChange={(e) => update(activeIndex, "company", e.target.value)}/>
                <label>Start</label>
                <input type="number" min="1980" max="2025" value={entry.start} placeholder={entry.date}
                       onChange={(e) => update(activeIndex, "start", e.target.value)}/>
                {!isPresent && (<label>End</label>)}
                {!isPresent && (<input type="number" value={entry.end} placeholder={entry.end}
                       onChange={(e) => update(activeIndex, "end", e.target.value)}/>)}
                {activeIndex !== 0 && (<button className="removeBtn" onClick={() => {remove(activeIndex); setActiveIndex(activeIndex-1);}}>Remove</button>)}
            </div>
            <label><input type="checkbox" checked={isPresent} onChange={(e) => setIsPresent(e.target.checked)}/>
                    No End
                </label>

        </div>
    )
}

function EducationForm({ data, update, remove, add }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const edx = data[activeIndex];
    return (
        <div className="form">
            <EntryTabs data={data} add={add} activeIndex={activeIndex} setActiveIndex={setActiveIndex}/>

            <div key={edx.id} className="entry">
                <label>Degree</label>
                <input type="text"
                       value={edx.degree} placeholder={edx.degree}
                       onChange={(e) => update(activeIndex, "degree", e.target.value)}/>
                <label>Institution</label>
                <input type="text"
                       value={edx.institution} placeholder={edx.institution}
                       onChange={(e) => update(activeIndex, "institution", e.target.value)}/>
                <label>Description</label>
                <input type="text"
                       value={edx.description} placeholder={edx.description}
                       onChange={(e) => update(activeIndex, "description", e.target.value)}/>
                <label>Start</label>
                <input type="number" min="1980" max="2100"
                       value={edx.start} onChange={(e) => update(activeIndex, "start", e.target.value)}/>
                <label>End</label>
                <input type="number" min="1980" max="2100"
                        value={edx.end} onChange={(e) => update(activeIndex, "end", e.target.value)}/>
                {activeIndex !== 0 && (<button className="removeBtn" onClick={() => {remove(activeIndex); setActiveIndex(activeIndex-1);}}>Remove</button>)}
            </div>
        </div>
    )
}

function EntryTabs({ data, activeIndex, setActiveIndex, add, max = 2}){
    return(
            <div className="tabsBtn">
                {data.map((obj, index) => (
                    <button key={obj.id} className={activeIndex === index ? "active" : ""}
                            onClick={() => setActiveIndex(index)}>
                        {index + 1}
                    </button>
                ))}
                <button onClick={() => {
                    if (activeIndex < max) {
                        add();
                        setActiveIndex(activeIndex + 1);
                    }
                }}>+
                </button>
            </div>
    )
}

function LanguageForm({ data, update, remove, add }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const lang = data[activeIndex];
    return (
        <div className="form">
           <EntryTabs data={data} add={add} activeIndex={activeIndex} setActiveIndex={setActiveIndex}/>

            <div key={lang.id} className="entry">
                <label>Language Name</label>
                <input type="text"
                       value={lang.name}
                       placeholder={lang.name} onChange={(e) => update(activeIndex, "name", e.target.value)}/>
                <label>Language Level</label>
                <input type="text"
                       value={lang.level}
                       placeholder={lang.level} onChange={(e) => update(activeIndex, "level", e.target.value)} />
                {activeIndex !== 0 && (<button className="removeBtn" onClick={() => {remove(activeIndex); setActiveIndex(activeIndex-1)}}>Delete</button>)}
            </div>
            <button className="addBtn" onClick={() => add()}>Add new</button>
        </div>
    )
}

function FormNav({ active, setActive }) {
    return (
        <div className="navBtn">
            <button className={active === "personal" ? "active" : ""}
                onClick={() => setActive("personal")}>Personal</button>
            <button className={active === "experience" ? "active" : ""}
                onClick={() => setActive("experience")}>Experience</button>
            <button className={active === "education" ? "active" : ""}
                onClick={() => setActive("education")}>Education</button>
            <button className={active === "language" ? "active" : ""}
                onClick={() => setActive("language")}>Language</button>
        </div>
    )
}

function PreviewContainer({ personal, experience, education, language }){
    return (
        <div className="cv">
            <div className="header">
                <img src="assets/react.svg" class="avatar"/>
                <div className="headerText">Curriculum vitae</div>
            </div>
            <div className="description">
                <p className="text">
                    {personal.description}
                </p>
            </div>
            <hr/>
            <h3 className="sectionHeader">PERSONAL DETAILS</h3>
            <div className="section">
                <p className="textLeft text">Name</p>
                <p className="textRight textStrong">{personal.name}</p>
                <p className="textLeft text">Address</p>
                <p className="textRight textStrong">{personal.address}</p>
                <p className="textLeft text">Phone number</p>
                <p className="textRight textStrong">{personal.phone}</p>
                <p className="textLeft text">Email address</p>
                <p className="textRight textStrong">{personal.email}</p>
            </div>
            <hr/>
            <h3 className="sectionHeader">WORK EXPERIENCE</h3>
                {experience.map(exp =>
                    <div className="section">
                        <p className="textLeft text">{exp.start}-{exp.end}</p>
                        <div className="textBatch">
                            <p className="textRight textStrong">{exp.role}</p>
                            <p className="textRight text">{exp.company}</p>
                            <p className="textRight text">{exp.description}</p>
                            <p className="textRight text">{exp.skills}</p>
                        </div>
                    </div>
                )}
            <hr/>
            <h3 className="sectionHeader">EDUCATION</h3>
                {education.map(e =>
                    <div className="section">
                        <p className="textLeft text">{e.start}-{e.end}</p>
                        <div className="textBatch">
                            <p className="textRight textStrong">{e.degree}</p>
                            <p className="textRight text">{e.institution}</p>
                            <p className="textRight text">{e.description}</p>
                        </div></div>
                )}
        </div>
    )
}



function App() {
    const [activeState, setActiveState] = useState("personal");

    const [personal, setPersonal] = useState({
        id: crypto.randomUUID(),
        name: "John Smith",
        address: "Horizon Street",
        phone: "+0132412321",
        email: "",
        description: ""
    });

    const [experience, setExperience] = useState([{
        id: crypto.randomUUID(),
        role: "",
        company: "",
        start: "",
        end: "",
        description: "",
        skills: []
    }]);

    const [education, setEducation] = useState([{
        id: crypto.randomUUID(),
        degree: "",
        institution: "",
        description: "",
        start: "",
        end: ""
    }])

    const [language, setLanguage] = useState([{
        id: crypto.randomUUID(),
        name: "",
        level: ""
    }])

    function updatePersonal(field, value) {
        setPersonal(prev => ({ ...prev, [field]: value }))
    }
    function updateExperience(index, field, value) {
        setExperience(prev => prev.map((exp, i) => i === index ? {...exp, [field]: value} : exp))
    }
    function updateEducation(index, field, value) {
        setEducation(prev => prev.map((edu, i) => i === index ? {...edu, [field]: value} : edu))
    }
    function updateLanguage(index, field, value) {
        setLanguage(prev => prev.map((lang, i) => i === index ? {...lang, [field]: value} : lang))
    }

    function removeExperience(index){
        setExperience(prev => prev.filter((_, i) => i !== index));
    }
    function removeEducation(index){
        setEducation(prev => prev.filter((_, i) => i !== index));
    }
    function removeLanguage(index){
        setLanguage(prev => prev.filter((_, i) => i !== index));
    }

    function addExperience() {
        setExperience(prev => [
            ...prev,
                {id:crypto.randomUUID(), role:"", company:"", start:"", end:"", description:"", skills:[]}
        ]);
    }
    function addEducation() {
        setEducation(prev => [
            ...prev,
            {id:crypto.randomUUID(), degree: "", institution: "", description: "", start: "", end: ""}
        ]);
    }
    function addLanguage() {
        setLanguage(prev => [
            ...prev, {id:crypto.randomUUID(), name:"", level:""}
        ]);
    }

    return (
        <div className="content">
            <div className="formArea left">
                <FormNav active={activeState} setActive={setActiveState}/>
                {activeState === "personal" && <PersonalForm data={personal} update={updatePersonal}/>}
                {activeState === "experience" && <ExperienceForm data={experience} update={updateExperience} remove={removeExperience} add={addExperience}/>}
                {activeState === "education" && <EducationForm data={education} update={updateEducation} remove={removeEducation} add={addEducation}/>}
                {activeState === "language" && <LanguageForm data={language} update={updateLanguage} remove={removeLanguage} add={addLanguage}/>}
            </div>
            <div className="right">
                <PreviewContainer personal={personal} experience={experience} education={education} language={language}/>
            </div>
        </div>
    )
}

export default App
