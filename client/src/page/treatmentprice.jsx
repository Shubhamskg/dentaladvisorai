// import React, { useCallback, useEffect,useLayoutEffect, useReducer, useRef, useState } from "react";
// import { Reload, Rocket, Stop, Tick } from "../assets";
// import { Ads,Chat, New } from "../components";
// import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
// import { setLoading } from "../redux/loading";
// import { useDispatch, useSelector } from "react-redux";
// import { addList, emptyAllRes, insertNew, livePrompt } from "../redux/messages";
// import { emptyUser } from "../redux/user";
// import instance from "../config/instance";
// import "./treatment.scss";
// import {Menu} from "../components";
// import { categoryName } from "../lib/data"
// import axios from "axios";
// import { DensityChart } from "../components/charts/DensityChart";





// const reducer = (state, { type, status }) => {
//   switch (type) {
//     case "chat":
//       return {
//         chat: status,
//         loading: status,
//         resume: status,
//         actionBtns: false,
//       };
//     case "error":
//       return {
//         chat: true,
//         error: status,
//         resume: state.resume,
//         loading: state.loading,
//         actionBtns: state.actionBtns,
//       };
//     case "resume":
//       return {
//         chat: true,
//         resume: status,
//         loading: status,
//         actionBtns: true,
//       };
//     default:
//       return state;
//   }
// };

// const Treatmentprice = () => {
//   const { loading, user } = useSelector((state) => state);
//   const changeColorMode = (to) => {
//     if (to) {
//       localStorage.setItem("darkMode", true);

//       document.body.className = "dark";
//     } else {
//       localStorage.removeItem("darkMode");

//       document.body.className = "light";
//     }
//   };

//   // Dark & Light Mode
//   useLayoutEffect(() => {
//     let mode = localStorage.getItem("darkMode");

//     if (mode) {
//       changeColorMode(true);
//     } else {
//       changeColorMode(false);
//     }
//   });

//   let location = useLocation();

//   const navigate = useNavigate();

//   const dispatch = useDispatch();

//   const chatRef = useRef();


//   const { id = null } = useParams();

//   const [status, stateAction] = useReducer(reducer, {
//     chat: false,
//     error: false,
//     actionBtns: false,
//   });

//   useEffect(() => {
//     if (user) {
//       dispatch(emptyAllRes());
//       setTimeout(() => {
//         if (id) {
//           const getSaved = async () => {
//             let res = null;
//             try {
//               res = await instance.get("/api/chat/saved", {
//                 params: {
//                   chatId: id,
//                 },
//               });
//             } catch (err) {
//               if (err?.response?.data?.status === 404) {
//                 navigate("/404");
//               } else {
//                 alert(err);
//                 dispatch(setLoading(false));
//               }
//             } finally {
//               if (res?.data) {
//                 dispatch(addList({ _id: id, items: res?.data?.data }));
//                 stateAction({ type: "resume", status: false });
//                 dispatch(setLoading(false));
//               }
//             }
//           };

//           getSaved();
//         } else {
//           stateAction({ type: "chat", status: false });
//           dispatch(setLoading(false));
//         }
//       }, 1000);
//     }
//   }, [location]);
//   const [option,setOption]=useState("general")
//   const genRef = useRef(null)
//   const noteRef = useRef(null)
//   const letRef = useRef(null)
//   const filterRef=useRef(null)
//   const path=useLocation().pathname



//   const [mini,setMini]=useState(0)
//   const [maxi,setMaxi]=useState(0)
//   const [avg,setAvg]=useState(0)
//   const [postcode,setPostcode]=useState("")
//   const [distance,setDistance]=useState("")
//   const [category,setCategory]=useState("")
//   const [searchdata,setSearchdata]=useState("")
//   const [Data,setData]=useState([])
//   const [show,setShow]=useState(false)
//   const [fdata,setFdata]=useState({distance:0})
//   const [latlong,setLatlong]=useState([51.5074,-0.1278])
//   const [clinicsdata,setClinicsdata]=useState([])
//   const [config,setConfig]=useState({size:5,sortby:0,sortin:0})

