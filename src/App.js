import { useEffect, useState } from "react";
import "./App.css";
// var MultiMap = require("collections/multi-map");



function App() {
  const [dataSet, setDataSet] = useState([]);
  const [tempDataSet, settempDataSet] = useState([]);
  const [count, setCount] = useState(0);

  const [UserData, setUserData] = useState([]);

  
  window.onload=function(){
    document.getElementById("first").click();
  };

  useEffect(() => {
    fetch("https://assessment.api.vweb.app/rides")
      .then((response) => response.json())
      .then((data) => {
        const rideInfo = data;
        // console.log(rideInfo);
        settempDataSet(rideInfo);
        setDataSet(rideInfo);
      }).then(rideFilter("nearest"));
  }, 0);

  // "https://assessment.api.vweb.app/user

  useEffect(() => {
    fetch("https://assessment.api.vweb.app/user")
      .then((response) => response.json())
      .then((userData) => {
        const userInfo = userData;
        // console.log(userInfo);

        setUserData(userInfo);
        
      });
  }, 0);

  const rideFilter = (rideType) => {
    if (rideType === "nearest") {
      const station_code = parseInt(UserData.station_code);
      const DistanceMap = new Map();
      dataSet.map((eachUser) => {
        var min = 10000000;
        for (var i = 0; i < eachUser.station_path.length; i++) {
          if (Math.abs(eachUser.station_path[i] - station_code) < min) {
            min = Math.abs(eachUser.station_path[i] - station_code);
          }
        }
        DistanceMap.set(eachUser, min);
      });
      const sortedDistance = new Map(
        [...DistanceMap].sort((a, b) => a[1] - b[1])
      );
      const mainSorted=new Array();
      for (var ele of sortedDistance) {
          let abc=ele[0];
          abc["dist"]=sortedDistance.get(ele[0]);
          mainSorted.push(abc);
      }
      
      settempDataSet(mainSorted);
      
    }

    if (rideType === "upcoming") {
      const updatedItems = dataSet.filter((today) => {
        return new Date(today.date) - new Date() > 0;
      });
      settempDataSet(updatedItems);
    }

    if (rideType === "past") {
      const updatedItems = dataSet.filter((today) => {
        return new Date(today.date) - new Date() < 0;
      });
      settempDataSet(updatedItems);
    }
  };

  //   city Filter
  const cityFilter = (cityName) => {
    console.log(cityName);

    const sortedCity = dataSet.filter((eachEle) => {
      return eachEle.city === cityName;
    });
    settempDataSet(sortedCity);
  };

  const stateFilter = (stateName) => {
    console.log(1);
    // const sortedState = dataSet.filter((eachEle) => {
    //   console.log(eachEle.state);
    //   return eachEle.state === stateName;
    // });
    // settempDataSet(sortedState);
  };

  const citySet = new Set();
  const stateMap = new Map();
  dataSet.map((eachData) => {
    citySet.add(eachData.city);

    if (stateMap.has(eachData.state)) {
      const count = stateMap.get(eachData.state);
      stateMap.set(eachData.state, count + 1);
    } else {
      stateMap.set(eachData.state, 1);
    }
  });


  //   console.log(stateMap.key);
  //   for (let item of stateSet) {
  //       console.log(item)
  //   }
  //   console.log(stateSet.size)

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="App">
      <div className="content">
        <div className="navbar ">
          <div className="container nav ">
            <div className="edvora_name ">
              <h1 id="sitename">Edvora</h1>
            </div>

            <div className="user-info">
              <div className="user-name">
                <p>{UserData.name}</p>
              </div>
              <div className="user-photo">
                <img src={UserData.url} alt="image" />
              </div>
            </div>
          </div>
        </div>

        {/* Navbar done */}

        <div className="container">
          <div id="main-box">
            <div className="outer-box">
              <div className="top-box">
                <div className="varities container">
                <a href="#">
                    <p
                      className="selected bold "
                      onClick={()=>{
                          rideFilter("nearest");
                        }}
                    >
                      All
                    </p>
                  </a>
                  <a href="#">
                    <p
                      className=" text-dark "
                      id="first"
                      onClick={()=>{
                          rideFilter("nearest");
                        }}
                    >
                      Nearest rides
                    </p>
                  </a>
                  <a href="#">
                    <p
                      className="text-dark"
                      onClick={() => {
                        rideFilter("upcoming");
                      }}
                    >
                      Upcoming rides ({tempDataSet.length})
                    </p>
                  </a>
                  <a href="#">
                    <p
                      className="text-dark"
                      onClick={() => {
                        rideFilter("past");
                      }}
                    >
                      Past rides ({tempDataSet.length})
                    </p>
                  </a>
                </div>

                <div className="filter">
                  <i className="fa fa-bars" aria-hidden="true"></i>
                  <p
                    className="text-dark"
                    onClick={() => {
                      stateFilter("Chandigarh");
                    }}
                  >
                    State
                  </p>
                  {/* <select className="form-control" >
                    {this.state.stateSet.map(list=>(
                        <option key={list} value={list}> {list}</option>
                    ))}
                </select> */}

                  <p
                    className="text-dark"
                    onClick={() => {
                      cityFilter("New Delhi");
                    }}
                  >
                    City
                  </p>
                </div>
              </div>
              {/* 
                <!-- top box done --> */}

              <div className="container rides">
                {tempDataSet.map((eachData) => {
                  const ride_id = eachData.id;
                  const origin_station_code = eachData.origin_station_code;
                  const station_path = eachData.station_path;
                  const destination_code = eachData.destination_station_code;
                  const date = eachData.date;
                  const map_url = eachData.map_url;
                  const state = eachData.state;
                  const city = eachData.city;
                  const month = parseInt(date.slice(0, 2));
                  const day = parseInt(date.slice(3, 5));
                  const time = date.slice(11);
                  const monthName = months[month + 1];
                  const year = parseInt(date.slice(6, 10));
                  const dist=eachData.dist;
                  // console.log(station_path);
                  //   console.log(month);
                  // console.log(day);
                  // console.log(eachData);

                  return (
                    <div className="container boxes">
                      <div className="all-data">
                        <div className="ride-map">
                          <img src={map_url} alt="image" />
                        </div>

                        <div className="ride-info">
                          <div className="ride-id ">
                            <p>
                              Ride ID : <span>{ride_id}</span>
                            </p>
                          </div>
                          <div className="origin-station">
                            <p>
                              Origin Station :<span>{origin_station_code}</span>{" "}
                            </p>
                          </div>
                          <div className="station_path">
                            <p>
                              Station Path: [
                              <span>
                                {station_path.map((num) => (
                                  <span>{num + ","}</span>
                                ))}
                              </span>
                              ]
                            </p>
                          </div>
                          <div className="date">
                            <p>
                              Date :
                              <span>
                                {day +
                                  "th " +
                                  monthName +
                                  " " +
                                  year +
                                  " " +
                                  time}
                              </span>
                            </p>
                          </div>
                          <div className="distance">
                            <p>
                              Distance : <span>{dist}</span>
                            </p>
                          </div>
                        </div>

                        <div className="city-name curly ">
                          <p>{city}</p>
                        </div>
                        <div className="state-name curly ">
                          <p>{state}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
