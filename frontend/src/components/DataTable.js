import React from "react";

const DataTable = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>No data available for the selected filters.</p>;
    }

    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Time Slot</th>
                    <th>Bus Line</th>
                    <th>Age Group</th>
                    <th>Total Revenue</th>
                    <th>Total Trips</th>
                    <th>Avg Yield/Trip</th>
                    <th>Avg Yield/KM</th>
                    <th>Avg Yield/Vehicle</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                        <td>{row.time_slot}</td>
                        <td>{row.bus_line}</td>
                        <td>{row.age_group}</td>
                        <td>LEK {row.total_revenue.toLocaleString()}</td>
                        <td>{row.total_trips}</td>
                        <td>LEK {row.avg_yield_per_trip.toFixed(2)}</td>
                        <td>LEK {row.avg_yield_per_km.toFixed(6)}</td>
                        <td>LEK {row.avg_yield_per_vehicle.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DataTable;