//   const handlesearchevent=async()=>{
//     let res=null;
//     try{
//       res=await axios.get("https://data.dentaladvisor.ai/api/data/search",{
//         params:{
//           searchdata:searchdata
//         }
//       })
//       console.log(res.data)
//       let clinicsdatas=[]
//       let datas=[]
//       let mini=1e9;
//       let maxi=0;
//       for(let i=0;i<res?.data?.length;i++){
//         for(let j=0;j<Math.min(res?.data?.[i]?.data?.length,10);j++){
//           const data=res.data[i].data[j]
//           datas.push(data.Price)
//           mini=Math.min(mini,data.Price)
//           maxi=Math.max(maxi,data.Price)
//         clinicsdatas.push({
//           price:data.Price,
//           clinicName:data.clinicName,
//           treatment:data.treatment,
//           website:data.Website,
//           postcode:data.Postcode,
//         })
//       }
//       }
//       setMaxi(maxi)
//       setMini(mini)
//       setShow(true)
//       setData(datas)
//       setClinicsdata(clinicsdatas)
//     }catch(err){
//       console.log(err)
//     }
//   }
//   const handleSubmit = async () => {
//     let res = null;
//     try {
//       res = await axios.get("https://data.dentaladvisor.ai/api/data", {
//         params: {
//           categoryName: category,
//           postcode:postcode.replaceAll(' ','').toUpperCase(),
//           distance:distance
//         },
//       });
//       console.log("res",res)
//     } catch (err) {
//       if (err?.response?.data?.status === 404) {
//         alert("404")
//       } else {
//         alert(err)
//         console.log("err",err)
//       }
//     } finally {
//       if (res?.data) {
//         let datas=[]
//         let clinicsdatas=[]
//         setFdata({category,distance,postcode})
//         setCategory("")
//         setPostcode("")
//         setDistance("")
//         setMini(res.data.mini!=1000000?res.data.mini:0)
//         setMaxi(res.data.maxi)
//         setAvg(Math.round(res.data.sum/(res?.data?.clinicsdata?.length!=0?res?.data?.clinicsdata?.length:1)))
//         for(let i=0;i<res?.data?.clinicsdata?.length;i++){
//           datas.push(res?.data?.clinicsdata?.[i]?.price)
//           clinicsdatas.push({
//             price:res.data.clinicsdata[i].price,
//             clinicName:res.data.clinicsdata[i].clinicName,
//             treatment:res.data.clinicsdata[i].treatment,
//             website:res.data.clinicsdata[i].website,
//             postcode:res.data.clinicsdata[i].postcode,
//             dist:res.data.clinicsdata[i].dist,
//             ogdata:res.data.clinicsdata[i].ogdata
//           })
//         }
//         setData(datas)
//         console.log("data",clinicsdatas)
//         setShow(true)
//         setLatlong([res.data.lat1,res.data.long1])
//         setClinicsdata(clinicsdatas)
//       }
//     }
// } 



//   return (
//     <>
//     {user && (
//         <div>
//           {/* <Menu changeColorMode={changeColorMode} /> */}
//         </div>
//       )}
//     <div className="main">
//       <div className="navbar">
//         <button className="option_button" ref={genRef} onClick={()=>{setOption("general");if(path!='/')navigate("/"); genRef.current.classList.add("active"), noteRef.current.classList.remove("active"), letRef.current.classList.remove("active")}}>Dental GPT</button>
//         <button className="option_button" ref={noteRef} onClick={()=>{setOption("notes");if(path!='/')navigate("/");  noteRef.current.classList.add("active"),genRef.current.classList.remove("active"), letRef.current.classList.remove("active")}}>Clinical Notes</button>
//         <button className="option_button" ref={letRef} onClick={()=>{setOption("letters");if(path!='/')navigate("/"); letRef.current.classList.add("active"),noteRef.current.classList.remove("active"), genRef.current.classList.remove("active")}}>Patient Letters</button>
//         <button className="option_button active"  onClick={()=>{setOption("price"); navigate("/treatmentprice")}}>Treatment Price</button>
//         <button className="option_button"  onClick={()=>{navigate("/patient")}}>Patient Portal</button>

//       </div>
//       </div>
      
