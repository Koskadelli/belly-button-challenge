// Note that my code did not make use of the HTML onchange="optionChanged(this.value)" method, so I removed it from index.html.
// I take advantage of the fact that the data is pre-sorted in descending order based on sample_values

// JSON data URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Initialize variables
let names = [];
let samples = [];
let metadata = [];

// Fetch the JSON data, console log it, and perform actions
d3.json(url).then(function(data) {

    // Store and log the data
    names = data.names;
    samples = data.samples;
    metadata = data.metadata;
    console.log(data);

    // Populate the dropdown with the subject IDs (names)
    for (let i = 0; i < names.length; i++) {
        opt = d3.select("select").append("option");
        opt.text(names[i]);
    };

    // Set up initial bar graph
    function init1() {
        data1 = [{
          x: samples[0].sample_values.slice(0,10).reverse(),
          y: samples[0].otu_ids.slice(0,10).map(value => `OTU ${value}`).reverse(),
          text: samples[0].otu_labels.slice(0,10).reverse(),
          type: "bar",
          orientation: 'h'
        }];

        layout1 = {
            margin: {t: 0}
        };

        Plotly.newPlot("bar", data1, layout1);
    };

    // Set up initial bubble graph
    function init2() {
        data2 = [{
            x: samples[0].otu_ids,
            y: samples[0].sample_values,
            marker: {
                size: samples[0].sample_values,
                color: samples[0].otu_ids
            },
            text: samples[0].otu_labels,
            mode: "markers"
        }];

        layout2 = {
            height: 600,
            //width: 1200,
            xaxis: {
                title: "OTU ID"
            },
            margin: {t: 10}
        };

        Plotly.newPlot("bubble", data2, layout2);
    };

    // Set up initial gauge chart
    function init3() {
        data3 = [{
            type: "indicator",
            mode: "gauge+number",
            value: metadata[0].wfreq,
            title: {
                text: "Belly Button Washing Frequency<br><sub>Scrubs per Week</sub>",
                font: {size: 16}
            },
            gauge: {
                axis: {
                    range: [0,9]
                }
            }

        }];

        Plotly.newPlot("gauge", data3);
    };

    // Set up initial Demographic Info. Set tr variables to change later.
    let table = d3.select("#sample-metadata").append("table");

    let tr1 = table.append("tr").append("td");
    tr1.text(`id: ${metadata[0].id}`);

    let tr2 = table.append("tr").append("td");
    tr2.text(`ethnicity: ${metadata[0].ethnicity}`);

    let tr3 = table.append("tr").append("td");
    tr3.text(`gender: ${metadata[0].gender}`);

    let tr4 = table.append("tr").append("td");
    tr4.text(`age: ${metadata[0].age}`);

    let tr5 = table.append("tr").append("td");
    tr5.text(`location: ${metadata[0].location}`);

    let tr6 = table.append("tr").append("td");
    tr6.text(`bbtype: ${metadata[0].bbtype}`);

    let tr7 = table.append("tr").append("td");
    tr7.text(`wfreq: ${metadata[0].wfreq}`);
 
    // Call when a change takes place to the DOM
    function dropdownChange() {
        // Call updateBar and updateBubble functions
        updateBar();
        updateBubble();
        updateTable();
        updateGauge();
    };

    d3.select("#selDataset").on("change", dropdownChange);

    // Update bar graph when a dropdown menu item is selected
    function updateBar() {
        // Use D3 to select the dropdown menu
        let dropdownMenu = d3.select("#selDataset");
        // Assign the value of the dropdown menu option to a variable
        let chosenName = dropdownMenu.property("value");
    
        // Initialize x and y arrays
        let x = [];
        let y = [];
        let text = [];
    
        // grab the key of the selected id (name) in the dropdown, use the key to fetch the corresponding sample data
        const matchingKey = Object.keys(names).find(key => names[key] === chosenName);
        x = samples[matchingKey].sample_values.slice(0,10).reverse();
        y = samples[matchingKey].otu_ids.slice(0,10).map(value => `OTU ${value}`).reverse();
        text = samples[matchingKey].otu_labels.slice(0,10).reverse();
    
        // Update Plot
        Plotly.restyle("bar", "x", [x]);
        Plotly.restyle("bar", "y", [y]);
        Plotly.restyle("bar","text",[text]);
    };

    // Update Bubble chart when a dropdown menu item is selected
    function updateBubble() {
        // Use D3 to select the dropdown menu
        let dropdownMenu = d3.select("#selDataset");
        // Assign the value of the dropdown menu option to a variable
        let chosenName = dropdownMenu.property("value");
    
        // Initialize x and y arrays
        let x = [];
        let y = [];
        let size = [];
        let color = [];
        let text = [];
    
        // grab the key of the selected id (name) in the dropdown, use the key to fetch the corresponding sample data
        const matchingKey = Object.keys(names).find(key => names[key] === chosenName);
        x = samples[matchingKey].otu_ids;
        y = samples[matchingKey].sample_values;
        size = samples[matchingKey].sample_values;
        color = samples[matchingKey].otu_ids
        text = samples[matchingKey].otu_labels;
    
        // Update Plot
        Plotly.restyle("bubble", "x", [x]);
        Plotly.restyle("bubble", "y", [y]);
        Plotly.restyle("bubble", "marker.size", [size]);
        Plotly.restyle("bubble", "marker.color", [color]);
        Plotly.restyle("bubble","text",[text]);
    };

    // Update Demographic Table when a dropdown menu item is selected
    function updateTable() {
        // Use D3 to select the dropdown menu
        let dropdownMenu = d3.select("#selDataset");
        // Assign the value of the dropdown menu option to a variable
        let chosenName = dropdownMenu.property("value");

        // grab the key of the selected id (name) in the dropdown, use the key to fetch the corresponding sample data
        const matchingKey = Object.keys(names).find(key => names[key] === chosenName);

        tr1.text(`id: ${metadata[matchingKey].id}`);
        tr2.text(`ethnicity: ${metadata[matchingKey].ethnicity}`);
        tr3.text(`gender: ${metadata[matchingKey].gender}`);
        tr4.text(`age: ${metadata[matchingKey].age}`);
        tr5.text(`location: ${metadata[matchingKey].location}`);
        tr6.text(`bbtype: ${metadata[matchingKey].bbtype}`);
        tr7.text(`wfreq: ${metadata[matchingKey].wfreq}`);
    };

    function updateGauge() {
        // Use D3 to select the dropdown menu
        let dropdownMenu = d3.select("#selDataset");
        // Assign the value of the dropdown menu option to a variable
        let chosenName = dropdownMenu.property("value");
    
        // Initialize x and y arrays
        let value = [];
    
        // grab the key of the selected id (name) in the dropdown, use the key to fetch the corresponding sample data
        const matchingKey = Object.keys(names).find(key => names[key] === chosenName);
        value = metadata[matchingKey].wfreq
    
        // Update Plot
        Plotly.restyle("gauge", "value", [value]);
    };

    init1();
    init2();
    init3();


});

