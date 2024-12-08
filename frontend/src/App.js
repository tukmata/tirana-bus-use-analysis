import React, { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import { fetchAggregatedData } from "./services/api";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import BarChart from "./components/BarChart";
import LineChart from "./components/LineChart";
import PieChart from "./components/PieChart";
import DataTable from "./components/DataTable";
import Pagination from "./components/Pagination";

const App = () => {
    const [aggregatedData, setAggregatedData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [timeSlotFilter, setTimeSlotFilter] = useState([]);
    const [busLineFilter, setBusLineFilter] = useState([]);
    const [ageGroupFilter, setAgeGroupFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        const getAggregatedData = async () => {
            const data = await fetchAggregatedData();
            setAggregatedData(data);
            setFilteredData(data);
        };
        getAggregatedData();
    }, []);

    const totalTrips = useMemo(
        () => filteredData.reduce((sum, row) => sum + row.total_trips, 0),
        [filteredData]
    );
    const totalYield = useMemo(
        () => filteredData.reduce((sum, row) => sum + row.total_yield, 0).toFixed(2),
        [filteredData]
    );
    const totalRevenue = useMemo(
        () => filteredData.reduce((sum, row) => sum + row.total_revenue, 0).toLocaleString(),
        [filteredData]
    );
    const avgYield = useMemo(
        () =>
            (
                filteredData.reduce((sum, row) => sum + row.avg_yield_per_trip, 0) /
                filteredData.length || 0
            ).toFixed(2),
        [filteredData]
    );

    const applyFilters = () => {
        let filtered = aggregatedData;

        if (timeSlotFilter.length > 0) {
            filtered = filtered.filter((item) => timeSlotFilter.includes(item.time_slot));
        }
        if (busLineFilter.length > 0) {
            filtered = filtered.filter((item) => busLineFilter.includes(item.bus_line));
        }
        if (ageGroupFilter !== "All") {
            filtered = filtered.filter((item) => item.age_group === ageGroupFilter);
        }

        setFilteredData(filtered);
        setCurrentPage(1); // Reset pagination on filter change
    };

    useEffect(() => {
        applyFilters();
    }, [timeSlotFilter, busLineFilter, ageGroupFilter]);

    const busLineOptions = useMemo(
        () =>
            [...new Set(aggregatedData.map((item) => item.bus_line))].map((line) => ({
                value: line,
                label: `Bus Line ${line}`,
            })),
        [aggregatedData]
    );

    const timeSlotOptions = [
        { value: "07:00-10:00", label: "07:00-10:00" },
        { value: "10:00-16:00", label: "10:00-16:00" },
        { value: "16:00-20:00", label: "16:00-20:00" },
    ];

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage]);

    const groupedByTimeSlot = useMemo(() => {
        return filteredData.reduce((acc, row) => {
            if (!acc[row.time_slot]) {
                acc[row.time_slot] = { total_revenue: 0, total_trips: 0 };
            }
            acc[row.time_slot].total_revenue += row.total_revenue;
            acc[row.time_slot].total_trips += row.total_trips;
            return acc;
        }, {});
    }, [filteredData]);

    const timeSlotTrends = useMemo(() => {
        return Object.keys(groupedByTimeSlot).map((key) => ({
            time_slot: key,
            total_revenue: groupedByTimeSlot[key].total_revenue,
            total_trips: groupedByTimeSlot[key].total_trips,
        }));
    }, [groupedByTimeSlot]);

    const barChartData = useMemo(() => {
        const grouped = filteredData.reduce((acc, item) => {
            if (!acc[item.bus_line]) {
                acc[item.bus_line] = { bus_line: item.bus_line, total_yield: 0 };
            }
            acc[item.bus_line].total_yield += item.total_yield;
            return acc;
        }, {});

        return Object.values(grouped);
    }, [filteredData]);

    const pieChartData = useMemo(() => {
        const grouped = filteredData.reduce((acc, item) => {
            if (!acc[item.age_group]) {
                acc[item.age_group] = { age_group: item.age_group, total_revenue: 0 };
            }
            acc[item.age_group].total_revenue += item.total_revenue;
            return acc;
        }, {});

        return Object.values(grouped);
    }, [filteredData]);

    const downloadCSV = () => {
        const csvHeaders = [
            `"Time Slot"`,
            `"Bus Line"`,
            `"Age Group"`,
            `"Total Revenue (LEK)"`,
            `"Total Trips"`,
            `"Average Yield Per Trip (LEK)"`,
        ].join(",");
    
        const csvRows = filteredData
            .map(
                (row) =>
                    `"${row.time_slot}","${row.bus_line}","${row.age_group}","${row.total_revenue}","${row.total_trips}","${row.avg_yield_per_trip}"`
            )
            .join("\n");
    
        const csvContent = `${csvHeaders}\n${csvRows}`;
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "filtered_aggregated_data.csv");
    };
    
    const downloadPDF = async () => {
        const container = document.querySelector(".container");
        const canvas = await html2canvas(container);
        const imgData = canvas.toDataURL("image/png");
    
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.text(`Filters Applied:`, 10, 10);
        pdf.text(`Time Slots: ${timeSlotFilter.map((t) => t.label).join(", ") || "All"}`, 10, 20);
        pdf.text(`Bus Lines: ${busLineFilter.map((b) => b.label).join(", ") || "All"}`, 10, 30);
        pdf.text(`Age Groups: ${ageGroupFilter.map((a) => a.label).join(", ") || "All"}`, 10, 40);
    
        pdf.addImage(imgData, "PNG", 10, 50, 190, 120);
        pdf.save("dashboard_filtered_data.pdf");
    };    

    return (
        <div className="container mt-5">
            <h1 className="text-center">Dashboard</h1>
            <div className="row mb-4">
                <div className="col-md-6">
                    <label className="form-label">Filter by Bus Line:</label>
                    <Select
                        isMulti
                        options={busLineOptions}
                        onChange={(selectedOptions) =>
                            setBusLineFilter(selectedOptions ? selectedOptions.map((option) => option.value) : [])
                        }
                        placeholder="Select Bus Lines"
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Filter by Time Slot:</label>
                    <Select
                        isMulti
                        options={timeSlotOptions}
                        onChange={(selectedOptions) =>
                            setTimeSlotFilter(selectedOptions ? selectedOptions.map((option) => option.value) : [])
                        }
                        placeholder="Select Time Slots"
                    />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Total Trips</h5>
                            <p className="card-text">{totalTrips.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Total Yield</h5>
                            <p className="card-text">{totalYield} LEK</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Total Revenue</h5>
                            <p className="card-text">{totalRevenue} LEK</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Average Yield per Trip</h5>
                            <p className="card-text">{avgYield} LEK</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-12 text-end">
                    <button className="btn btn-primary me-2" onClick={downloadCSV}>
                        Export CSV
                    </button>
                    <button className="btn btn-secondary" onClick={downloadPDF}>
                        Export PDF
                    </button>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-12">
                    <h2>Time Slot Trends</h2>
                    <LineChart data={timeSlotTrends} xKey="time_slot" yKey="total_revenue" />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-12">
                    <h2>Yield by Bus Line</h2>
                    <BarChart data={barChartData} xKey="bus_line" yKey="total_yield" />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-12">
                    <h2>Demographic Distribution (Yield by Age Group)</h2>
                    <PieChart data={pieChartData} xKey="age_group" yKey="total_revenue" />
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <h2>Data Table</h2>
                    <DataTable data={paginatedData} />
                    <Pagination
                        currentPage={currentPage}
                        totalRows={filteredData.length}
                        rowsPerPage={rowsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