//       <div className="contentsArea">
//         <div className="cover"></div>
//     <div className="homePage">
//           <div className="searchBar">
//             <input className="search" onChange={(e)=>{setSearchdata(e.target.value)}}  onKeyDown={(evt)=>{
//                var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
//                if(keyCode==13){
//                 handlesearchevent()
//                }
//                }} placeholder="Search Treatment Category Name"/>
//             <div ref={filterRef} className="filter">
//         <input list="categoryName"  onChange={(e)=>{setCategory(e.target.value)}} value={category} type="text" name="categoryName" placeholder="Please Select Treatment Category" />
//         <datalist id="categoryName">
//     {categoryName.map((category)=>(
//       <option key={category} value={category}/>
//     ))}
//   </datalist>
//         <input list="postcode" onChange={(e)=>{setPostcode(e.target.value)}} value={postcode} type="text" name="postcode" placeholder="Postal Code" />
//         <input onChange={(e)=>{setDistance(e.target.value)}} value={distance}
//           type="number"
//           name="distance"
//           placeholder="Distance (miles)"
//         />
//         <div className="action">
//         <button className="clear" onClick={()=>{
//           setDistance("")
//           setCategory("")
//           setPostcode("")
//           filterRef.current.classList.remove("click")
//         }}>
//           Clear
//         </button>
//         <button className="apply" onClick={()=>{handleSubmit();filterRef.current.classList.remove("click")}}>
//           Apply
//         </button>
//         </div>
//         </div>
//         <button className="filter_button"  onClick={()=>{
//           filterRef.current.classList.add("click")
//         }}>
//           Filter
//         </button>
//       </div>
//     <br></br>
//     <br></br>
//     {show?
   
//           <h2>Price Distribution of <i>{fdata?.category?.toUpperCase()}</i> in range of <i>{fdata.distance}</i> miles from <i>{fdata?.postcode?.toUpperCase()}</i></h2>
//           :""}
//           {show?<div className="chart"><DensityChart data={Data} width={850} height={400} mini={mini} maxi={maxi} /></div>:""}
//           {show?<div className="boxes">
//             <div className="box">
//               <h1>£{mini}</h1>
//               <h2>Minimum</h2>
//             </div>
//             <br></br>
//             <div className="box">
//               <h1>£{avg}</h1>
//               <h2>Average</h2>
//             </div>
//             <br></br>
//             <div className="box">
//               <h1>£{maxi}</h1>
//               <h2>Maximum</h2>
//             </div>
//           </div>:""}
        
//     </div>
//     {show && 
//     <div className="clinic">
//       <div className="titl">
//       <h1>Clinic Data for Treatment Category :   {fdata.category}</h1>
//       </div>
//       <div className="change">
//       <div className="box">
//       <label className="label" htmlFor="cars">No of data</label>
// <select onChange={(e)=>{
//   setConfig({...config,size:e.target.value})
// }} className="input" name="cars" id="cars">
//   <option value="5">5</option>
//   <option value="10">10</option>
//   <option value="15">15</option>
//   <option value="20">20</option>
// </select>
// </div>
// <div className="boxs">
// <div className="box2">
// <div className="form-check">
//   <input onChange={(e)=>{
//   setConfig({...config,sortby:0})
// }}  className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked={config.sortby === 0}/>
//   <label className="form-check-label" htmlFor="flexRadioDefault1">
//     Sort by Price
//   </label>
// </div>
// <div className="form-check">
//   <input onChange={(e)=>{
//   setConfig({...config,sortby:1})
// }}  className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked={config.sortby === 1}/>
//   <label className="form-check-label" htmlFor="flexRadioDefault2">
//     Sort by Distance
//   </label>
// </div>
// </div>
// <div className="box2">
// <div className="form-check">
//   <input onChange={(e)=>{
//   setConfig({...config,sortin:0})
// }} className="form-check-input" type="radio" name="flexRadioDefault1" id="flexRadioDefault3" checked={config.sortin === 0}/>
//   <label className="form-check-label" htmlFor="flexRadioDefault3">
//     Increasing order
//   </label>
// </div>
// <div className="form-check">
//   <input onChange={(e)=>{
//   setConfig({...config,sortin:1})
// }} className="form-check-input" type="radio" name="flexRadioDefault1" id="flexRadioDefault4" checked={config.sortin === 1}/>
//   <label className="form-check-label" htmlFor="flexRadioDefault4">
//     Decreasing order
//   </label>
// </div>
// </div>
// </div>
// </div>
//       <br></br>
//       <div className="data">
//         {console.log(clinicsdata)}
//       {clinicsdata
//       .sort(function(a, b){
//         if(config.sortby===0){
//           if(config.sortin==0){
//             return (parseInt(a.price) - parseInt(b.price))
//           }else{
//             return (-parseInt(a.price) + parseInt(b.price))
//           }
//         }else{
//           if(config.sortin==0){
//             return (parseInt(a.dist) - parseInt(b.dist))
//           }else{
//             return (-parseInt(a.dist) + parseInt(b.dist))
//           }
//         }
      
