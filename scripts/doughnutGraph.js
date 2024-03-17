const getChartOptions = () => {
    return {
        series: [35.1, 23.5, 2.4],
        colors: ["#1C64F2", "#16BDCA", "#FDBA8C"],
        chart: {
            height: 320,
            width: "100%",
            type: "donut",
        },
        stroke: {
            colors: ["transparent"],
            lineCap: "",
        },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontFamily: "Inter, sans-serif",
                            offsetY: 20,
                        },
                        total: {
                            showAlways: true,
                            show: true,
                            fontFamily: "Inter, sans-serif",
                            formatter: function (w) {
                                const sum = w.globals.seriesTotals.reduce((a, b) => {
                                    return a + b
                                }, 0)
                                return + sum + ' Calories left'
                            },
                        },
                        value: {
                            show: true,
                            fontFamily: "Inter, sans-serif",
                            offsetY: -20,
                            formatter: function (value) {
                                return value + " Calories"
                            },
                        },
                    },
                    size: "80%",
                },
            },
        },
        grid: {
            padding: {
                top: -2,
            },
        },
        labels: ["Consumed", "Burned", "Remaining"],
        dataLabels: {
            enabled: false,
        },
        legend: {
            position: "bottom",
            fontFamily: "Inter, sans-serif",
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return value + "k"
                },
            },
        },
        xaxis: {
            labels: {
                formatter: function (value) {
                    return value + "k"
                },
            },
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
        },
    }
}

if (document.getElementById("donut-chart") && typeof ApexCharts !== 'undefined') {
    const chart = new ApexCharts(document.getElementById("donut-chart"), getChartOptions());
    chart.render();

    // Get all the checkboxes by their class name
    const checkboxes = document.querySelectorAll('#devices input[type="checkbox"]');

    // Function to handle the checkbox change event
    function handleCheckboxChange(event, chart) {
        const checkbox = event.target;
        if (checkbox.checked) {
            switch (checkbox.value) {
                case 'General':
                    chart.updateSeries([15.1, 22.5, 4.4]);
                    break;
                case 'Excersize':
                    chart.updateSeries([25.1, 26.5, 1.4]);
                    break;
                case 'Calories/nutrition':
                    chart.updateSeries([45.1, 27.5, 8.4]);
                    break;
                default:
                    chart.updateSeries([55.1, 28.5, 1.4]);
            }

        } else {
            chart.updateSeries([35.1, 23.5, 2.4]);
        }
    }

    // Attach the event listener to each checkbox
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', (event) => handleCheckboxChange(event, chart));
    });
}
