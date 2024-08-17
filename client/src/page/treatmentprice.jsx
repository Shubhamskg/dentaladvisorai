import React, { useCallback, useEffect,useLayoutEffect, useReducer, useRef, useState } from "react";
import { Reload, Rocket, Stop, Tick } from "../assets";
import { Ads,Chat, New } from "../components";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { setLoading } from "../redux/loading";
import { useDispatch, useSelector } from "react-redux";
import { addList, emptyAllRes, insertNew, livePrompt } from "../redux/messages";
import { emptyUser } from "../redux/user";
import instance from "../config/instance";
import "./treatment.scss";
import {Menu} from "../components";
import { categoryName } from "../lib/data"
import axios from "axios";
import { DensityChart } from "../components/charts/DensityChart";





const reducer = (state, { type, status }) => {
  switch (type) {
    case "chat":
      return {
        chat: status,
        loading: status,
        resume: status,
        actionBtns: false,
      };
    case "error":
      return {
        chat: true,
        error: status,
        resume: state.resume,
        loading: state.loading,
        actionBtns: state.actionBtns,
      };
    case "resume":
      return {
        chat: true,
        resume: status,
        loading: status,
        actionBtns: true,
      };
    default:
      return state;
  }
};

const Treatmentprice = () => {
  const { loading, user } = useSelector((state) => state);
  const changeColorMode = (to) => {
    if (to) {
      localStorage.setItem("darkMode", true);

      document.body.className = "dark";
    } else {
      localStorage.removeItem("darkMode");

      document.body.className = "light";
    }
  };

  // Dark & Light Mode
  useLayoutEffect(() => {
    let mode = localStorage.getItem("darkMode");

    if (mode) {
      changeColorMode(true);
    } else {
      changeColorMode(false);
    }
  });

  let location = useLocation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const chatRef = useRef();


  const { id = null } = useParams();

  const [status, stateAction] = useReducer(reducer, {
    chat: false,
    error: false,
    actionBtns: false,
  });

  useEffect(() => {
    if (user) {
      dispatch(emptyAllRes());
      setTimeout(() => {
        if (id) {
          const getSaved = async () => {
            let res = null;
            try {
              res = await instance.get("/api/chat/saved", {
                params: {
                  chatId: id,
                },
              });
            } catch (err) {
              if (err?.response?.data?.status === 404) {
                navigate("/404");
              } else {
                alert(err);
                dispatch(setLoading(false));
              }
            } finally {
              if (res?.data) {
                dispatch(addList({ _id: id, items: res?.data?.data }));
                stateAction({ type: "resume", status: false });
                dispatch(setLoading(false));
              }
            }
          };

          getSaved();
        } else {
          stateAction({ type: "chat", status: false });
          dispatch(setLoading(false));
        }
      }, 1000);
    }
  }, [location]);
  const [option,setOption]=useState("general")
  const genRef = useRef(null)
  const noteRef = useRef(null)
  const letRef = useRef(null)
  const filterRef=useRef(null)
  const path=useLocation().pathname



  const [mini,setMini]=useState(0)
  const [maxi,setMaxi]=useState(0)
  const [avg,setAvg]=useState(0)
  const [postcode,setPostcode]=useState("")
  const [distance,setDistance]=useState("")
  const [category,setCategory]=useState("")
  const [searchdata,setSearchdata]=useState("")
  const [Data,setData]=useState([])
  const [show,setShow]=useState(false)
  const [fdata,setFdata]=useState({distance:0})
  const [latlong,setLatlong]=useState([51.5074,-0.1278])
  const [clinicsdata,setClinicsdata]=useState([])
  const [config,setConfig]=useState({size:5,sortby:0,sortin:0})

  const handlesearchevent=async()=>{
    let res=null;
    try{
      res=await axios.get("https://data.dentaladvisor.ai/api/data/search",{
        params:{
          searchdata:searchdata
        }
      })
      console.log(res.data)
      let clinicsdatas=[]
      let datas=[]
      let mini=1e9;
      let maxi=0;
      for(let i=0;i<res?.data?.length;i++){
        for(let j=0;j<Math.min(res?.data?.[i]?.data?.length,10);j++){
          const data=res.data[i].data[j]
          datas.push(data.Price)
          mini=Math.min(mini,data.Price)
          maxi=Math.max(maxi,data.Price)
        clinicsdatas.push({
          price:data.Price,
          clinicName:data.clinicName,
          treatment:data.treatment,
          website:data.Website,
          postcode:data.Postcode,
        })
      }
      }
      setMaxi(maxi)
      setMini(mini)
      setShow(true)
      setData(datas)
      setClinicsdata(clinicsdatas)
    }catch(err){
      console.log(err)
    }
  }
  const handleSubmit = async () => {
    let res = null;
    try {
      res = await axios.get("https://data.dentaladvisor.ai/api/data", {
        params: {
          categoryName: category,
          postcode:postcode.replaceAll(' ','').toUpperCase(),
          distance:distance
        },
      });
      console.log("res",res)
    } catch (err) {
      if (err?.response?.data?.status === 404) {
        alert("404")
      } else {
        alert(err)
        console.log("err",err)
      }
    } finally {
      if (res?.data) {
        let datas=[]
        let clinicsdatas=[]
        setFdata({category,distance,postcode})
        setCategory("")
        setPostcode("")
        setDistance("")
        setMini(res.data.mini!=1000000?res.data.mini:0)
        setMaxi(res.data.maxi)
        setAvg(Math.round(res.data.sum/(res?.data?.clinicsdata?.length!=0?res?.data?.clinicsdata?.length:1)))
        for(let i=0;i<res?.data?.clinicsdata?.length;i++){
          datas.push(res?.data?.clinicsdata?.[i]?.price)
          clinicsdatas.push({
            price:res.data.clinicsdata[i].price,
            clinicName:res.data.clinicsdata[i].clinicName,
            treatment:res.data.clinicsdata[i].treatment,
            website:res.data.clinicsdata[i].website,
            postcode:res.data.clinicsdata[i].postcode,
            dist:res.data.clinicsdata[i].dist,
            ogdata:res.data.clinicsdata[i].ogdata
          })
        }
        setData(datas)
        console.log("data",clinicsdatas)
        setShow(true)
        setLatlong([res.data.lat1,res.data.long1])
        setClinicsdata(clinicsdatas)
      }
    }
} 



  return (
    <>
    {user && (
        <div>
          {/* <Menu changeColorMode={changeColorMode} /> */}
        </div>
      )}
    <div className="main">
      <div className="navbar">
        <button className="option_button" ref={genRef} onClick={()=>{setOption("general");if(path!='/')navigate("/"); genRef.current.classList.add("active"), noteRef.current.classList.remove("active"), letRef.current.classList.remove("active")}}>Dental GPT</button>
        <button className="option_button" ref={noteRef} onClick={()=>{setOption("notes");if(path!='/')navigate("/");  noteRef.current.classList.add("active"),genRef.current.classList.remove("active"), letRef.current.classList.remove("active")}}>Clinical Notes</button>
        <button className="option_button" ref={letRef} onClick={()=>{setOption("letters");if(path!='/')navigate("/"); letRef.current.classList.add("active"),noteRef.current.classList.remove("active"), genRef.current.classList.remove("active")}}>Patient Letters</button>
        <button className="option_button active"  onClick={()=>{setOption("price"); navigate("/treatmentprice")}}>Treatment Price</button>
        <button className="option_button"  onClick={()=>{navigate("/patient")}}>Patient Portal</button>

      </div>
      </div>
      
      <div className="contentsArea">
        <div className="cover"></div>
    <div className="homePage">
          <div className="searchBar">
            <input className="search" onChange={(e)=>{setSearchdata(e.target.value)}}  onKeyDown={(evt)=>{
               var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
               if(keyCode==13){
                handlesearchevent()
               }
               }} placeholder="Search Treatment Category Name"/>
            <div ref={filterRef} className="filter">
        <input list="categoryName"  onChange={(e)=>{setCategory(e.target.value)}} value={category} type="text" name="categoryName" placeholder="Please Select Treatment Category" />
        <datalist id="categoryName">
    {categoryName.map((category)=>(
      <option key={category} value={category}/>
    ))}
  </datalist>
        <input list="postcode" onChange={(e)=>{setPostcode(e.target.value)}} value={postcode} type="text" name="postcode" placeholder="Postal Code" />
        <input onChange={(e)=>{setDistance(e.target.value)}} value={distance}
          type="number"
          name="distance"
          placeholder="Distance (miles)"
        />
        <div className="action">
        <button className="clear" onClick={()=>{
          setDistance("")
          setCategory("")
          setPostcode("")
          filterRef.current.classList.remove("click")
        }}>
          Clear
        </button>
        <button className="apply" onClick={()=>{handleSubmit();filterRef.current.classList.remove("click")}}>
          Apply
        </button>
        </div>
        </div>
        <button className="filter_button"  onClick={()=>{
          filterRef.current.classList.add("click")
        }}>
          Filter
        </button>
      </div>
    <br></br>
    <br></br>
    {show?
   
          <h2>Price Distribution of <i>{fdata?.category?.toUpperCase()}</i> in range of <i>{fdata.distance}</i> miles from <i>{fdata?.postcode?.toUpperCase()}</i></h2>
          :""}
          {show?<div className="chart"><DensityChart data={Data} width={850} height={400} mini={mini} maxi={maxi} /></div>:""}
          {show?<div className="boxes">
            <div className="box">
              <h1>£{mini}</h1>
              <h2>Minimum</h2>
            </div>
            <br></br>
            <div className="box">
              <h1>£{avg}</h1>
              <h2>Average</h2>
            </div>
            <br></br>
            <div className="box">
              <h1>£{maxi}</h1>
              <h2>Maximum</h2>
            </div>
          </div>:""}
        
    </div>
    {show && 
    <div className="clinic">
      <div className="titl">
      <h1>Clinic Data for Treatment Category :   {fdata.category}</h1>
      </div>
      <div className="change">
      <div className="box">
      <label className="label" htmlFor="cars">No of data</label>
<select onChange={(e)=>{
  setConfig({...config,size:e.target.value})
}} className="input" name="cars" id="cars">
  <option value="5">5</option>
  <option value="10">10</option>
  <option value="15">15</option>
  <option value="20">20</option>
</select>
</div>
<div className="boxs">
<div className="box2">
<div className="form-check">
  <input onChange={(e)=>{
  setConfig({...config,sortby:0})
}}  className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked={config.sortby === 0}/>
  <label className="form-check-label" htmlFor="flexRadioDefault1">
    Sort by Price
  </label>
</div>
<div className="form-check">
  <input onChange={(e)=>{
  setConfig({...config,sortby:1})
}}  className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked={config.sortby === 1}/>
  <label className="form-check-label" htmlFor="flexRadioDefault2">
    Sort by Distance
  </label>
</div>
</div>
<div className="box2">
<div className="form-check">
  <input onChange={(e)=>{
  setConfig({...config,sortin:0})
}} className="form-check-input" type="radio" name="flexRadioDefault1" id="flexRadioDefault3" checked={config.sortin === 0}/>
  <label className="form-check-label" htmlFor="flexRadioDefault3">
    Increasing order
  </label>
</div>
<div className="form-check">
  <input onChange={(e)=>{
  setConfig({...config,sortin:1})
}} className="form-check-input" type="radio" name="flexRadioDefault1" id="flexRadioDefault4" checked={config.sortin === 1}/>
  <label className="form-check-label" htmlFor="flexRadioDefault4">
    Decreasing order
  </label>
</div>
</div>
</div>
</div>
      <br></br>
      <div className="data">
        {console.log(clinicsdata)}
      {clinicsdata
      .sort(function(a, b){
        if(config.sortby===0){
          if(config.sortin==0){
            return (parseInt(a.price) - parseInt(b.price))
          }else{
            return (-parseInt(a.price) + parseInt(b.price))
          }
        }else{
          if(config.sortin==0){
            return (parseInt(a.dist) - parseInt(b.dist))
          }else{
            return (-parseInt(a.dist) + parseInt(b.dist))
          }
        }
      
      })
      .map((clinic,index)=>{
      if(index<config.size){
      return (
        <>
        <div key={index} className="card">
        <h2 className="title">{clinic.clinicName}</h2>
        <p ><a className="link" target="__blank" href={clinic.website.search("http")===-1?"https://"+clinic.website:clinic.website}>{clinic.website}</a></p>
        <hr/>
        <br/>
        <p className="treatment">Treatment - {clinic.treatment}</p>
        <h3 className="price">Price - {clinic.price}</h3>
        <p className="distance">Distance - {Math.round(clinic.dist)} miles</p>
        </div>
        </>
        
      )}
})}
<br/>
<br/>
<br/>
</div>
      </div>
}
    </div>

   
    
    </>
  );
};

export default Treatmentprice;


