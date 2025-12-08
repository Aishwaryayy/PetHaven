import React,{useState} from "react";
import PageLayout from "../PageLayout/PageLayout";
import "./UserLoginPage.css";

export default function UserLoginPage() {
  const [mode,setMode]=useState("login");
  const [role,setRole]=useState("adopter");
  const [form,setForm]=useState({
    name:"",
    email:"",
    password:"",
    location:"",
    address:"",
    phone:"",
    website:""
  });

  const handleChange=(e)=>{
    setForm({...form,[e.target.name]:e.target.value});
  };

  const handleSubmit=async()=>{
    let endpoint="";
    if(mode==="register"){
      if(role==="adopter") endpoint="http://localhost:4000/users/adopterUsers/register";
      else endpoint="http://localhost:4000/users/shelterUsers/register";
    }else{
      if(role==="adopter") endpoint="http://localhost:4000/users/adopterUsers/login";
      else endpoint="http://localhost:4000/users/shelterUsers/login";
    }

    const body=
      role==="adopter"
        ? {
            name:form.name,
            email:form.email,
            password:form.password,
            role:"adopter",
            location:form.location
          }
        : {
            name:form.name,
            email:form.email,
            password:form.password,
            role:"shelter",
            address:form.address,
            phone:form.phone,
            website:form.website
          };

    try{
      //console.log(endpoint);
      const res=await fetch(endpoint,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(body)
      });
      const data=await res.json();
      if(res.ok && data.token){
        localStorage.setItem("token",data.token);
      }
      alert(data.message);
    }catch(err){
      console.error("Fetch error:",err);
      alert("Error connecting to server");
    }
  };

  return (
    <PageLayout>
      <div className="rl-container">
        <h1>{mode==="login"?"Login":"Register"}</h1>

        <div className="toggle-row">
          <button className={mode==="login"?"active":""} onClick={()=>setMode("login")}>Login</button>
          <button className={mode==="register"?"active":""} onClick={()=>setMode("register")}>Register</button>
        </div>

        <div className="toggle-row">
          <button className={role==="adopter"?"active":""} onClick={()=>setRole("adopter")}>Adopter</button>
          <button className={role==="shelter"?"active":""} onClick={()=>setRole("shelter")}>Shelter</button>
        </div>

        <input name="email" placeholder="Email" value={form.email} onChange={handleChange}/>
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange}/>

        {mode==="register"&&(
          <>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange}/>

            {role==="adopter"&&(
              <input name="location" placeholder="Location" value={form.location} onChange={handleChange}/>
            )}

            {role==="shelter"&&(
              <>
                <input name="address" placeholder="Address" value={form.address} onChange={handleChange}/>
                <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange}/>
                <input name="website" placeholder="Website" value={form.website} onChange={handleChange}/>
              </>
            )}
          </>
        )}

        <button className="submit-btn" onClick={handleSubmit}>
          {mode==="login"?"Login":"Register"}
        </button>
      </div>
    </PageLayout>
  );
}
