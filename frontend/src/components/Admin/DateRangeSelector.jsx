import React, { useState, useRef, useEffect } from "react";

import { CalendarToday as CalendarIcon } from "@mui/icons-material";



const DateRangeSelector = () => {

  const [selectedRange, setSelectedRange] = useState("today");

  const [showDropdown, setShowDropdown] = useState(false);

  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const [customStartDate, setCustomStartDate] = useState("");

  const [customEndDate, setCustomEndDate] = useState("");

  const dropdownRef = useRef(null);



  // Format date for display

  const formatDate = (date) => {

    return date.toLocaleDateString("en-US", {

      month: "short",

      day: "numeric",

      year: "numeric",

    });

  };



  // Get display text based on selected range

  const getDisplayText = () => {

    const today = new Date();

    const yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);



    switch (selectedRange) {

      case "today":

        return `Today, ${formatDate(today)}`;

      case "yesterday":

        return `Yesterday, ${formatDate(yesterday)}`;

      case "last7":

        const last7 = new Date(today);

        last7.setDate(last7.getDate() - 6);

        return `${formatDate(last7)} - ${formatDate(today)}`;

      case "last30":

        const last30 = new Date(today);

        last30.setDate(last30.getDate() - 29);

        return `${formatDate(last30)} - ${formatDate(today)}`;

      case "custom":

        return customStartDate && customEndDate

          ? `${formatDate(new Date(customStartDate))} - ${formatDate(

              new Date(customEndDate)

            )}`

          : "Select Date Range";

      default:

        return "Select Date Range";

    }

  };



  // Handle range selection

  const handleRangeSelect = (range) => {

    setSelectedRange(range);

    if (range !== "custom") {

      setShowCustomPicker(false);

      setShowDropdown(false);

      console.log("Selected range:", range);

    } else {

      setShowCustomPicker(true);

    }

  };



  // Handle custom range submission

  const handleCustomSubmit = () => {

    if (customStartDate && customEndDate) {

      setSelectedRange("custom");

      setShowCustomPicker(false);

      setShowDropdown(false);

      console.log("Custom range:", customStartDate, "to", customEndDate);

    }

  };



  // Close dropdown when clicking outside

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {

        setShowDropdown(false);

        setShowCustomPicker(false);

      }

    };



    document.addEventListener("mousedown", handleClickOutside);

    return () => {

      document.removeEventListener("mousedown", handleClickOutside);

    };

  }, []);



  return (

    <div className="ms-auto d-flex align-items-center" ref={dropdownRef}>

      <div className="input-group" style={{ width: "220px" }}>

        <span className="input-group-text bg-light border-end-0">

          <CalendarIcon className="text-muted" fontSize="small" />

        </span>

        <input

          type="text"

          className="form-control border-start-0 bg-light cursor-pointer"

          style={{

            fontWeight: "500",

            fontSize: "0.875rem",

            color: "#495057",

            cursor: "pointer",

          }}

          value={getDisplayText()}

          onClick={() => setShowDropdown(!showDropdown)}

          readOnly

        />



        {showDropdown && (

          <div

            className="dropdown-menu show position-absolute shadow-sm"

            style={{

              width: "280px",

              padding: "0",

              border: "1px solid rgba(0,0,0,.15)",

              borderRadius: "0.375rem",

              marginTop: "0.5rem",

            }}

          >

            <div className="list-group list-group-flush">

              <button

                className={`list-group-item list-group-item-action py-2 px-3 ${

                  selectedRange === "today"

                    ? "active bg-primary text-white"

                    : ""

                }`}

                style={{ fontSize: "0.875rem", fontWeight: "400" }}

                onClick={() => handleRangeSelect("today")}

              >

                Today

              </button>

              <button

                className={`list-group-item list-group-item-action py-2 px-3 ${

                  selectedRange === "yesterday"

                    ? "active bg-primary text-white"

                    : ""

                }`}

                style={{ fontSize: "0.875rem", fontWeight: "400" }}

                onClick={() => handleRangeSelect("yesterday")}

              >

                Yesterday

              </button>

              <button

                className={`list-group-item list-group-item-action py-2 px-3 ${

                  selectedRange === "last7"

                    ? "active bg-primary text-white"

                    : ""

                }`}

                style={{ fontSize: "0.875rem", fontWeight: "400" }}

                onClick={() => handleRangeSelect("last7")}

              >

                Last 7 Days

              </button>

              <button

                className={`list-group-item list-group-item-action py-2 px-3 ${

                  selectedRange === "last30"

                    ? "active bg-primary text-white"

                    : ""

                }`}

                style={{ fontSize: "0.875rem", fontWeight: "400" }}

                onClick={() => handleRangeSelect("last30")}

              >

                Last 30 Days

              </button>

              <button

                className={`list-group-item list-group-item-action py-2 px-3 ${

                  selectedRange === "custom"

                    ? "active bg-primary text-white"

                    : ""

                }`}

                style={{ fontSize: "0.875rem", fontWeight: "400" }}

                onClick={() => handleRangeSelect("custom")}

              >

                Custom Range

              </button>

            </div>



            {showCustomPicker && (

              <div className="p-3 border-top">

                <div className="mb-3">

                  <label className="form-label small mb-1">Date Range</label>

                  <div className="row g-2">

                    <div className="col-6">

                      <input

                        type="date"

                        className="form-control form-control-sm"

                        value={customStartDate}

                        onChange={(e) => setCustomStartDate(e.target.value)}

                        max={

                          customEndDate ||

                          new Date().toISOString().split("T")[0]

                        }

                      />

                    </div>

                    <div className="col-6">

                      <input

                        type="date"

                        className="form-control form-control-sm"

                        value={customEndDate}

                        onChange={(e) => setCustomEndDate(e.target.value)}

                        min={customStartDate}

                        max={new Date().toISOString().split("T")[0]}

                      />

                    </div>

                  </div>

                </div>

                <div className="d-flex justify-content-between">

                  <button

                    className="btn btn-sm btn-outline-secondary"

                    onClick={() => setShowCustomPicker(false)}

                  >

                    Cancel

                  </button>

                  <button

                    className="btn btn-sm btn-primary"

                    onClick={handleCustomSubmit}

                    disabled={!customStartDate || !customEndDate}

                  >

                    Apply

                  </button>

                </div>

              </div>

            )}

          </div>

        )}

      </div>

    </div>

  );

};



export default DateRangeSelector;