//       })
//       .map((clinic,index)=>{
//       if(index<config.size){
//       return (
//         <>
//         <div key={index} className="card">
//         <h2 className="title">{clinic.clinicName}</h2>
//         <p ><a className="link" target="__blank" href={clinic.website.search("http")===-1?"https://"+clinic.website:clinic.website}>{clinic.website}</a></p>
//         <hr/>
//         <br/>
//         <p className="treatment">Treatment - {clinic.treatment}</p>
//         <h3 className="price">Price - {clinic.price}</h3>
//         <p className="distance">Distance - {Math.round(clinic.dist)} miles</p>
//         </div>
//         </>
        
//       )}
// })}
// <br/>
// <br/>
// <br/>
// </div>
//       </div>
// }
//     </div>

   
    
//     </>
//   );
// };

// export default Treatmentprice;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { DensityChart } from '../components/charts/DensityChart';
import { categoryName } from '../lib/data';
import './treatment.scss';

const TreatmentPrice = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchData, setSearchData] = useState('');
  const [category, setCategory] = useState('');
  const [postcode, setPostcode] = useState('');
  const [distance, setDistance] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [priceData, setPriceData] = useState([]);
  const [clinicsData, setClinicsData] = useState([]);
  const [filterData, setFilterData] = useState({ category: '', distance: '', postcode: '' });
  const [priceStats, setPriceStats] = useState({ min: 0, max: 0, avg: 0 });
  const [config, setConfig] = useState({ size: 5, sortBy: 'price', sortOrder: 'asc' });

  const handleSearch = async () => {
    try {
      const res = await axios.get('https://data.dentaladvisor.ai/api/data/search', {
        params: { searchdata: searchData }
      });
      processSearchResults(res.data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleFilter = async () => {
    try {
      const res = await axios.get('https://data.dentaladvisor.ai/api/data', {
        params: {
          categoryName: category,
          postcode: postcode.replaceAll(' ', '').toUpperCase(),
          distance: distance
        }
      });
      processFilterResults(res.data);
    } catch (err) {
      console.error('Filter error:', err);
    }
  };

  const processSearchResults = (data) => {
    let clinics = [];
    let prices = [];
    let min = Infinity;
    let max = 0;

    data.forEach(item => {
      item.data.slice(0, 10).forEach(clinic => {
        clinics.push({
          price: clinic.Price,
          clinicName: clinic.clinicName,
          treatment: clinic.treatment,
          website: clinic.Website,
          postcode: clinic.Postcode,
        });
        prices.push(clinic.Price);
        min = Math.min(min, clinic.Price);
        max = Math.max(max, clinic.Price);
      });
    });

    setPriceStats({ min, max, avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) });
    setPriceData(prices);
    setClinicsData(clinics);
    setShowResults(true);
  };

  const processFilterResults = (data) => {
    setFilterData({ category, distance, postcode });
    setPriceStats({
      min: data.mini !== 1000000 ? data.mini : 0,
      max: data.maxi,
      avg: Math.round(data.sum / (data.clinicsdata.length || 1))
    });
    setPriceData(data.clinicsdata.map(clinic => clinic.price));
    setClinicsData(data.clinicsdata.map(clinic => ({
      price: clinic.price,
      clinicName: clinic.clinicName,
      treatment: clinic.treatment,
      website: clinic.website,
      postcode: clinic.postcode,
      dist: clinic.dist,
    })));
    setShowResults(true);
    setCategory('');
    setPostcode('');
    setDistance('');
  };

  const sortedClinics = clinicsData
    .sort((a, b) => {
      const sortValue = config.sortBy === 'price' ? 'price' : 'dist';
      return config.sortOrder === 'asc' 
        ? a[sortValue] - b[sortValue] 
        : b[sortValue] - a[sortValue];
    })
    .slice(0, config.size);

  return (
    <div className="treatment-price">
      <nav className="navbar">
        <button onClick={() => navigate('/')}>Dental GPT</button>
        <button onClick={() => navigate('/')}>Clinical Notes</button>
        <button onClick={() => navigate('/')}>Patient Letters</button>
        <button className="active">Treatment Price</button>
        <button onClick={() => navigate('/patient')}>Patient Portal</button>
      </nav>

      <main className="content">
        <section className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search Treatment Category Name"
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          <div className="filter">
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select Treatment Category</option>
              {categoryName.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Postal Code"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
            />
            <input
              type="number"
              placeholder="Distance (miles)"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            />
            <button onClick={handleFilter}>Apply Filter</button>
          </div>
        </section>

        {showResults && (
          <section className="results-section">
            <h2>Price Distribution of <em>{filterData.category.toUpperCase()}</em></h2>
            <p>Range: <em>{filterData.distance}</em> miles from <em>{filterData.postcode.toUpperCase()}</em></p>

            <div className="chart-container">
              <DensityChart 
                data={priceData} 
                width={850} 
                height={400} 
                mini={priceStats.min} 
                maxi={priceStats.max} 
              />
            </div>

            <div className="price-stats">
              <div className="stat-box">
                <h3>£{priceStats.min}</h3>
                <p>Minimum</p>
              </div>
              <div className="stat-box">
                <h3>£{priceStats.avg}</h3>
                <p>Average</p>
              </div>
              <div className="stat-box">
                <h3>£{priceStats.max}</h3>
                <p>Maximum</p>
              </div>
            </div>

            <section className="clinics-section">
              <h2>Clinic Data for Treatment Category: {filterData.category}</h2>
              
              <div className="config-controls">
                <div>
                  <label htmlFor="size-select">Show:</label>
                  <select 
                    id="size-select"
                    value={config.size} 
                    onChange={(e) => setConfig({...config, size: Number(e.target.value)})}
                  >
                    {[5, 10, 15, 20].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Sort by:</label>
                  <label>
                    <input 
                      type="radio" 
                      name="sortBy" 
                      value="price"
                      checked={config.sortBy === 'price'}
                      onChange={() => setConfig({...config, sortBy: 'price'})}
                    /> Price
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="sortBy" 
                      value="distance"
                      checked={config.sortBy === 'distance'}
                      onChange={() => setConfig({...config, sortBy: 'distance'})}
                    /> Distance
                  </label>
                </div>
                <div>
                  <label>Order:</label>
                  <label>
                    <input 
                      type="radio" 
                      name="sortOrder" 
                      value="asc"
                      checked={config.sortOrder === 'asc'}
                      onChange={() => setConfig({...config, sortOrder: 'asc'})}
                    /> Ascending
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="sortOrder" 
                      value="desc"
                      checked={config.sortOrder === 'desc'}
                      onChange={() => setConfig({...config, sortOrder: 'desc'})}
                    /> Descending
                  </label>
                </div>
              </div>

              <div className="clinics-grid">
                {sortedClinics.map((clinic, index) => (
                  <div key={index} className="clinic-card">
                    <h3>{clinic.clinicName}</h3>
                    <a href={clinic.website.includes('http') ? clinic.website : `https://${clinic.website}`} target="_blank" rel="noopener noreferrer">
                      {clinic.website}
                    </a>
                    <p>Treatment: {clinic.treatment}</p>
                    <p>Price: £{clinic.price}</p>
                    <p>Distance: {Math.round(clinic.dist)} miles</p>
                  </div>
                ))}
              </div>
            </section>
          </section>
        )}
      </main>
    </div>
  );
};

export default TreatmentPrice;
